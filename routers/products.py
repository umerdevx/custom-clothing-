from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.models import Product, FabricOption, StitchStyle, PrintMethod, User
from schemas.schemas import ProductOut, ProductCreate, ProductUpdate
from routers.auth import get_current_admin
from typing import List, Dict, Optional

router = APIRouter(prefix="/api/products", tags=["Product Catalog"])

@router.get("", response_model=List[ProductOut])
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.is_active == True))
    return result.scalars().all()

@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.product_id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID '{product_id}' not found"
        )
    return product

@router.get("/admin/all", response_model=List[ProductOut])
async def get_all_products_admin(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    """Return all products including inactive ones (admin only)."""
    result = await db.execute(select(Product))
    return result.scalars().all()


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    existing = await db.execute(select(Product).where(Product.product_id == product_data.product_id))
    if existing.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product ID '{product_data.product_id}' already exists"
        )
    new_product = Product(**product_data.model_dump())
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    return new_product


@router.patch("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str,
    update_data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    result = await db.execute(select(Product).where(Product.product_id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product '{product_id}' not found")
    for field, value in update_data.model_dump(exclude_none=True).items():
        setattr(product, field, value)
    await db.commit()
    await db.refresh(product)
    return product


@router.delete("/{product_id}/toggle", response_model=ProductOut)
async def toggle_product_status(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    """Toggle a product's active/inactive status (soft delete)."""
    result = await db.execute(select(Product).where(Product.product_id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product '{product_id}' not found")
    product.is_active = not product.is_active
    await db.commit()
    await db.refresh(product)
    return product


@router.get("/{product_id}/related", response_model=List[ProductOut])
async def get_related_products(product_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.product_id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product '{product_id}' not found")
    related_res = await db.execute(
        select(Product).where(Product.category == product.category, Product.product_id != product_id, Product.is_active == True).limit(4)
    )
    return related_res.scalars().all()


@router.get("/customization/options")
async def get_customization_options(db: AsyncSession = Depends(get_db)):
    """
    Returns available materials, grades, stitches, and print techniques with prices/multipliers
    """
    # Fetch fabrics
    fabrics_res = await db.execute(select(FabricOption))
    fabrics = fabrics_res.scalars().all()
    
    # Fetch stitches
    stitches_res = await db.execute(select(StitchStyle))
    stitches = stitches_res.scalars().all()
    
    # Fetch prints
    prints_res = await db.execute(select(PrintMethod).where(PrintMethod.is_active == True))
    prints = prints_res.scalars().all()
    
    return {
        "fabrics": [
            {
                "id": f.fabric_id,
                "name": f.name,
                "type": f.type,
                "grade": f.grade,
                "multiplier": f.price_multiplier,
                "available": f.available_qty
            } for f in fabrics
        ],
        "stitching": [
            {
                "id": s.stitch_id,
                "name": s.name,
                "description": s.description,
                "price_add": s.price_add
            } for s in stitches
        ],
        "printing": [
            {
                "id": p.print_id,
                "name": p.name,
                "description": p.description,
                "price_add": p.price_add
            } for p in prints
        ]
    }


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    """Permanently delete a product (admin only)."""
    result = await db.execute(select(Product).where(Product.product_id == product_id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product '{product_id}' not found")
    await db.delete(product)
    await db.commit()
