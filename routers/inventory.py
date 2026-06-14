from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.models import Inventory, User
from schemas.schemas import InventoryOut, InventoryCreate, InventoryUpdate
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


@router.post("", response_model=InventoryOut, status_code=status.HTTP_201_CREATED)
async def add_inventory_item(
    data: InventoryCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    item = Inventory(**data.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch("/{inv_id}", response_model=InventoryOut)
async def update_inventory_item(
    inv_id: int,
    data: InventoryUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(select(Inventory).where(Inventory.inv_id == inv_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(item, field, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/{inv_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_inventory_item(
    inv_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(select(Inventory).where(Inventory.inv_id == inv_id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
    await db.delete(item)
    await db.commit()
