import re
import os
import httpx
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.models import Product, FabricOption, Faq, Order, ChatLog, User
from schemas.schemas import ChatRequest, ChatResponse, ChatLogOut
from routers.auth import get_optional_user, get_current_admin
from typing import Optional, List

router = APIRouter(prefix="/api/chat", tags=["AI RAG Chatbot"])

N8N_WEBHOOK_URL  = os.getenv("N8N_WEBHOOK_URL", "")
GEMINI_API_KEY   = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL       = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"

SYSTEM_PROMPT = (
    "You are AURA-AI, the official AI assistant for AURA-WEAR — a premium custom clothing brand based in Pakistan. "
    "Help customers with fabric recommendations, garment types, print methods, order tracking, and pricing in PKR. "
    "Use the DATABASE CONTEXT provided to answer questions; if no relevant context is present, reply helpfully using general knowledge about AURA-WEAR. "
    "When order data is in context, clearly state the order ID, status, and total. "
    "For greetings or small talk, respond warmly and invite the customer to ask about products, fabrics, or orders. "
    "Keep answers concise (2-4 sentences), friendly, and professional. "
    "Never reveal internal system names, tools, APIs, or how data is retrieved."
)


@router.post("", response_model=ChatResponse)
async def chat(
    chat_req: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = chat_req.message
    clean_query = query.lower()
    retrieved_rows = []
    order_row = None

    # ── 1. RAG RETRIEVAL ─────────────────────────────────────────────────────

    # Orders: match explicit ORD-xxxxxx in message, OR always pull latest 3
    # orders for logged-in users so the AI always has context
    if current_user:
        recent_res = await db.execute(
            select(Order)
            .where(Order.user_id == current_user.user_id)
            .order_by(Order.created_at.desc())
            .limit(3)
        )
        recent_orders = recent_res.scalars().all()
        for o in recent_orders:
            retrieved_rows.append(
                f"Order ID: {o.order_id} | Status: {o.status} | "
                f"Total: PKR {o.total_price} | Payment: {o.payment_status} | "
                f"Shipping: {o.shipping_method or 'Standard'} | "
                f"Date: {o.created_at.strftime('%Y-%m-%d')}"
            )
        if recent_orders:
            order_row = recent_orders[0]

    # If a specific order ID is mentioned, look it up directly (overrides above)
    oid_match = re.search(r"ord-\d+", clean_query)
    if oid_match:
        oid = oid_match.group(0).upper()
        specific_res = await db.execute(
            select(Order).where(Order.order_id == oid)
        )
        specific_order = specific_res.scalars().first()
        if specific_order:
            order_row = specific_order
            # Ensure this order is at the top of context
            entry = (
                f"Order ID: {specific_order.order_id} | Status: {specific_order.status} | "
                f"Total: PKR {specific_order.total_price} | Payment: {specific_order.payment_status} | "
                f"Shipping: {specific_order.shipping_method or 'Standard'} | "
                f"Date: {specific_order.created_at.strftime('%Y-%m-%d')}"
            )
            if entry not in retrieved_rows:
                retrieved_rows.insert(0, entry)

    # Products: match by category or name keywords
    is_product_query = any(kw in clean_query for kw in [
        "product", "tshirt", "t-shirt", "hoodie", "jacket", "uniform",
        "price", "cost", "fabric", "cotton", "fleece", "polyester",
        "buy", "shop", "catalog", "available", "sport"
    ])
    if is_product_query:
        prod_res = await db.execute(select(Product).where(Product.is_active == True).limit(20))
        all_prods = prod_res.scalars().all()
        for p in all_prods:
            if (p.name.lower() in clean_query
                    or p.category.lower() in clean_query
                    or any(w in clean_query for w in p.name.lower().split())):
                retrieved_rows.append(
                    f"Product: {p.name} | Category: {p.category} | "
                    f"Base Price: PKR {p.base_price} | Gender: {p.gender}"
                )

    # Fabrics: match by type name
    fab_keywords = ["fabric", "cotton", "fleece", "polyester", "blend",
                    "material", "gsm", "grade", "winter", "summer"]
    if any(kw in clean_query for kw in fab_keywords):
        fab_res = await db.execute(select(FabricOption))
        all_fabs = fab_res.scalars().all()
        seen = set()
        for f in all_fabs:
            if f.type not in seen and (
                f.type in clean_query
                or any(w in clean_query for w in f.name.lower().split())
                or "fabric" in clean_query
            ):
                seen.add(f.type)
                retrieved_rows.append(
                    f"Fabric: {f.name} | Type: {f.type} | "
                    f"Grade: {f.grade} | Price Multiplier: {f.price_multiplier}x"
                )

    # FAQs: keyword match
    faq_res = await db.execute(select(Faq))
    all_faqs = faq_res.scalars().all()
    for faq in all_faqs:
        words = [w for w in faq.question.split() if len(w) > 3]
        if any(w in clean_query for w in words):
            retrieved_rows.append(f"FAQ: {faq.answer}")

    retrieved_context = "\n".join(retrieved_rows) if retrieved_rows else "No specific data found for this query."

    # ── 2. LLM CALL — Gemini direct, n8n fallback ────────────────────────────

    ai_reply = ""
    user_message = f"DATABASE CONTEXT:\n{retrieved_context}\n\nCUSTOMER QUESTION:\n{query}"

    # Primary: Google Gemini 1.5 Flash
    if GEMINI_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                gemini_payload = {
                    "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                    "contents": [{"role": "user", "parts": [{"text": user_message}]}],
                    "generationConfig": {"temperature": 0.3, "maxOutputTokens": 1024},
                }
                r = await client.post(
                    GEMINI_URL,
                    params={"key": GEMINI_API_KEY},
                    json=gemini_payload,
                )
                if r.status_code == 200:
                    parts = (
                        r.json()
                        .get("candidates", [{}])[0]
                        .get("content", {})
                        .get("parts", [])
                    )
                    # Thinking models return a thought part first (no text / thought=True),
                    # then the actual response part. Grab all non-thought text.
                    ai_reply = "".join(
                        p.get("text", "") for p in parts if not p.get("thought", False)
                    ).strip()
                else:
                    print(f"[CHAT] Gemini error {r.status_code}: {r.text[:200]}")
        except Exception as e:
            print(f"[CHAT] Gemini error: {e}")

    # n8n webhook disabled — Gemini is primary; local fallback handles failures

    # ── 3. LOCAL FALLBACK (if n8n unreachable or not configured) ─────────────

    if not ai_reply:
        order_kw = "order" in clean_query or "track" in clean_query or "ord-" in clean_query
        if order_kw:
            if order_row:
                status_desc = {
                    "Pending":        "is in our queue and will begin production soon",
                    "In Production":  "is currently being stitched on our production floor",
                    "Quality Check":  "is undergoing final quality checks",
                    "Shipped":        "has been dispatched and is on its way to you",
                    "Delivered":      "has been successfully delivered",
                    "Cancelled":      "was cancelled",
                }.get(order_row.status, "is being processed")
                ai_reply = (
                    f"I found your order **{order_row.order_id}**. "
                    f"Current status: **{order_row.status}** — it {status_desc}. "
                    f"Total: PKR {order_row.total_price} | Payment: {order_row.payment_status} | "
                    f"Shipping: {order_row.shipping_method or 'Standard Post'}."
                )
            else:
                ai_reply = (
                    "I couldn't find that order. Please make sure you're logged in "
                    "and check your Order ID format (e.g. ORD-123456)."
                )
        elif any(kw in clean_query for kw in ["cotton", "summer", "sport"]):
            ai_reply = "Combed Cotton (Grade 1–3) is perfect for summer and sportswear — lightweight and breathable. Dry-Fit Polyester is ideal for active gym wear."
        elif any(kw in clean_query for kw in ["fleece", "winter", "warm", "hoodie"]):
            ai_reply = "Brushed Fleece (Grade 4–5) is our warmest fabric, recommended for hoodies and winter jackets. It carries a 1.3× price multiplier."
        elif any(kw in clean_query for kw in ["ship", "deliver", "delivery"]):
            ai_reply = "Standard delivery across Pakistan takes 7–10 working days. Free shipping on orders over PKR 5,000; otherwise PKR 250 flat rate."
        elif any(kw in clean_query for kw in ["discount", "bulk", "wholesale"]):
            ai_reply = "Bulk orders get 10% off for 10–49 units, and 20% off for 50+ units."
        elif any(kw in clean_query for kw in ["hi", "hello", "hey", "salam", "assalam"]):
            ai_reply = (
                "Hello! Welcome to AURA-WEAR. I'm AURA-AI, your personal style assistant. "
                "Ask me about our fabrics, products, pricing, or track your order — I'm here to help!"
            )
        else:
            ai_reply = (
                "I'm AURA-AI, your custom clothing assistant. I can help with fabric recommendations, "
                "product pricing, order tracking, and more. What would you like to know?"
            )

    # ── 4. LOG TO DATABASE ────────────────────────────────────────────────────

    db.add(ChatLog(
        user_id=current_user.user_id if current_user else None,
        session_id=chat_req.session_id,
        user_message=query,
        ai_response=ai_reply,
        retrieved_context=retrieved_context,
    ))
    await db.commit()

    return ChatResponse(reply=ai_reply, retrieved_context=retrieved_context)


@router.get("/logs", response_model=List[ChatLogOut])
async def get_chat_logs(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(
        select(ChatLog).order_by(ChatLog.created_at.desc()).limit(200)
    )
    return result.scalars().all()
