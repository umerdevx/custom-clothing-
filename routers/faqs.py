from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.models import Faq, User
from schemas.schemas import FaqOut, FaqCreate, FaqUpdate
from routers.auth import get_current_admin
from typing import List

router = APIRouter(prefix="/api/faqs", tags=["FAQs"])


@router.get("", response_model=List[FaqOut])
async def list_faqs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Faq).where(Faq.is_active == True))
    return result.scalars().all()


@router.get("/admin/all", response_model=List[FaqOut])
async def list_all_faqs(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(select(Faq))
    return result.scalars().all()


@router.post("", response_model=FaqOut, status_code=status.HTTP_201_CREATED)
async def create_faq(
    data: FaqCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    faq = Faq(question=data.question, answer=data.answer)
    db.add(faq)
    await db.commit()
    await db.refresh(faq)
    return faq


@router.patch("/{faq_id}", response_model=FaqOut)
async def update_faq(
    faq_id: int,
    data: FaqUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(select(Faq).where(Faq.faq_id == faq_id))
    faq = result.scalars().first()
    if not faq:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(faq, field, value)
    await db.commit()
    await db.refresh(faq)
    return faq


@router.delete("/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_faq(
    faq_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(select(Faq).where(Faq.faq_id == faq_id))
    faq = result.scalars().first()
    if not faq:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
    await db.delete(faq)
    await db.commit()
