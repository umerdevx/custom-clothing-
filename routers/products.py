from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.models import Product, FabricOption, StitchStyle, PrintMethod
from schemas.schemas import ProductOut
from typing import List, Dict

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
