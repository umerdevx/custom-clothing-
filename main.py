import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from database.database import Base, engine
from database.seed import seed_data
from routers import auth, products, orders, chat, inventory, users, analytics, faqs, image_gen

app = FastAPI(
    title="AURA-WEAR Backend API",
    description="Asynchronous full-stack API supporting AI Custom Clothing customization and RAG Chatbot queries",
    version="1.0.0"
)

# FR-45: HTTPS enforcement in production only
if os.getenv("ENFORCE_HTTPS", "false").lower() == "true":
    app.add_middleware(HTTPSRedirectMiddleware)

# Enable Cross-Origin Resource Sharing (CORS) for development integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
os.makedirs("./uploads/logos", exist_ok=True)
os.makedirs("./uploads/designs", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Serve 3D GLB model files
os.makedirs("./static/3d", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include API Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(chat.router)
app.include_router(inventory.router)
app.include_router(users.router)
app.include_router(analytics.router)
app.include_router(faqs.router)
app.include_router(image_gen.router)

# Automatically create tables and seed default products/FAQs on startup
@app.on_event("startup")
async def startup_event():
    print("[STARTUP] Initializing database tables...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        # Add design_preview_path column to order_items if it doesn't exist yet
        try:
            async with engine.begin() as conn:
                await conn.exec_driver_sql(
                    "ALTER TABLE order_items ADD COLUMN design_preview_path VARCHAR(255)"
                )
                print("[STARTUP] Migrated: added design_preview_path to order_items.")
        except Exception:
            pass  # Column already exists
        print("[STARTUP] Seeding initial configurations...")
        await seed_data()
        print("[STARTUP] Database setup and seeding complete.")
    except Exception as e:
        print(f"[STARTUP] Skipped (already initialized): {e.__class__.__name__}")

_NO_CACHE = {"Cache-Control": "no-store, no-cache, must-revalidate", "Pragma": "no-cache"}

@app.get("/")
async def serve_frontend():
    return FileResponse("index.html", headers=_NO_CACHE)

@app.get("/style.css")
async def serve_css():
    return FileResponse("style.css", media_type="text/css", headers=_NO_CACHE)

@app.get("/app.js")
async def serve_js():
    return FileResponse("app.js", media_type="application/javascript", headers=_NO_CACHE)
