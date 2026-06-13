from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database.database import get_db
from models.models import Order, User, Inventory, ChatLog
from schemas.schemas import AnalyticsOut
from routers.auth import get_current_admin

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("", response_model=AnalyticsOut)
async def get_analytics(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin)
):
    orders_res = await db.execute(select(Order))
    orders = orders_res.scalars().all()

    total_revenue = sum(o.total_price for o in orders)
    status_counts = {}
    for o in orders:
        status_counts[o.status] = status_counts.get(o.status, 0) + 1

    users_res = await db.execute(select(func.count()).select_from(User))
    total_users = users_res.scalar() or 0

    inv_res = await db.execute(select(Inventory))
    inventory = inv_res.scalars().all()
    low_stock = sum(1 for i in inventory if i.qty_available < i.reorder_level)

    chat_res = await db.execute(select(func.count()).select_from(ChatLog))
    chat_count = chat_res.scalar() or 0

    return AnalyticsOut(
        total_orders=len(orders),
        total_revenue=total_revenue,
        pending_orders=status_counts.get("Pending", 0),
        in_production=status_counts.get("In Production", 0),
        shipped_orders=status_counts.get("Shipped", 0),
        delivered_orders=status_counts.get("Delivered", 0),
        cancelled_orders=status_counts.get("Cancelled", 0),
        total_users=total_users,
        low_stock_count=low_stock,
        chatbot_interactions=chat_count,
    )
