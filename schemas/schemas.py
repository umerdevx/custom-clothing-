import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

# --- Authentication Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    name: str = Field(..., min_length=2, description="Name must be at least 2 characters")
    phone: Optional[str] = None
    address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime.datetime
    phone: Optional[str] = None
    address: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None

# --- Product Catalog Schemas ---
class ProductOut(BaseModel):
    product_id: str
    name: str
    category: str
    gender: str = "Unisex"
    base_price: float
    discount_percent: float = 0.0
    description: str
    image_url: str
    is_active: bool

    class Config:
        from_attributes = True

# --- Order & Checkout Schemas ---
class OrderItemCreate(BaseModel):
    product_id: str
    fabric_type: str
    fabric_grade: int = Field(..., ge=1, le=5)
    primary_color: str = Field(..., min_length=7, max_length=7) # Hex code e.g. '#000000'
    secondary_color: str = Field(..., min_length=7, max_length=7)
    stitching_style: str
    print_method: str
    wash_finish: str
    quantity: int = Field(..., gt=0)
    logo_base64: Optional[str] = None # For custom logo uploaded on client
    notes: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    payment_method: str
    name: str
    phone: str
    address: str
    shipping_method: Optional[str] = "Standard Post"
    shipping_cost: float = 150.0

class OrderItemOut(BaseModel):
    item_id: int
    product_id: str
    fabric_type: str
    fabric_grade: int
    primary_color: str
    secondary_color: str
    stitching_style: str
    print_method: str
    wash_finish: str
    quantity: int
    unit_price: float
    logo_path: Optional[str]
    notes: Optional[str]

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    order_id: str
    user_id: int
    status: str
    total_price: float
    payment_method: str
    payment_status: str
    shipping_method: Optional[str] = None
    shipping_cost: float = 0.0
    created_at: datetime.datetime
    updated_at: datetime.datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(Pending|In Production|Quality Check|Shipped|Delivered|Cancelled)$")

# --- AI Chat Schemas ---
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "demo-session-123"

class ChatResponse(BaseModel):
    reply: str
    retrieved_context: Optional[str] = None

# --- Inventory Schemas ---
class InventoryOut(BaseModel):
    inv_id: int
    item_type: str
    item_name: str
    qty_available: float
    reorder_level: float
    last_updated: datetime.datetime

    class Config:
        from_attributes = True

# --- Admin Product Schemas ---
class ProductCreate(BaseModel):
    product_id: str = Field(..., min_length=2, max_length=50, pattern="^[a-z0-9_-]+$")
    name: str = Field(..., min_length=2)
    category: str
    gender: str = "Unisex"
    base_price: float = Field(..., gt=0)
    discount_percent: float = Field(0.0, ge=0, le=100)
    description: str
    image_url: str = ""

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    gender: Optional[str] = None
    base_price: Optional[float] = Field(None, gt=0)
    discount_percent: Optional[float] = Field(None, ge=0, le=100)
    description: Optional[str] = None
    image_url: Optional[str] = None

# --- Admin User Schemas ---
class UserAdminOut(BaseModel):
    user_id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class UserRoleUpdate(BaseModel):
    role: str = Field(..., pattern="^(admin|customer)$")

class ManualOrderCreate(BaseModel):
    customer_name: str = Field(default="Walk-in Customer", min_length=2)
    product_id: str
    primary_color: str = "#000000"
    secondary_color: str = "#ffffff"
    quantity: int = Field(default=1, ge=1, le=9999)
    payment_method: str = Field(default="COD", pattern="^(COD|Card|Bank Transfer)$")
    notes: str = ""

# --- Profile Update ---
class ProfileUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    phone: Optional[str] = None
    address: Optional[str] = None

# --- Inventory CRUD Schemas ---
class InventoryCreate(BaseModel):
    item_type: str
    item_name: str
    qty_available: float = 0.0
    reorder_level: float = 10.0

class InventoryUpdate(BaseModel):
    item_name: Optional[str] = None
    qty_available: Optional[float] = None
    reorder_level: Optional[float] = None

# --- FAQ Schemas ---
class FaqOut(BaseModel):
    faq_id: int
    question: str
    answer: str
    is_active: bool

    class Config:
        from_attributes = True

class FaqCreate(BaseModel):
    question: str = Field(..., min_length=5)
    answer: str = Field(..., min_length=5)

class FaqUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    is_active: Optional[bool] = None

# --- Analytics ---
class AnalyticsOut(BaseModel):
    total_orders: int
    total_revenue: float
    pending_orders: int
    in_production: int
    shipped_orders: int
    delivered_orders: int
    cancelled_orders: int
    total_users: int
    low_stock_count: int
    chatbot_interactions: int

# --- Password Reset Schemas ---
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8)

# --- Payment Confirm Schema ---
class PaymentConfirmRequest(BaseModel):
    wallet_number: Optional[str] = None

# --- Chat Log Schemas ---
class ChatLogOut(BaseModel):
    log_id: int
    user_id: Optional[int]
    session_id: str
    user_message: str
    ai_response: str
    retrieved_context: Optional[str]
    created_at: datetime.datetime

    class Config:
        from_attributes = True
