import base64
import os
import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import get_db
from models.models import Order, OrderItem, Product, FabricOption, StitchStyle, PrintMethod, Inventory, User
from schemas.schemas import OrderCreate, OrderOut, OrderStatusUpdate
from routers.auth import get_current_user, get_current_admin
from typing import List

router = APIRouter(prefix="/api/orders", tags=["Order Management"])

UPLOAD_DIR = "./uploads/logos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Helper: Save base64 image helper
def save_logo_file(base64_str: str) -> str:
    try:
        # Check header e.g. "data:image/png;base64,"
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        
        file_ext = "png" # default fallback
        img_data = base64.b64decode(base64_str)
        filename = f"logo_{uuid.uuid4().hex}.{file_ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        with open(filepath, "wb") as f:
            f.write(img_data)
        
        # Return web url path
        return f"/uploads/logos/{filename}"
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to decode and save logo image: {e}"
        )

# Create Order Endpoint
@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least 1 item"
        )
        
    order_id = "ORD-" + str(uuid.uuid4().int)[:6]
    grand_total = 0.0
    db_items = []
    
    # Process each customized item in order
    for item in order_data.items:
        # 1. Fetch Product
        prod_res = await db.execute(select(Product).where(Product.product_id == item.product_id))
        product = prod_res.scalars().first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product '{item.product_id}' does not exist"
            )
            
        base_price = product.base_price
        
        # 2. Get Fabric Multiplier
        fabric_res = await db.execute(
            select(FabricOption).where(
                FabricOption.type == item.fabric_type,
                FabricOption.grade == item.fabric_grade
            )
        )
        fabric = fabric_res.scalars().first()
        if not fabric:
            # Fallback multiplier if specific grade combination is missing
            f_mult = 1.0 * (1 + (item.fabric_grade - 1) * 0.15)
        else:
            f_mult = fabric.price_multiplier
            
        # 3. Stitch Style Cost
        stitch_res = await db.execute(select(StitchStyle).where(StitchStyle.name.icontains(item.stitching_style)))
        stitch = stitch_res.scalars().first()
        stitch_cost = stitch.price_add if stitch else 0.0
        
        # 4. Print Method Cost
        print_res = await db.execute(select(PrintMethod).where(PrintMethod.name.icontains(item.print_method)))
        pm = print_res.scalars().first()
        print_cost = pm.price_add if pm else 0.0
        
        # 5. Wash finish cost
        wash_costs = {"standard": 0.0, "stone": 150.0, "acid": 250.0, "enzyme": 100.0}
        wash_cost = wash_costs.get(item.wash_finish.lower(), 0.0)
        
        # Calculate unit cost
        unit_price = round((base_price * f_mult) + stitch_cost + print_cost + wash_cost)
        
        # Quantity bulk discount
        qty_disc = 1.0
        if item.quantity >= 10 and item.quantity < 50:
            qty_disc = 0.90 # 10% discount
        elif item.quantity >= 50:
            qty_disc = 0.80 # 20% discount
            
        item_total = round(unit_price * item.quantity * qty_disc)
        grand_total += item_total
        
        # Logo upload parsing
        logo_path = None
        if item.logo_base64:
            logo_path = save_logo_file(item.logo_base64)
            
        # Create ORM child OrderItem
        db_item = OrderItem(
            product_id=item.product_id,
            fabric_type=item.fabric_type,
            fabric_grade=item.fabric_grade,
            primary_color=item.primary_color,
            secondary_color=item.secondary_color,
            stitching_style=item.stitching_style,
            print_method=item.print_method,
            wash_finish=item.wash_finish,
            quantity=item.quantity,
            unit_price=unit_price,
            logo_path=logo_path,
            notes=item.notes
        )
        db_items.append(db_item)
        
        # Decrement Inventory (Fabric rolls or print cartridges)
        # Deduct fabric
        fab_inv_res = await db.execute(select(Inventory).where(Inventory.item_name.icontains(item.fabric_type)))
        fab_inv = fab_inv_res.scalars().first()
        if fab_inv:
            fab_inv.qty_available = max(0.0, fab_inv.qty_available - (item.quantity * 2.0))
            if fab_inv.qty_available < fab_inv.reorder_level:
                print(f"[WARNING] Inventory stock low for: {fab_inv.item_name}")
                
        # Deduct dyes
        dye_inv_res = await db.execute(select(Inventory).where(Inventory.item_type == "Dye"))
        dye_inv = dye_inv_res.scalars().all()
        for d in dye_inv:
            d.qty_available = max(0.0, d.qty_available - (item.quantity * 0.05))

    # Add 5% GST
    tax = round(grand_total * 0.05)
    grand_total_with_tax = grand_total + tax
    
    # Create main Order
    new_order = Order(
        order_id=order_id,
        user_id=current_user.user_id,
        status="Pending",
        total_price=grand_total_with_tax,
        payment_method=order_data.payment_method,
        payment_status="Paid" if order_data.payment_method != "COD" else "Pending (COD)"
    )
    
    new_order.items = db_items
    db.add(new_order)
    
    await db.commit()
    await db.refresh(new_order)
    
    return new_order

# Get Customer Orders History
@router.get("/my-orders", response_model=List[OrderOut])
async def get_my_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Order)
        .where(Order.user_id == current_user.user_id)
        .options(selectinload(Order.items))
    )
    return result.scalars().all()

# Get All Orders (Admin Console)
@router.get("", response_model=List[OrderOut])
async def get_all_orders(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
    )
    return result.scalars().all()

# Patch Status (Admin Console manufacturing pipeline)
@router.patch("/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: str,
    status_data: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Order).where(Order.order_id == order_id))
    order = result.scalars().first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_id}' not found"
        )
        
    order.status = status_data.status
    order.updatedAt = datetime.datetime.utcnow()
    await db.commit()
    await db.refresh(order)
    
    print(f"[NOTIFICATION] Simulated status email sent: Order {order_id} is now {status_data.status}")
    return order
