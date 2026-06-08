import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.models import User
from schemas.schemas import UserAdminOut, UserRoleUpdate
from routers.auth import get_current_admin
from typing import List

router = APIRouter(prefix="/api/users", tags=["User Management"])


@router.get("", response_model=List[UserAdminOut])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(select(User).order_by(User.user_id))
    return result.scalars().all()


@router.patch("/{user_id}/role", response_model=UserAdminOut)
async def update_user_role(
    user_id: int,
    role_data: UserRoleUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    if user_id == current_admin.user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot change your own role")
    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.role = role_data.role
    await db.commit()
    await db.refresh(user)
    return user


@router.patch("/{user_id}/toggle", response_model=UserAdminOut)
async def toggle_user_active(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    if user_id == current_admin.user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot deactivate your own account")
    result = await db.execute(select(User).where(User.user_id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.is_active = not user.is_active
    await db.commit()
    await db.refresh(user)
    return user
