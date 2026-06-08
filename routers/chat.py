from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.models import Product, FabricOption, Faq, Order, ChatLog, User
from schemas.schemas import ChatRequest, ChatResponse, ChatLogOut
from routers.auth import get_current_user, get_optional_user, get_current_admin
from typing import Optional, List
import httpx
import os

router = APIRouter(prefix="/api/chat", tags=["AI RAG Chatbot"])

N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "")

@router.post("", response_model=ChatResponse)
async def chat(
    chat_req: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = chat_req.message
    clean_query = query.lower()
    retrieved_rows = []
    
    # 1. RAG Retrieval Step (Simulating n8n/SQL querying node)
    # Check if tracking order
    if "order" in clean_query or "track" in clean_query or "ord-" in clean_query:
        # Match order keywords
        import re
        match = re.search(r"ord-\d+", clean_query)
        order_row = None
        if match:
            oid = match.group(0).upper()
            order_res = await db.execute(select(Order).where(Order.order_id.icontains(oid)))
            order_row = order_res.scalars().first()
        elif current_user:
            # Fallback to current user's latest order
            order_res = await db.execute(
                select(Order)
                .where(Order.user_id == current_user.user_id)
                .order_by(Order.created_at.desc())
            )
            order_row = order_res.scalars().first()
            
        if order_row:
            retrieved_rows.append(f"MySQL Row -> Order ID: {order_row.order_id}, Status: {order_row.status}, Total: PKR {order_row.total_price}, Created: {order_row.created_at.strftime('%Y-%m-%d')}")
            
    # Check if querying products
    prod_res = await db.execute(select(Product))
    all_prods = prod_res.scalars().all()
    for p in all_prods:
        if p.name.lower() in clean_query or p.category.lower() in clean_query or p.description.lower() in clean_query:
            retrieved_rows.append(f"MySQL Row -> Product: {p.name}, Category: {p.category}, Base Price: PKR {p.base_price}")
            
    # Check if querying fabric multipliers
    fab_res = await db.execute(select(FabricOption))
    all_fabs = fab_res.scalars().all()
    # deduplicate fabric types
    seen_fabrics = set()
    for f in all_fabs:
        # e.g. "cotton", "fleece"
        if f.type not in seen_fabrics and (f.type in clean_query or f.name.lower() in clean_query):
            seen_fabrics.add(f.type)
            retrieved_rows.append(f"MySQL Row -> Fabric: {f.name}, Type: {f.type}, Multiplier: {f.price_multiplier}x")
            
    # Check FAQs
    faq_res = await db.execute(select(Faq))
    all_faqs = faq_res.scalars().all()
    for faq in all_faqs:
        # Match keywords in question
        words = faq.question.split(" ")
        if any(word in clean_query for word in words if len(word) > 3):
            retrieved_rows.append(f"MySQL Row -> FAQ Question: {faq.question}, Answer: {faq.answer}")

    retrieved_context = "\n".join(retrieved_rows) if retrieved_rows else "Empty database query context."
    
    # 2. LLM Call/Simulated Generation Step
    ai_reply = ""
    
    # If a real n8n webhook URL is set in env, invoke it
    if N8N_WEBHOOK_URL:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                payload = {
                    "query": query,
                    "context": retrieved_context,
                    "session_id": chat_req.session_id,
                    "user_id": current_user.user_id if current_user else None
                }
                r = await client.post(N8N_WEBHOOK_URL, json=payload)
                if r.status_code == 200:
                    ai_reply = r.json().get("output", r.json().get("reply", ""))
        except Exception as e:
            print(f"[ERROR] Failed to invoke n8n webhook: {e}")
            
    # Fallback to local context-grounded rules if n8n is not set or failed
    if not ai_reply:
        if "order" in clean_query or "track" in clean_query or "ord-" in clean_query:
            if order_row:
                status_mapping = {
                    "Pending": "is in our queue and will start printing soon",
                    "In Production": "is currently on our stitching floor being constructed",
                    "Quality Check": "is undergoing final measurements and checks",
                    "Shipped": "has been handed over to the courier and is on its way",
                    "Delivered": "has been delivered to your destination address"
                }
                ai_reply = f"Hello! I found order **{order_row.order_id}** in our system database. Its status is currently **{order_row.status}**, which means it {status_mapping.get(order_row.status, 'is being processed')}. Your payment status is recorded as **{order_row.payment_status}**."
            else:
                ai_reply = "I looked for orders associated with your account but couldn't find any. Please double-check your Order ID (format: ORD-xxxxxx) and make sure you're logged in."
        elif "cotton" in clean_query or "summer" in clean_query:
            ai_reply = "Combed Cotton (Grade 1-3) is perfect for summer and sportswear. It's soft and lightweight. Dry-Fit Polyester is also excellent for active gym wear. Let me know if you would like to start customizing a T-Shirt!"
        elif "fleece" in clean_query or "winter" in clean_query:
            ai_reply = "Brushed Fleece (Grade 4-5) is our heaviest fabric and is highly recommended for warm hoodies and winter jackets. It has a base price multiplier of 1.3x."
        elif "shipping" in clean_query or "deliver" in clean_query:
            ai_reply = "Standard delivery across Pakistan takes 7 to 10 working days. Free shipping is provided for orders above PKR 5,000, otherwise flat rate of PKR 250 applies."
        else:
            ai_reply = "Hello! I am AURA-AI, your custom clothing advisor. I can help recommend fabrics (Cotton, Fleece, Polyester), printing techniques (DTG, Embroidery, Screen), or track your current orders. What can I do for you today?"

    # 3. Log to Database for Auditing/Analytics
    chat_log = ChatLog(
        user_id=current_user.user_id if current_user else None,
        session_id=chat_req.session_id,
        user_message=query,
        ai_response=ai_reply,
        retrieved_context=retrieved_context
    )
    db.add(chat_log)
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
