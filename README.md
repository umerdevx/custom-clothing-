# AURA-WEAR — AI Custom Clothing Platform

> **Final Year Project (FYP) 2025–2026**
> Full-stack AI-integrated custom clothing e-commerce platform built with FastAPI, vanilla JavaScript, and PostgreSQL.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Frontend SPA](#frontend-spa)
8. [AI Chatbot (RAG)](#ai-chatbot-rag)
9. [n8n Integration](#n8n-integration)
10. [Email Notifications](#email-notifications)
11. [Authentication & Security](#authentication--security)
12. [Getting Started](#getting-started)
13. [Docker Deployment](#docker-deployment)
14. [Environment Variables](#environment-variables)
15. [Customizer Logic](#customizer-logic)
16. [Pricing Engine](#pricing-engine)
17. [Admin Panel](#admin-panel)
18. [Order Lifecycle](#order-lifecycle)
19. [Known Limitations](#known-limitations)
20. [Project Structure](#project-structure)

---

## Project Overview

AURA-WEAR is a custom clothing platform where customers design garments in real time — choosing fabric type, GSM grade, primary/secondary colors, stitching style, print method, and wash finish — then place orders with automated email confirmation. An AI chatbot (RAG-powered) assists customers with product queries and order tracking. Admins manage the full manufacturing pipeline from a dashboard.

---

## Key Features

### Customer-Facing
| Feature | Details |
|---|---|
| **Product Catalog** | 80+ products across T-Shirts, Hoodies, Jackets, Sports Uniforms |
| **Real-Time SVG Customizer** | 4 garment types (tshirt, hoodie, jacket, uniform), front/back views, live color injection |
| **Size Selection** | XS / S / M / L / XL / XXL tile picker |
| **Logo Upload** | Upload PNG/JPG; stored as base64, saved server-side |
| **Cart** | Multi-item cart with size, color, quantity tracking |
| **Coupon Codes** | AURA10 (10%), SAVE20 (20%), FYP2025 (15%), FIRST50 (50%) |
| **Shipping Options** | DHL Express (800), TCS Overnight (450), Leopards (350), BlueEx (250), Standard Post (150) |
| **Checkout** | GST 5% + shipping + coupon discount; payment methods: COD, Card, Bank Transfer, JazzCash, EasyPaisa |
| **My Orders** | View order history, track status, cancel Pending orders |
| **User Profile** | Edit name, phone, address |
| **Password Reset** | OTP-based via email (10-minute expiry) |
| **AI Chatbot** | RAG chatbot with order tracking and product recommendations |
| **Chat Persistence** | Chat history persists across page refreshes (sessionStorage) |

### Admin Panel
| Feature | Details |
|---|---|
| **Analytics Dashboard** | Total orders, revenue, pending/production/shipped/delivered/cancelled counts, user count, low-stock alerts, chatbot interactions |
| **Analytics Charts** | Canvas-based bar charts: Order Status Breakdown, Revenue Summary |
| **Product Management** | Add, edit, toggle active/inactive (soft delete), permanent delete |
| **Order Management** | View all orders, update status through full pipeline, delete |
| **Export CSV** | Download all orders as a CSV file |
| **Manual Order Entry** | Admin can create orders for walk-in customers with live product list |
| **User Management** | View all users, toggle active/banned, change roles (admin↔customer), delete |
| **Inventory Management** | CRUD for fabric and dye inventory, low-stock monitoring |
| **FAQ Management** | Create, edit, activate/deactivate FAQs |
| **RAG Chat Logs** | Browse the last 200 chatbot conversations |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11, FastAPI, Uvicorn (ASGI) |
| **ORM** | SQLAlchemy 2.0 (async) |
| **Database** | PostgreSQL 16 (production), SQLite (dev fallback) |
| **Auth** | JWT (python-jose), bcrypt (passlib) |
| **Email** | SMTP via smtplib (Gmail-ready) |
| **HTTP Client** | httpx (async, for n8n webhook calls) |
| **Frontend** | Vanilla JavaScript (no framework), HTML5 Canvas API, CSS3 |
| **Containerization** | Docker, Docker Compose |
| **AI Integration** | n8n webhook (optional), local RAG fallback |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                        │
│  index.html + style.css + app.js                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Catalog  │ │Customizer│ │Checkout  │ │ Admin Panel  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ fetch() / REST API
┌──────────────────────▼──────────────────────────────────────┐
│                    FastAPI (port 8001)                       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐  │
│  │ /auth  │ │/products│ │/orders│ │ /chat  │ │/analytics│  │
│  └────────┘ └────────┘ └────────┘ └───┬────┘ └─────────┘  │
│  ┌─────────────┐ ┌──────────┐         │                     │
│  │ /inventory  │ │ /faqs    │         │ httpx POST          │
│  └─────────────┘ └──────────┘         │                     │
└──────────────────────┬─────────────── │ ────────────────────┘
                       │ SQLAlchemy      │
┌──────────────────────▼──────────┐  ┌──▼──────────────────────┐
│     PostgreSQL 16 / SQLite      │  │     n8n Webhook          │
│     (13 tables)                 │  │   (AI LLM response)      │
└─────────────────────────────────┘  └─────────────────────────┘
```

**Request flow for the AI chatbot:**
1. User sends message → `POST /api/chat`
2. Backend performs RAG retrieval (Products, FabricOptions, Orders, FAQs from DB)
3. If `N8N_WEBHOOK_URL` is set → forward `{query, context, session_id, user_id}` to n8n
4. n8n runs LLM → returns `{output}` or `{reply}`
5. If no n8n → local rule-based fallback response
6. Log to `ChatLog` table
7. Return `{reply, retrieved_context}` to frontend

---

## Database Schema

```
User
├── user_id (PK, autoincrement)
├── name, email (unique), password_hash
├── phone, address
├── role ("admin" | "customer")
├── is_active, created_at

Product
├── product_id (PK, slug e.g. "tshirt-polo")
├── name, category, gender
├── base_price, discount_percent
├── description, image_url
├── is_active

FabricOption
├── fabric_id (PK)
├── name, type ("cotton"|"fleece"|"polyester"|"blended")
├── grade (1–5, maps to GSM 150/180/220/240/300)
├── price_multiplier, available_qty

StitchStyle
├── stitch_id (PK)
├── name, description, price_add

PrintMethod
├── print_id (PK)
├── name, description, price_add, is_active

Order
├── order_id (PK, "ORD-xxxxxx")
├── user_id (FK → User)
├── status ("Pending"|"In Production"|"Quality Check"|"Shipped"|"Delivered"|"Cancelled")
├── total_price, payment_method, payment_status
├── shipping_method, shipping_cost
├── created_at, updated_at

OrderItem
├── item_id (PK)
├── order_id (FK → Order)
├── product_id (FK → Product)
├── fabric_type, fabric_grade
├── primary_color, secondary_color (hex)
├── stitching_style, print_method, wash_finish
├── quantity, unit_price
├── logo_path, notes

Inventory
├── inv_id (PK)
├── item_type, item_name
├── qty_available, reorder_level
├── last_updated

ChatLog
├── log_id (PK)
├── user_id (FK → User, nullable)
├── session_id, user_message, ai_response
├── retrieved_context, created_at

Faq
├── faq_id (PK)
├── question, answer, is_active

PasswordReset
├── id (PK)
├── email, otp, expires_at, used
```

> **Note:** There is no `size` column in OrderItem. Garment size (XS–XXL) is a UI-only state tracked in `state.currentCustomization.size` and shown in the cart but not persisted to the database.

---

## API Reference

### Base URL
- Development: `http://127.0.0.1:8001`
- Swagger UI: `http://127.0.0.1:8001/docs`
- ReDoc: `http://127.0.0.1:8001/redoc`

### Authentication
All protected endpoints require: `Authorization: Bearer <token>`

---

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register new user. First user becomes admin. |
| `POST` | `/login` | Public | Login → returns JWT token |
| `POST` | `/login-form` | Public | OAuth2 form login (Swagger UI) |
| `GET` | `/me` | Customer | Get current user profile |
| `PATCH` | `/profile` | Customer | Update name, phone, address |
| `POST` | `/forgot-password` | Public | Request OTP for password reset |
| `POST` | `/verify-otp` | Public | Verify OTP (6-digit, 10-min expiry) |
| `POST` | `/reset-password` | Public | Reset password with OTP |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+92-300-1234567",
  "address": "123 Main St, Lahore"
}
```

**Login response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

---

### Products — `/api/products`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | List active products |
| `GET` | `/{product_id}` | Public | Get single product |
| `GET` | `/admin/all` | Admin | All products (including inactive) |
| `GET` | `/{product_id}/related` | Public | Related products (same category) |
| `GET` | `/customization/options` | Public | Fabrics, stitches, print methods |
| `POST` | `/` | Admin | Create product |
| `PATCH` | `/{product_id}` | Admin | Update product |
| `DELETE` | `/{product_id}/toggle` | Admin | Toggle active/inactive |
| `DELETE` | `/{product_id}` | Admin | Permanent delete |

---

### Orders — `/api/orders`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Customer | Place new order |
| `POST` | `/manual` | Admin | Create manual walk-in order |
| `GET` | `/my-orders` | Customer | Get own orders |
| `GET` | `/` | Admin | Get all orders |
| `PATCH` | `/{order_id}/status` | Admin | Update order status |
| `PATCH` | `/{order_id}/cancel` | Customer | Cancel Pending order |
| `POST` | `/{order_id}/confirm-payment` | Customer | Mark payment as paid |
| `DELETE` | `/{order_id}` | Admin | Delete order |

**Place order body:**
```json
{
  "items": [
    {
      "product_id": "tshirt-polo",
      "fabric_type": "cotton",
      "fabric_grade": 3,
      "primary_color": "#6C63FF",
      "secondary_color": "#FFFFFF",
      "stitching_style": "standard",
      "print_method": "dtg",
      "wash_finish": "standard",
      "quantity": 2,
      "logo_base64": "data:image/png;base64,...",
      "notes": "Add front chest embroidery"
    }
  ],
  "payment_method": "Card",
  "name": "John Doe",
  "phone": "+92-300-1234567",
  "address": "123 Main St",
  "shipping_method": "DHL Express",
  "shipping_cost": 800
}
```

**Order status pipeline:**
```
Pending → In Production → Quality Check → Shipped → Delivered
       ↘ Cancelled (from Pending only)
```

---

### Chat — `/api/chat`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Optional | Send message to AI chatbot |
| `GET` | `/logs` | Admin | Last 200 chat logs |

**Chat body:**
```json
{
  "message": "What is the status of order ORD-123456?",
  "session_id": "session-abc-123"
}
```

**Chat response:**
```json
{
  "reply": "Your order ORD-123456 is In Production...",
  "retrieved_context": "MySQL Row -> Order ID: ORD-123456, Status: In Production..."
}
```

---

### Analytics — `/api/analytics`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Admin | Dashboard statistics |

**Response:**
```json
{
  "total_orders": 42,
  "total_revenue": 185000.0,
  "pending_orders": 5,
  "in_production": 8,
  "shipped_orders": 12,
  "delivered_orders": 15,
  "cancelled_orders": 2,
  "total_users": 28,
  "low_stock_count": 1,
  "chatbot_interactions": 134
}
```

---

### Inventory — `/api/inventory`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Admin | List all inventory items |
| `POST` | `/` | Admin | Add inventory item |
| `PATCH` | `/{inv_id}` | Admin | Update qty/reorder level |
| `DELETE` | `/{inv_id}` | Admin | Delete item |

---

### Users — `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Admin | List all users |
| `PATCH` | `/{user_id}/role` | Admin | Change role (admin/customer) |
| `PATCH` | `/{user_id}/toggle` | Admin | Ban/unban user |
| `DELETE` | `/{user_id}` | Admin | Delete user |

---

### FAQs — `/api/faqs`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Public | Active FAQs |
| `GET` | `/admin/all` | Admin | All FAQs |
| `POST` | `/` | Admin | Create FAQ |
| `PATCH` | `/{faq_id}` | Admin | Update FAQ |
| `DELETE` | `/{faq_id}` | Admin | Delete FAQ |

---

## Frontend SPA

The entire frontend is a single-page application driven by `switchView(viewName)` in `app.js`.

### Views
| View ID | Access | Description |
|---|---|---|
| `home` | Public | Product catalog with category filters |
| `customizer` | Public | SVG garment customizer |
| `cart` | Public | Cart summary |
| `orders` | Customer | My order history |
| `profile` | Customer | Edit name, phone, address |
| `admin` | Admin | Full admin dashboard |

### State Object
```javascript
state = {
  currentView: 'home',
  cart: [],                     // Array of cart items
  currentCustomization: {
    productId: null,
    productName: '',
    productType: 'tshirt',
    view: 'front',
    primaryColor: '#6C63FF',
    secondaryColor: '#FFFFFF',
    fabricType: 'cotton',
    fabricGrade: 1,
    stitchStyle: 'standard',
    printMethod: 'dtg',
    washFinish: 'standard',
    logoBase64: null,
    size: 'M',                  // XS/S/M/L/XL/XXL
    quantity: 1,
    notes: ''
  },
  _couponDiscount: 0,           // Percentage discount (0–100)
  _checkoutShippingCost: 800,   // PKR
}
```

### Storage
| Storage | Keys | Purpose |
|---|---|---|
| `localStorage` | `aura_token`, `aura_user`, `aura_cart`, `aura_session_id` | Auth & cart persistence |
| `sessionStorage` | `aura_chat_history` | Chat message persistence within session |

---

## AI Chatbot (RAG)

### Retrieval Logic

The chatbot performs keyword-based database retrieval before generating a response:

1. **Order tracking** — Detects "order", "track", or "ORD-" prefix; fetches order by ID or user's latest
2. **Products** — Matches product name, category, or description keywords against query
3. **Fabrics** — Matches fabric type or name keywords
4. **FAQs** — Matches FAQ question keywords (>3 characters)

All matched rows are concatenated as `retrieved_context` and sent to n8n or used in the fallback responder.

### Fallback Responses (no n8n)

| Query keyword | Response |
|---|---|
| order / track / ORD- | Order status with manufacturing stage description |
| cotton / summer | Cotton fabric recommendation |
| fleece / winter | Fleece fabric recommendation |
| shipping / deliver | Delivery time and pricing info |
| (default) | General AURA-AI introduction |

---

## n8n Integration

Set `N8N_WEBHOOK_URL` in `.env` to enable full AI responses. When set, the backend POSTs to your n8n webhook on every chat message.

### Webhook Payload (sent by AURA-WEAR)
```json
{
  "query": "What fabrics do you have for winter hoodies?",
  "context": "MySQL Row -> Fabric: Brushed Fleece Grade 4, Type: fleece, Multiplier: 1.3x\nMySQL Row -> Product: Aura Sherpa-Lined Hoodie, ...",
  "session_id": "session-abc-123",
  "user_id": 5
}
```

### Expected n8n Response
```json
{
  "output": "For winter hoodies, I recommend our Brushed Fleece Grade 4–5..."
}
```
or:
```json
{
  "reply": "For winter hoodies, I recommend..."
}
```

### Recommended n8n Workflow

```
Webhook Trigger
    ↓
Set Variables (extract query, context, session_id, user_id)
    ↓
OpenAI / Claude Chat Node
  System: "You are AURA-AI, a custom clothing assistant for AURA-WEAR Pakistan.
           Answer based only on the provided database context."
  User: "Context:\n{{$json.context}}\n\nQuestion: {{$json.query}}"
    ↓
Respond to Webhook
  Body: { "output": "{{$json.choices[0].message.content}}" }
```

### Other n8n Use Cases

| Use Case | n8n Nodes |
|---|---|
| Order status email digest | Webhook → DB Query → Email (daily cron) |
| Low-stock Slack alert | Cron → HTTP → Slack |
| Customer win-back | Webhook on cancelled order → delay → Email |
| Sales report PDF | Cron → DB query → HTML to PDF → Email |
| Chat escalation | AI node → IF node (confidence < threshold) → Slack |

---

## Email Notifications

Configured via SMTP env vars. Gracefully skips (logs to console) if `SMTP_USER`/`SMTP_PASS` are empty.

| Trigger | Recipient | Template |
|---|---|---|
| Order placed | Customer | Order confirmed with ID and total |
| Order status changed | Customer | New status with context |
| New order placed | Admin (`ADMIN_EMAIL`) | Customer name, order ID, total |
| Password reset | Customer | 6-digit OTP, 10-minute expiry |

---

## Authentication & Security

### JWT Token
- Algorithm: HS256
- Payload: `{sub: email, user_id: int, role: string, exp: timestamp}`
- Default expiry: 30 minutes (hardcoded in `auth.py` — override by changing the constant)
- Token stored in `localStorage` as `aura_token`

### Role System
- `admin` — Full access to all endpoints and admin panel
- `customer` — Access to own orders, profile, checkout, chatbot
- First registered user automatically becomes admin

### Password Reset Flow
1. `POST /api/auth/forgot-password` — generates 6-digit OTP, stores in `password_resets` table, sends email
2. `POST /api/auth/verify-otp` — validates OTP + expiry
3. `POST /api/auth/reset-password` — validates OTP, hashes new password, marks OTP as used

### Security Notes
> ⚠️ **For production deployment, address these before go-live:**
> - `SECRET_KEY` is hardcoded in `routers/auth.py` — move to `os.getenv("SECRET_KEY")`
> - `debug_otp` is returned in the `/forgot-password` response — remove in production
> - `CORS allow_origins=["*"]` — restrict to your domain
> - `ACCESS_TOKEN_EXPIRE_MINUTES` env var is defined in `.env.example` but ignored by `auth.py`

---

## Getting Started

### Prerequisites
- Python 3.11+
- PostgreSQL 16 (or use the SQLite fallback for local dev)

### Local Development (SQLite)

```bash
# 1. Clone the repo
git clone <repo-url>
cd custom-clothing-

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate      # Linux/Mac
# venv\Scripts\activate       # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the server (auto-creates tables and seeds data on first run)
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

Visit `http://127.0.0.1:8001` for the app, `http://127.0.0.1:8001/docs` for Swagger UI.

> **SQLite fallback**: If no `DATABASE_URL` is set, the app uses `./clothing.db` automatically.

### Windows One-Click Launch
```
run_backend.bat
```
This script installs dependencies, seeds the DB, and starts Uvicorn.

### Seeding Extra Products
To bulk-load 80 additional products (T-Shirts, Hoodies, Jackets, Sports Uniforms) into SQLite:
```bash
python seed_products.py
```

---

## Docker Deployment

### Quick Start
```bash
# 1. Copy and configure environment
cp .env.example .env
# Edit .env with your SMTP credentials, SECRET_KEY, etc.

# 2. Start all services
docker compose up --build -d

# 3. Check health
docker compose ps
docker compose logs backend
```

The app will be available at `http://localhost:8001`.

### Services

| Service | Container | Port | Description |
|---|---|---|---|
| `db` | `aura_db` | 5432 | PostgreSQL 16 |
| `backend` | `aura_backend` | 8001 | FastAPI + static files |

### Data Persistence
- `db_data` volume — PostgreSQL data directory
- `uploads_data` volume — Customer logo uploads at `/app/uploads/logos/`

### Stopping
```bash
docker compose down           # Keep data
docker compose down -v        # Wipe all volumes (destructive)
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
# PostgreSQL
POSTGRES_DB=aurawear
POSTGRES_USER=aura
POSTGRES_PASSWORD=aurapassword
DATABASE_URL=postgresql+asyncpg://aura:aurapassword@localhost:5432/aurawear

# JWT — generate with: python3 -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=60

# SMTP Email (leave blank to skip sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your@gmail.com
ADMIN_EMAIL=admin@yourdomain.com

# n8n AI Integration (optional)
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/aura-chat

# HTTPS enforcement (only if behind a reverse proxy)
ENFORCE_HTTPS=false
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords. Generate one for "Mail".

---

## Customizer Logic

### Garment Types → SVG Templates

| Type | SVG | Views |
|---|---|---|
| `tshirt` | T-Shirt outline | Front, Back |
| `hoodie` | Hoodie with pocket | Front, Back |
| `jacket` | Zip jacket | Front, Back |
| `uniform` | Sports jersey | Front, Back |

The SVG renderer injects `primaryColor` and `secondaryColor` directly into SVG fill attributes via JavaScript. Switching the front/back view re-renders the SVG.

### Fabric GSM Map

| Grade | GSM | Description |
|---|---|---|
| 1 | 150 GSM | Lightweight summer |
| 2 | 180 GSM | Regular fit |
| 3 | 220 GSM | Standard weight |
| 4 | 240 GSM | Heavy duty |
| 5 | 300 GSM | Premium heavyweight |

### Wash Finish Pricing

| Finish | Extra Cost |
|---|---|
| Standard | +PKR 0 |
| Enzyme Wash | +PKR 100 |
| Stone Wash | +PKR 150 |
| Acid Wash | +PKR 250 |

---

## Pricing Engine

Order total calculation (server-side in `routers/orders.py`):

```
unit_price = (base_price × fabric_multiplier) + stitch_cost + print_cost + wash_cost

quantity_discount:
  ≥ 10 pcs  → 10% off
  ≥ 50 pcs  → 20% off

item_total = unit_price × quantity × (1 − quantity_discount)

grand_total = sum(item_totals)
tax = grand_total × 5%                    # GST
shipping = chosen shipping option cost

final_total = grand_total + tax + shipping
```

**Coupon codes** (client-side, applied before checkout submission):

| Code | Discount |
|---|---|
| AURA10 | 10% off subtotal |
| SAVE20 | 20% off subtotal |
| FYP2025 | 15% student discount |
| FIRST50 | 50% off first order |

> Coupons are applied to subtotal before GST and shipping are added.

---

## Admin Panel

Access the admin panel by logging in as an admin user, then clicking the dashboard icon.

### Tabs

| Tab | Contents |
|---|---|
| **Overview** | KPI cards + Canvas bar charts (order status, revenue) |
| **Products** | Product table with add/edit/toggle/delete; image URL upload |
| **Orders** | All orders table; status dropdown; Export CSV button |
| **Users** | User list; role change; ban/unban; delete |
| **Inventory** | Fabric/dye stock; edit qty; reorder level alerts |
| **FAQs** | Add/edit/toggle/delete FAQ entries |
| **RAG Logs** | Last 200 chatbot conversations with retrieved context |

### Manual Order Creation

Admins can log walk-in or phone orders:
- Select from live product list (fetched from `/api/products`)
- Set customer name, colors, quantity, payment method, notes
- Order is created under the admin's user account

---

## Order Lifecycle

```
Customer places order
    ↓
Email: "Order Confirmed" → Customer
Email: "New Order Alert" → Admin
    ↓
Admin sets status: "In Production"
Email: "Status Update" → Customer
    ↓
Admin sets status: "Quality Check"
    ↓
Admin sets status: "Shipped"
    ↓
Admin sets status: "Delivered"

--- OR ---

Customer cancels (Pending only): PATCH /orders/{id}/cancel
```

---

## Known Limitations

| # | Issue | Impact |
|---|---|---|
| 1 | `SECRET_KEY` hardcoded in `auth.py` | JWT security risk in production |
| 2 | `debug_otp` in forgot-password response | OTP leaked in API response |
| 3 | `ACCESS_TOKEN_EXPIRE_MINUTES` env ignored | Token always expires in 30 min |
| 4 | CORS `allow_origins=["*"]` | Any origin can call the API |
| 5 | Size (XS–XXL) not saved to DB | No size data in order records |
| 6 | No real payment gateway | Payments are stub-only (COD, Card declared) |
| 7 | `seed_products.py` uses raw sqlite3 | Won't work with PostgreSQL |
| 8 | No rate limiting | Susceptible to brute-force on auth endpoints |
| 9 | Inventory deduction is approximate | 2 fabric rolls/unit, no product↔inventory mapping |
| 10 | No image upload to server | Product images must be external URLs |

---

## Project Structure

```
custom-clothing-/
├── main.py                    # FastAPI app entry point, router registration
├── index.html                 # Single-page application HTML (~1300 lines)
├── style.css                  # All styles (~2500 lines)
├── app.js                     # All frontend JS (~2700 lines)
├── requirements.txt           # Python dependencies
├── Dockerfile                 # Production container image
├── docker-compose.yml         # Multi-service orchestration
├── .env.example               # Environment variable template
├── run_backend.bat            # Windows one-click launcher
├── server.py                  # Legacy static file server (dev only)
├── seed_products.py           # Bulk product seeder (SQLite only)
│
├── database/
│   ├── database.py            # SQLAlchemy engine + session + Base
│   └── seed.py                # Startup seeder (products, fabrics, FAQs)
│
├── models/
│   └── models.py              # 13 ORM table definitions
│
├── schemas/
│   └── schemas.py             # Pydantic request/response models
│
├── routers/
│   ├── auth.py                # Authentication + profile + password reset
│   ├── products.py            # Product catalog + customization options
│   ├── orders.py              # Order CRUD + pricing engine + logo upload
│   ├── chat.py                # RAG chatbot + n8n integration + log storage
│   ├── inventory.py           # Inventory CRUD
│   ├── users.py               # Admin user management
│   ├── analytics.py           # Dashboard statistics aggregation
│   └── faqs.py                # FAQ CRUD
│
├── utils/
│   └── email.py               # SMTP email sender (4 templates)
│
└── uploads/
    └── logos/                 # Customer-uploaded logo files
```

---

## License

This project is developed as a Final Year Project (FYP) for academic purposes.

**Developer:** Umer Javed
**Institution:** FYP 2025–2026
**Stack:** FastAPI · PostgreSQL · Vanilla JS · Docker · n8n
