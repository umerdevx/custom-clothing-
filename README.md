# AURA-WEAR — AI Custom Clothing Platform

> **Final Year Project (FYP) 2025–2026**
> Full-stack AI-integrated custom clothing e-commerce platform built with FastAPI, vanilla JavaScript, PostgreSQL, Google Gemini AI, and Three.js 3D rendering.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Frontend SPA](#frontend-spa)
8. [AI Chatbot (Gemini + RAG)](#ai-chatbot-gemini--rag)
9. [3D Preview Engine](#3d-preview-engine)
10. [n8n Integration](#n8n-integration)
11. [Email Notifications](#email-notifications)
12. [Authentication & Security](#authentication--security)
13. [Getting Started](#getting-started)
14. [Docker Deployment](#docker-deployment)
15. [Environment Variables](#environment-variables)
16. [Customizer Logic](#customizer-logic)
17. [Pricing Engine](#pricing-engine)
18. [Admin Panel](#admin-panel)
19. [Order Lifecycle](#order-lifecycle)
20. [Known Limitations](#known-limitations)
21. [Project Structure](#project-structure)

---

## Project Overview

AURA-WEAR is a custom clothing platform where customers design garments in real time — choosing fabric type, GSM grade, primary/secondary colors, stitching style, print method, and wash finish — then place orders with automated email confirmation.

A **Google Gemini-powered AI chatbot** with live RAG retrieval assists customers with product queries and order tracking. The customizer renders designs simultaneously in **2D SVG** and **interactive 3D** (Three.js WebGL). Admins manage the full manufacturing pipeline from a dashboard.

---

## Key Features

### Customer-Facing
| Feature | Details |
|---|---|
| **Product Catalog** | 80+ products across T-Shirts, Hoodies, Jackets, Sports Uniforms |
| **2D Live Canvas** | Front/back SVG views with real-time color, fabric, and logo injection |
| **3D Interactive Preview** | Three.js WebGL renderer — rotate and inspect garment in full 3D, live color sync |
| **Multi-Logo Support** | Upload multiple PNG/JPG logos; position per placement zone |
| **Size Selection** | XS / S / M / L / XL / XXL tile picker |
| **Cart** | Multi-item cart with size, color, quantity tracking |
| **Coupon Codes** | AURA10 (10%), SAVE20 (20%), FYP2025 (15%), FIRST50 (50%) |
| **Shipping Options** | DHL Express (800), TCS Overnight (450), Leopards (350), BlueEx (250), Standard Post (150) |
| **Checkout** | GST 5% + shipping + coupon discount; COD, Card, Bank Transfer, JazzCash, EasyPaisa |
| **My Orders** | View order history, track status, cancel Pending orders |
| **User Profile** | Edit name, phone, address |
| **Password Reset** | OTP-based via email (10-minute expiry) |
| **AI Chatbot** | Gemini-powered with real-time RAG — fabric recs, pricing, order tracking |
| **Chat Persistence** | Chat history persists across page refreshes (sessionStorage) |
| **Markdown Rendering** | Bold, italic, and line breaks rendered properly in chat bubbles |

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
| **AI Chat Logs** | Browse the last 200 chatbot conversations with retrieved context |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11, FastAPI, Uvicorn (ASGI) |
| **ORM** | SQLAlchemy 2.0 (async) |
| **Database** | PostgreSQL 16 |
| **Auth** | JWT (python-jose), bcrypt (passlib) |
| **Email** | SMTP via smtplib (Gmail-ready) |
| **HTTP Client** | httpx (async, for Gemini API calls) |
| **Frontend** | Vanilla JavaScript (no framework), HTML5 Canvas API, CSS3 |
| **3D Engine** | Three.js r128 (WebGL, UMD build) |
| **AI** | Google Gemini Flash (`gemini-flash-latest`) via REST API |
| **Workflow Automation** | n8n 2.x (optional secondary AI pipeline via webhook) |
| **Containerization** | Docker, Docker Compose |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (SPA)                           │
│   index.html + style.css + app.js                               │
│   ┌──────────┐ ┌────────────────┐ ┌──────────┐ ┌────────────┐  │
│   │ Catalog  │ │  AI Customizer │ │Checkout  │ │Admin Panel │  │
│   └──────────┘ └───────┬────────┘ └──────────┘ └────────────┘  │
│              2D SVG    │   Three.js 3D                           │
└───────────────────────┬─────────────────────────────────────────┘
                        │ fetch() / REST API
┌───────────────────────▼─────────────────────────────────────────┐
│                    FastAPI (port 8001)                           │
│  ┌────────┐ ┌──────────┐ ┌────────┐ ┌────────┐ ┌───────────┐  │
│  │ /auth  │ │/products │ │/orders │ │ /chat  │ │/analytics │  │
│  └────────┘ └──────────┘ └────────┘ └───┬────┘ └───────────┘  │
│  ┌─────────────┐ ┌──────────┐           │ httpx                 │
│  │ /inventory  │ │  /faqs   │           │                       │
│  └─────────────┘ └──────────┘           │                       │
└──────────────────────┬──────────────────┼──────────────────────┘
                       │ SQLAlchemy       │
          ┌────────────▼──────────┐  ┌────▼────────────────────┐
          │   PostgreSQL 16       │  │  Google Gemini API       │
          │   (13 tables)         │  │  gemini-flash-latest     │
          └───────────────────────┘  │  + RAG context from DB   │
                                     └─────────────────────────┘
                                               │ (optional fallback)
                                     ┌─────────▼──────────────┐
                                     │  n8n Workflow (5678)   │
                                     │  AURA-WEAR Chatbot     │
                                     └────────────────────────┘
```

**AI chatbot request flow:**
1. User sends message → `POST /api/chat`
2. Backend performs RAG retrieval (Products, FabricOptions, Orders, FAQs from DB)
3. Assembled context + user query → Google Gemini API (`gemini-flash-latest`)
4. Gemini returns AI response (thinking model — non-thought parts extracted)
5. Response logged to `ChatLog` table
6. Return `{reply, retrieved_context}` to frontend
7. Frontend renders markdown (`**bold**`, `*italic*`, newlines → `<br>`)

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

> **Note:** Garment size (XS–XXL) is UI-only state tracked in `state.currentCustomization.size` and not persisted to the database.

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
| `GET` | `/me` | Customer | Get current user profile |
| `PATCH` | `/profile` | Customer | Update name, phone, address |
| `POST` | `/forgot-password` | Public | Request OTP for password reset |
| `POST` | `/verify-otp` | Public | Verify OTP (6-digit, 10-min expiry) |
| `POST` | `/reset-password` | Public | Reset password with OTP |

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

**Order status pipeline:**
```
Pending → In Production → Quality Check → Shipped → Delivered
       ↘ Cancelled (from Pending only)
```

---

### Chat — `/api/chat`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Optional | Send message to Gemini AI chatbot |
| `GET` | `/logs` | Admin | Last 200 chat logs |

**Request:**
```json
{
  "message": "What hoodies do you have and what fabrics work for winter?",
  "session_id": "sess-abc123"
}
```

**Response:**
```json
{
  "reply": "For winter hoodies, we recommend **Brushed Fleece** (Grade 4–5)...",
  "retrieved_context": "Product: Aura Sherpa-Lined Hoodie | Base Price: PKR 3200\nFabric: Brushed Fleece | Grade: 4 | Multiplier: 1.3x"
}
```

---

### Analytics — `/api/analytics`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Admin | Dashboard statistics |

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

Driven by `switchView(viewName)` in `app.js`.

### Views
| View ID | Access | Description |
|---|---|---|
| `home` | Public | Product catalog with category filters |
| `customizer` | Public | 2D + 3D garment customizer |
| `cart` | Public | Cart summary |
| `orders` | Customer | My order history |
| `profile` | Customer | Edit name, phone, address |
| `admin` | Admin | Full admin dashboard |

### State Object
```javascript
state = {
  currentView: 'home',
  cart: [],
  currentCustomization: {
    productId: null,
    productType: 'tshirt',    // tshirt | hoodie | jacket | uniform
    view: 'front',
    primaryColor: '#6C63FF',
    secondaryColor: '#FFFFFF',
    fabricType: 'cotton',
    fabricGrade: 1,
    stitchStyle: 'standard',
    printMethod: 'dtg',
    washFinish: 'standard',
    logoBase64: null,
    size: 'M',
    quantity: 1,
    notes: ''
  },
  chatSessionId: 'sess-...',   // persisted in localStorage
}
```

---

## AI Chatbot (Gemini + RAG)

### How It Works

1. User types a message in the floating chat widget
2. Frontend calls `POST /api/chat` with the message and session ID
3. Backend runs **RAG retrieval** — keyword-based queries against PostgreSQL:
   - **Orders** — fetches user's recent 3 orders (if logged in), or specific `ORD-xxxxxx` if mentioned
   - **Products** — matches product name/category keywords
   - **Fabrics** — matches fabric type keywords
   - **FAQs** — matches FAQ question keywords (>3 chars)
4. Retrieved rows assembled as plain-text context
5. Context + user query sent to **Google Gemini** (`gemini-flash-latest`) via REST API
6. Gemini response extracted (thinking model — filters `thought: true` parts)
7. Response logged, returned to frontend
8. Frontend renders markdown: `**bold**` → `<strong>`, `*italic*` → `<em>`, `\n` → `<br>`

### System Prompt

AURA-AI is instructed to:
- Use database context when available; fall back to general AURA-WEAR knowledge
- Respond warmly to greetings and direct to products/orders
- Quote all prices in PKR
- Never mention internal system names, APIs, or how data is retrieved
- Keep answers concise (2–4 sentences)

### Local Fallback (if Gemini unavailable)

| Query keyword | Response |
|---|---|
| order / track / ORD- | Order status with manufacturing stage description |
| cotton / summer / sport | Cotton/Dry-Fit recommendation |
| fleece / winter / hoodie | Fleece fabric recommendation |
| ship / deliver | Delivery time and pricing |
| hi / hello / salam | Warm greeting with feature overview |
| (default) | General AURA-AI introduction |

---

## 3D Preview Engine

The customizer renders a live **Three.js WebGL** 3D garment alongside the 2D SVG flat view.

### How It Works
- Three.js scene loads a 3D garment mesh (`.glb` / procedural geometry)
- `primaryColor` and `secondaryColor` from the customizer state are applied as material colors in real-time
- User can rotate the model by dragging (OrbitControls)
- The 2D and 3D panels sit side-by-side in the customizer layout

### Controls
| Action | Result |
|---|---|
| Drag | Rotate garment |
| Scroll | Zoom in/out |
| Double-tap | Reset camera |

### Tech
- Three.js r128 (UMD CDN build)
- GLTFLoader for `.glb` models
- OrbitControls for camera interaction
- MeshStandardMaterial with real-time color binding

---

## n8n Integration

n8n runs as a **secondary AI pipeline** (optional fallback). It is currently **disabled** in the main chat flow since Gemini handles all requests directly. It can be re-enabled for advanced workflow automation.

### Current Status
- n8n service runs at `http://localhost:5678`
- Workflow: **AURA-WEAR Chatbot** (published and active)
- Webhook: `POST /webhook/aura-chat`
- The workflow calls Gemini (`gemini-flash-latest`) via HTTP Request node using `$env.GEMINI_API_KEY`

### Webhook Payload (expected by n8n)
```json
{
  "query": "What fabrics do you have for winter hoodies?",
  "context": "Fabric: Brushed Fleece | Grade: 4 | Multiplier: 1.3x\nProduct: Aura Sherpa-Lined Hoodie...",
  "session_id": "sess-abc123",
  "user_id": 5
}
```

### n8n Workflow Nodes
```
Webhook Trigger (POST /webhook/aura-chat)
    ↓
Prepare Prompt (Code node — builds Gemini payload)
    ↓
Google Gemini Flash (HTTP Request → gemini-flash-latest)
    ↓
Extract Reply (Code node — filters thinking model parts)
    ↓
Respond to Webhook (JSON → { output: "..." })
```

### Other n8n Automation Ideas

| Use Case | n8n Nodes |
|---|---|
| Order status email digest | Webhook → DB Query → Email (daily cron) |
| Low-stock Slack alert | Cron → HTTP → Slack |
| Customer win-back | Webhook on cancelled order → delay → Email |
| Sales report PDF | Cron → DB query → HTML to PDF → Email |
| Chat escalation | Gemini node → IF (confidence < threshold) → Slack |

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

- **Algorithm:** HS256 JWT
- **Payload:** `{sub: email, user_id: int, role: string, exp: timestamp}`
- **Expiry:** 60 minutes (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`)
- **Roles:** `admin` (full access) | `customer` (own orders, profile, chatbot)
- **First user** registered automatically becomes admin

### Password Reset Flow
1. `POST /api/auth/forgot-password` — generates 6-digit OTP, stores in DB, sends email
2. `POST /api/auth/verify-otp` — validates OTP + expiry
3. `POST /api/auth/reset-password` — hashes new password, marks OTP used

---

## Getting Started

### Prerequisites
- Docker & Docker Compose (recommended)
- Or: Python 3.11+, PostgreSQL 16

### Docker (Recommended)

```bash
# 1. Clone and configure
git clone <repo-url>
cd custom-clothing-
cp .env.example .env
# Edit .env — add GEMINI_API_KEY, SMTP credentials, SECRET_KEY

# 2. Start all services (PostgreSQL + FastAPI + n8n)
docker compose up --build -d

# 3. Verify
docker compose ps
docker compose logs backend --tail 20
```

App: `http://localhost:8001` | n8n: `http://localhost:5678` | Swagger: `http://localhost:8001/docs`

### Local Development (without Docker)

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

> SQLite fallback: if no `DATABASE_URL` is set, the app uses `./clothing.db` automatically.

---

## Docker Deployment

### Services

| Service | Container | Port | Description |
|---|---|---|---|
| `db` | `aura_db` | 5432 | PostgreSQL 16 |
| `n8n` | `aura_n8n` | 5678 | n8n workflow automation |
| `backend` | `aura_backend` | 8001 | FastAPI + static files |

### Data Persistence
- `db_data` — PostgreSQL data directory
- `n8n_data` — n8n workflows, credentials, execution history
- `uploads_data` — Customer logo uploads at `/app/uploads/logos/`

### Useful Commands
```bash
docker compose up --build -d          # Build and start all
docker compose logs backend -f        # Stream backend logs
docker compose restart backend        # Restart after code change
docker compose down                   # Stop (keep data)
docker compose down -v                # Stop and wipe all volumes
```

---

## Environment Variables

```bash
# PostgreSQL
POSTGRES_DB=aurawear
POSTGRES_USER=aura
POSTGRES_PASSWORD=aurapassword
DATABASE_URL=postgresql+asyncpg://aura:aurapassword@localhost:5432/aurawear

# Google Gemini AI — generate at https://aistudio.google.com
GEMINI_API_KEY=your-gemini-api-key

# JWT
SECRET_KEY=your-secret-key-here   # python3 -c "import secrets; print(secrets.token_hex(32))"
ACCESS_TOKEN_EXPIRE_MINUTES=60

# SMTP Email (leave blank to skip sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your@gmail.com
ADMIN_EMAIL=admin@yourdomain.com
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords.

---

## Customizer Logic

### Garment Types → SVG + 3D

| Type | Views | 3D Mesh |
|---|---|---|
| `tshirt` | Front, Back | T-Shirt geometry |
| `hoodie` | Front, Back | Hoodie with pocket |
| `jacket` | Front, Back | Zip jacket |
| `uniform` | Front, Back | Sports jersey |

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

```
unit_price = (base_price × fabric_multiplier) + stitch_cost + print_cost + wash_cost

quantity_discount:
  ≥ 10 pcs  → 10% off
  ≥ 50 pcs  → 20% off

item_total = unit_price × quantity × (1 − quantity_discount)
grand_total = sum(item_totals)
tax         = grand_total × 5%   (GST)
final_total = grand_total + tax + shipping_cost − coupon_discount
```

**Coupon codes** (client-side):

| Code | Discount |
|---|---|
| AURA10 | 10% off subtotal |
| SAVE20 | 20% off subtotal |
| FYP2025 | 15% student discount |
| FIRST50 | 50% off first order |

---

## Admin Panel

### Tabs

| Tab | Contents |
|---|---|
| **Overview** | KPI cards + Canvas bar charts (order status, revenue) + system health |
| **Products** | Product table with add/edit/toggle/delete |
| **Orders** | All orders; status dropdown; Export CSV |
| **Users** | User list; role change; ban/unban; delete |
| **Inventory** | Fabric/dye stock; edit qty; reorder alerts |
| **FAQs** | Add/edit/toggle/delete FAQ entries |
| **AI Chat Logs** | Last 200 Gemini chatbot conversations with RAG context |

---

## Order Lifecycle

```
Customer places order
    ↓
Email: "Order Confirmed" → Customer
Email: "New Order Alert" → Admin
    ↓
Admin: "In Production" → Email to Customer
    ↓
Admin: "Quality Check"
    ↓
Admin: "Shipped" → Email to Customer
    ↓
Admin: "Delivered"

--- OR ---

Customer cancels (Pending only): PATCH /orders/{id}/cancel
```

---

## Known Limitations

| # | Issue | Impact |
|---|---|---|
| 1 | `SECRET_KEY` hardcoded in `auth.py` | JWT security risk in production |
| 2 | `debug_otp` in forgot-password response | OTP leaked in API response |
| 3 | CORS `allow_origins=["*"]` | Any origin can call the API |
| 4 | Size (XS–XXL) not saved to DB | No size data in order records |
| 5 | No real payment gateway | Payments are stub-only |
| 6 | No rate limiting | Susceptible to brute-force on auth |
| 7 | Inventory deduction approximate | No product↔inventory mapping |
| 8 | No image upload to server | Product images must be external URLs |
| 9 | Gemini free-tier quota | New Google Cloud project needed if quota exhausted |

---

## Project Structure

```
custom-clothing-/
├── main.py                    # FastAPI app entry point, router registration
├── index.html                 # Single-page application HTML
├── style.css                  # All styles
├── app.js                     # All frontend JS (SPA logic + 2D/3D customizer + chat)
├── requirements.txt           # Python dependencies
├── Dockerfile                 # Production container image
├── docker-compose.yml         # Multi-service: PostgreSQL + n8n + FastAPI
├── .env.example               # Environment variable template
├── run_backend.bat            # Windows one-click launcher
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
│   ├── chat.py                # Gemini AI + RAG retrieval + chat log storage
│   ├── inventory.py           # Inventory CRUD
│   ├── users.py               # Admin user management
│   ├── analytics.py           # Dashboard statistics aggregation
│   └── faqs.py                # FAQ CRUD
│
├── utils/
│   └── email.py               # SMTP email sender (4 templates)
│
├── n8n/
│   ├── aura-wear-workflow.json  # n8n workflow (Gemini-powered chatbot pipeline)
│   ├── docker-compose.n8n.yml  # Standalone n8n compose reference
│   └── README-n8n.md           # n8n setup guide
│
└── uploads/
    └── logos/                 # Customer-uploaded logo files
```

---

## License

Developed as a Final Year Project (FYP) for academic purposes.

**Developer:** Sharjeel Sohail
**Institution:** FYP 2025–2026
**Stack:** FastAPI · PostgreSQL · Vanilla JS · Three.js · Google Gemini AI · n8n · Docker
