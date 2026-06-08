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
    base_price: float
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
