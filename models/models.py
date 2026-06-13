import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Enum, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.database import Base

class User(Base):
    __tablename__ = "users"
    
    user_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    role: Mapped[str] = mapped_column(String(20), default="customer") # 'customer' or 'admin'
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    orders: Mapped[List["Order"]] = relationship("Order", back_populates="user")
    chat_logs: Mapped[List["ChatLog"]] = relationship("ChatLog", back_populates="user")

class Product(Base):
    __tablename__ = "products"
    
    product_id: Mapped[str] = mapped_column(String(50), primary_key=True) # e.g. 'tshirt', 'hoodie'
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    base_price: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class FabricOption(Base):
    __tablename__ = "fabric_options"
    
    fabric_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. 'cotton', 'fleece'
    grade: Mapped[int] = mapped_column(Integer, default=1) # 1 to 5
    price_multiplier: Mapped[float] = mapped_column(Float, default=1.0)
    available_qty: Mapped[float] = mapped_column(Float, default=100.0)

class ColorOption(Base):
    __tablename__ = "color_options"
    
    color_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    hex_code: Mapped[str] = mapped_column(String(7), nullable=False) # e.g. '#ff0000'
    price_add: Mapped[float] = mapped_column(Float, default=0.0)

class StitchStyle(Base):
    __tablename__ = "stitch_styles"
    
    stitch_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    price_add: Mapped[float] = mapped_column(Float, default=0.0)

class PrintMethod(Base):
    __tablename__ = "print_methods"
    
    print_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    price_add: Mapped[float] = mapped_column(Float, default=0.0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class Order(Base):
    __tablename__ = "orders"
    
    order_id: Mapped[str] = mapped_column(String(50), primary_key=True) # e.g. 'ORD-123456'
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id"), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="Pending") # Pending, In Production, Quality Check, Shipped, Delivered, Cancelled
    total_price: Mapped[float] = mapped_column(Float, nullable=False)
    payment_method: Mapped[str] = mapped_column(String(30), nullable=False)
    payment_status: Mapped[str] = mapped_column(String(30), default="Pending")
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="orders")
    items: Mapped[List["OrderItem"]] = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment: Mapped[Optional["Payment"]] = relationship("Payment", back_populates="order", uselist=False)

class OrderItem(Base):
    __tablename__ = "order_items"
    
    item_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[str] = mapped_column(String(50), ForeignKey("orders.order_id"), nullable=False)
    product_id: Mapped[str] = mapped_column(String(50), ForeignKey("products.product_id"), nullable=False)
    fabric_type: Mapped[str] = mapped_column(String(50), nullable=False)
    fabric_grade: Mapped[int] = mapped_column(Integer, nullable=False)
    primary_color: Mapped[str] = mapped_column(String(7), nullable=False)
    secondary_color: Mapped[str] = mapped_column(String(7), nullable=False)
    stitching_style: Mapped[str] = mapped_column(String(50), nullable=False)
    print_method: Mapped[str] = mapped_column(String(50), nullable=False)
    wash_finish: Mapped[str] = mapped_column(String(50), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)
    logo_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    order: Mapped["Order"] = relationship("Order", back_populates="items")

class Payment(Base):
    __tablename__ = "payments"
    
    payment_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[str] = mapped_column(String(50), ForeignKey("orders.order_id"), nullable=False, unique=True)
    method: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="Pending")
    transaction_ref: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    paid_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)

    order: Mapped["Order"] = relationship("Order", back_populates="payment")

class ChatLog(Base):
    __tablename__ = "chat_logs"
    
    log_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.user_id"), nullable=True)
    session_id: Mapped[str] = mapped_column(String(100), nullable=False)
    user_message: Mapped[str] = mapped_column(Text, nullable=False)
    ai_response: Mapped[str] = mapped_column(Text, nullable=False)
    retrieved_context: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    user: Mapped[Optional["User"]] = relationship("User", back_populates="chat_logs")

class Inventory(Base):
    __tablename__ = "inventory"
    
    inv_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    item_type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. 'fabric', 'print', 'color', 'thread'
    item_name: Mapped[str] = mapped_column(String(100), nullable=False)
    qty_available: Mapped[float] = mapped_column(Float, default=0.0)
    reorder_level: Mapped[float] = mapped_column(Float, default=10.0)
    last_updated: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Faq(Base):
    __tablename__ = "faqs"

    faq_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    question: Mapped[str] = mapped_column(String(255), nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class PasswordReset(Base):
    __tablename__ = "password_resets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    otp: Mapped[str] = mapped_column(String(6), nullable=False)
    expires_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    used: Mapped[bool] = mapped_column(Boolean, default=False)
