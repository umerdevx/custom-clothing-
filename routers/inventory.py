from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.models import Inventory, User
from schemas.schemas import InventoryOut
from routers.auth import get_current_admin
from typing import List

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])


@router.get("", response_model=List[InventoryOut])
async def get_inventory(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(select(Inventory))
    return result.scalars().all()
