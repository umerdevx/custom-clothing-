import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database.database import Base, engine
from database.seed import seed_data
from routers import auth, products, orders, chat, inventory, users

app = FastAPI(
    title="AURA-WEAR Backend API",
    description="Asynchronous full-stack API supporting AI Custom Clothing customization and RAG Chatbot queries",
    version="1.0.0"
)

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
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include API Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(chat.router)
app.include_router(inventory.router)
app.include_router(users.router)

# Automatically create tables and seed default products/FAQs on startup
@app.on_event("startup")
async def startup_event():
    print("[STARTUP] Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[STARTUP] Seeding initial configurations...")
    await seed_data()
    print("[STARTUP] Database setup and seeding complete.")

@app.get("/")
async def serve_frontend():
    return FileResponse("index.html")

@app.get("/style.css")
async def serve_css():
    return FileResponse("style.css", media_type="text/css")

@app.get("/app.js")
async def serve_js():
    return FileResponse("app.js", media_type="application/javascript")
