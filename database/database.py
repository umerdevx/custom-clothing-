import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Load .env file if it exists
load_dotenv()

# Read Database Connection String from environment or fallback to SQLite locally
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./clothing.db")

# Create engine
# If using SQLite, we enable connect_args to support multi-threading for development
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_async_engine(
    DATABASE_URL, 
    echo=False, 
    connect_args=connect_args
)

# Async session maker
AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Base class for ORM models
class Base(DeclarativeBase):
    pass

# FastAPI Dependency to get database session
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
