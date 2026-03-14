# 🔥 DRIPkaRt — ULTIMATE MASTER PROMPT
### Complete Full-Stack E-Commerce Build Guide
> Version 1.0 | Stack: Vite + React → Vercel | Hono → Cloudflare Workers | Neon PostgreSQL
> Follow every phase in exact order. Do not skip any step.

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 1 — BRAND IDENTITY & DESIGN SYSTEM
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 1.1 Brand Overview

| Field | Value |
|---|---|
| Brand Name | **DRIPkaRt** |
| Logo Style | Mixed-case serif — "DRIP" bold, "ka" italic light, "Rt" bold |
| Brand Category | Premium Indian Streetwear |
| Target Audience | 18–32 year old urban Indians |
| Tone | Confident, minimal, editorial. No exclamation marks. |
| Primary Tagline | *"Premium streetwear for those who refuse to blend in."* |
| Secondary Tagline | *"Drip Season is Here."* |

## 1.2 Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary Background | Off-white warm | `#fafaf8` |
| Secondary Background | Cream | `#f2f0ec` |
| Hero Background | Dark Teal | `#1a2c2a` |
| Primary Text | Near Black | `#0a0a0a` |
| **ACCENT — Neon** | **Yellow-Green** | **`#c8ff00`** |
| Muted Text | Grey | `#888888` |
| Footer | Deep Black | `#0a0a0a` |

> The neon `#c8ff00` is used on: badges, CTA hovers, ticker strip, logo "ka", links on hover, upload progress bar. It is the ONLY accent color. Never add more colors.

## 1.3 Typography

| Role | Font | Weight | Size | Style |
|---|---|---|---|---|
| Hero Wordmark | Cormorant Garamond | 600 | ~140px | Mixed with italic 300 |
| Section Titles | Cormorant Garamond | 400 | 38px | Italic |
| Editorial Headings | Cormorant Garamond | 300 | 44px | Italic |
| Footer Brand | Cormorant Garamond | 600 | 32px | Normal |
| Product Price | Cormorant Garamond | 600 | 15px | Normal |
| Nav Links | Outfit | 400 | 12px | Uppercase |
| Body / Labels | Outfit | 300–500 | 10–14px | Normal |
| CTA Buttons | Outfit | 500 | 11px | Uppercase |

Both fonts loaded from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet"/>
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 2 — FRONTEND (VITE + REACT → VERCEL)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 2.1 Frontend Tech Stack

| Layer | Tech |
|---|---|
| Build Tool | Vite |
| Framework | React 18 + TypeScript |
| Routing | React Router DOM v6 |
| State Management | Zustand |
| Server State | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Image Upload | React Dropzone |
| Notifications | React Hot Toast |
| Styling | Pure CSS + Google Fonts (no Tailwind) |
| Deployment | Vercel |

## 2.2 Frontend Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Ticker.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── Footer.tsx
│   │   └── admin/
│   │       ├── AdminLayout.tsx
│   │       └── Sidebar.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderSuccess.tsx
│   │   ├── OrderTracking.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── Products.tsx
│   │       ├── AddProduct.tsx     ← ONE FORM → LIVE ON SITE
│   │       ├── EditProduct.tsx
│   │       └── Orders.tsx
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   ├── useAuth.ts
│   │   └── useOrders.ts
│   ├── services/
│   │   └── api.ts                ← Axios instance → Cloudflare Worker URL
│   ├── store/
│   │   ├── cartStore.ts
│   │   └── authStore.ts
│   └── types/
│       └── index.ts
├── .env
│   └── VITE_API_URL=https://dripkart-api.workers.dev
└── vite.config.ts
```

## 2.3 Frontend Pages — Section by Section

### HOME PAGE SECTIONS (in order):

**Section 1 — Fixed Navigation Bar**
- Transparent over hero, becomes solid white with blur on scroll
- LEFT: Home | Shop | Collections | About
- CENTER: DRIPkaRt logo (serif, mixed case)
- RIGHT: Search icon | Account icon | Cart icon (with item count badge)
- Smooth 0.4s transition between transparent and solid states

**Section 2 — Hero (Full viewport height)**
- Background: Dark teal `#1a2c2a` with radial gradients + grain texture overlay
- Fashion model photo — positioned bottom-right, 85% height
- Top-right label: "Exclusive & Trending Collection" (italic serif, white 70% opacity)
- Bottom-left: "NEW SEASON 2026" label in `#c8ff00` + description text + "Explore More →" outlined CTA button
- Giant "DRIPkaRt" wordmark overlaid at hero bottom — "ka" in neon yellow-green
- All hero elements: fade-up animations on load (staggered 0.1s–0.6s delays)

**Section 3 — Ticker Strip**
- Background: `#c8ff00` solid
- Infinite scrolling text: "New Arrivals ✦ Premium Streetwear ✦ Free Shipping Over ₹1999 ✦ Drip Season is Here ✦ Limited Drops ✦" (repeating, 18s loop)
- Font: Cormorant Garamond 600 Italic, black text

**Section 4 — New Arrivals Grid**
- Header: "New Arrival" (serif italic) + "View all ›" right-aligned
- 4-column product grid, 2px gap
- Each card: product image (3:4 ratio), badge top-right, name, price
- On hover: image scales 1.03x + "Quick Add" button slides up from bottom

**Section 5 — Editorial Split Panels**
- Left panel (dark teal): "THE DROP" label + "Street Culture, Refined." heading + CTA
- Right panel (cream): "ESSENTIALS" label + "Clean Lines, Bold Drip." heading + CTA

**Section 6 — Comfort & Confidence Section**
- Cream background, centered
- Large italic serif heading: "Comfort and Confidence"
- Short brand philosophy paragraph
- "Shop All Collections →" link

**Section 7 — Footer**
- Black background, 4-column grid
- Column 1: DRIPkaRt logo + tagline
- Column 2: Shop links
- Column 3: Help links
- Column 4: Brand links
- Footer bar: copyright left + "Made with ✦" right

## 2.4 Frontend Install Commands

```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install axios zustand @tanstack/react-query react-router-dom
npm install react-hook-form zod @hookform/resolvers
npm install react-dropzone react-hot-toast
```

## 2.5 Frontend Environment Variables

```env
# /frontend/.env
VITE_API_URL=https://dripkart-api.your-account.workers.dev
```

## 2.6 Vercel Deployment

```bash
npm install -g vercel
vercel --prod
# Set VITE_API_URL in Vercel Dashboard → Project Settings → Environment Variables
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 3 — BACKEND (HONO → CLOUDFLARE WORKERS)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 3.1 Why Cloudflare Workers is Different from Node.js

Cloudflare Workers runs on V8 isolates — NOT Node.js.

```
❌ NEVER USE THESE IN WORKERS:
- process.env       → use c.env.VARIABLE instead
- Fastify / Express → use Hono instead
- Prisma ORM        → use Drizzle + Neon HTTP driver
- bcrypt            → use Web Crypto API (PBKDF2)
- jsonwebtoken      → use jose library
- ioredis / Redis   → use Cloudflare KV
- axios (backend)   → use native fetch()
- node:crypto       → use global crypto.subtle
- fs / path         → no file system in Workers

✅ ALWAYS USE THESE:
- Hono for routing
- Drizzle ORM for DB queries
- @neondatabase/serverless for Neon HTTP connection
- jose for JWT
- Web Crypto API for password hashing
- Cloudflare KV for caching
- native fetch() for external HTTP calls
- c.env.VARIABLE_NAME for all secrets
```

## 3.2 Backend Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Runtime | Cloudflare Workers (V8) | Edge, 0ms cold start, global |
| Framework | **Hono** | Built for edge, TypeScript-first |
| Language | TypeScript | End-to-end type safety |
| Database | **Neon PostgreSQL** | Serverless Postgres, HTTP driver |
| ORM | **Drizzle ORM** | Works in edge, type-safe |
| Auth | **jose** (JWT) | Web Crypto compatible |
| Passwords | **Web Crypto PBKDF2** | Built into V8, no bcrypt needed |
| Cache | **Cloudflare KV** | Built-in, replaces Redis |
| Image Storage | **Cloudinary** (HTTP API) | REST calls, no SDK needed |
| Payments | **PhonePe** + **Razorpay** | Primary + fallback |
| Delivery | **ShipRocket** | Multi-courier aggregator |
| Validation | **Zod** | Runtime schema validation |
| Deployment | **Wrangler CLI** | Official CF Workers deploy tool |

## 3.3 Backend Folder Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── admin.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── payments.ts
│   │   └── shipping.ts
│   ├── middleware/
│   │   ├── auth.ts          ← JWT verification middleware
│   │   └── adminOnly.ts     ← Admin role check
│   ├── db/
│   │   ├── schema.ts        ← Drizzle schema (all tables)
│   │   ├── index.ts         ← getDb(url) helper
│   │   └── migrations/      ← SQL migration files
│   ├── services/
│   │   ├── cloudinary.ts    ← HTTP image upload/delete
│   │   ├── phonepe.ts       ← PhonePe payment logic
│   │   ├── razorpay.ts      ← Razorpay fallback logic
│   │   └── shiprocket.ts    ← Delivery logic
│   ├── utils/
│   │   ├── crypto.ts        ← PBKDF2 hash + verify
│   │   ├── jwt.ts           ← jose sign + verify
│   │   ├── generateSlug.ts  ← "Mens Hoodie" → "mens-hoodie"
│   │   └── generateSKU.ts   ← "HOOD-4821"
│   ├── types/
│   │   └── env.ts           ← Env interface for all bindings
│   └── index.ts             ← Hono app + export default app
├── wrangler.toml            ← CF Workers config + KV bindings
├── drizzle.config.ts
├── tsconfig.json
└── package.json
```

## 3.4 Backend Install Commands

```bash
cd backend
npm init -y
npm install hono jose zod
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit wrangler typescript @cloudflare/workers-types
```

## 3.5 wrangler.toml

```toml
name = "dripkart-api"
main = "src/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[[kv_namespaces]]
binding = "CACHE"
id = "REPLACE_WITH_YOUR_KV_ID"
preview_id = "REPLACE_WITH_YOUR_PREVIEW_KV_ID"

[vars]
FRONTEND_URL = "https://dripkart.vercel.app"
PHONEPE_ENV = "production"
```

## 3.6 All Secrets to Set

```bash
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
wrangler secret put JWT_REFRESH_SECRET
wrangler secret put CLOUDINARY_CLOUD_NAME
wrangler secret put CLOUDINARY_API_KEY
wrangler secret put CLOUDINARY_API_SECRET
wrangler secret put PHONEPE_MERCHANT_ID
wrangler secret put PHONEPE_SALT_KEY
wrangler secret put PHONEPE_SALT_INDEX
wrangler secret put RAZORPAY_KEY_ID
wrangler secret put RAZORPAY_KEY_SECRET
wrangler secret put SHIPROCKET_EMAIL
wrangler secret put SHIPROCKET_PASSWORD
wrangler secret put EMAIL_FROM
wrangler secret put SMTP_USER
wrangler secret put SMTP_PASS
```

## 3.7 Env Type Definition

```typescript
// src/types/env.ts
export interface Env {
  CACHE: KVNamespace
  DATABASE_URL: string
  JWT_SECRET: string
  JWT_REFRESH_SECRET: string
  FRONTEND_URL: string
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
  PHONEPE_MERCHANT_ID: string
  PHONEPE_SALT_KEY: string
  PHONEPE_SALT_INDEX: string
  RAZORPAY_KEY_ID: string
  RAZORPAY_KEY_SECRET: string
  SHIPROCKET_EMAIL: string
  SHIPROCKET_PASSWORD: string
}
```

## 3.8 Main Server — index.ts

```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import type { Env } from './types/env'
import authRoutes     from './routes/auth'
import productRoutes  from './routes/products'
import adminRoutes    from './routes/admin'
import cartRoutes     from './routes/cart'
import orderRoutes    from './routes/orders'
import paymentRoutes  from './routes/payments'
import shippingRoutes from './routes/shipping'

const app = new Hono<{ Bindings: Env }>()

app.use('*', logger())
app.use('*', cors({
  origin: (origin, c) => c.env.FRONTEND_URL,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.get('/health', (c) => c.json({ status: 'ok' }))
app.route('/api/auth',     authRoutes)
app.route('/api/products', productRoutes)
app.route('/api/admin',    adminRoutes)
app.route('/api/cart',     cartRoutes)
app.route('/api/orders',   orderRoutes)
app.route('/api/payments', paymentRoutes)
app.route('/api/shipping', shippingRoutes)
app.notFound((c) => c.json({ error: 'Not found' }, 404))
app.onError((err, c) => c.json({ error: err.message }, 500))

export default app   // ← CRITICAL: Cloudflare Workers needs this exact export
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 4 — DATABASE (NEON POSTGRESQL + DRIZZLE)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 4.1 Neon Setup Steps

1. Go to **neon.tech** → Create free account
2. Create new project → Name: "dripkart"
3. Region: **Asia Pacific (Singapore)** — lowest latency for India
4. Copy connection string (looks like):
   `postgresql://user:pass@ep-xxx.ap-southeast-1.aws.neon.tech/dripkart?sslmode=require`
5. Run `wrangler secret put DATABASE_URL` and paste the connection string

## 4.2 Complete Drizzle Schema

```typescript
// src/db/schema.ts
import { pgTable, text, varchar, integer, real,
         boolean, timestamp, pgEnum, json } from 'drizzle-orm/pg-core'

export const roleEnum          = pgEnum('role', ['CUSTOMER', 'ADMIN'])
export const paymentStatusEnum = pgEnum('payment_status', ['PENDING','PAID','FAILED','REFUNDED'])
export const deliveryStatusEnum = pgEnum('delivery_status', [
  'PROCESSING','PICKUP_SCHEDULED','OUT_FOR_PICKUP',
  'SHIPPED','IN_TRANSIT','OUT_FOR_DELIVERY',
  'DELIVERED','RETURN_INITIATED','RETURNED'
])

export const users = pgTable('users', {
  id:         text('id').primaryKey(),
  name:       varchar('name', { length: 100 }).notNull(),
  email:      varchar('email', { length: 255 }).notNull().unique(),
  phone:      varchar('phone', { length: 15 }).unique(),
  password:   text('password').notNull(),
  role:       roleEnum('role').default('CUSTOMER').notNull(),
  isVerified: boolean('is_verified').default(false),
  createdAt:  timestamp('created_at').defaultNow(),
  updatedAt:  timestamp('updated_at').defaultNow(),
})

export const addresses = pgTable('addresses', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').references(() => users.id).notNull(),
  fullName:  varchar('full_name', { length: 100 }).notNull(),
  phone:     varchar('phone', { length: 15 }).notNull(),
  line1:     text('line1').notNull(),
  line2:     text('line2'),
  city:      varchar('city', { length: 100 }).notNull(),
  state:     varchar('state', { length: 100 }).notNull(),
  pincode:   varchar('pincode', { length: 10 }).notNull(),
  isDefault: boolean('is_default').default(false),
})

export const products = pgTable('products', {
  id:          text('id').primaryKey(),
  name:        varchar('name', { length: 255 }).notNull(),
  slug:        varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  price:       real('price').notNull(),
  mrp:         real('mrp').notNull(),
  sku:         varchar('sku', { length: 50 }).notNull().unique(),
  category:    varchar('category', { length: 100 }).notNull(),
  badge:       varchar('badge', { length: 50 }),
  tags:        text('tags').array().default([]),
  isFeatured:  boolean('is_featured').default(false),
  isActive:    boolean('is_active').default(true),
  createdAt:   timestamp('created_at').defaultNow(),
  updatedAt:   timestamp('updated_at').defaultNow(),
})

export const productImages = pgTable('product_images', {
  id:           text('id').primaryKey(),
  productId:    text('product_id').references(() => products.id, { onDelete: 'cascade' }),
  url:          text('url').notNull(),
  publicId:     text('public_id').notNull(),
  isPrimary:    boolean('is_primary').default(false),
  displayOrder: integer('display_order').default(0),
})

export const productVariants = pgTable('product_variants', {
  id:        text('id').primaryKey(),
  productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }),
  size:      varchar('size', { length: 10 }).notNull(),
  stock:     integer('stock').default(0).notNull(),
  isActive:  boolean('is_active').default(true),
})

export const carts = pgTable('carts', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').references(() => users.id).notNull().unique(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const cartItems = pgTable('cart_items', {
  id:        text('id').primaryKey(),
  cartId:    text('cart_id').references(() => carts.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id),
  size:      varchar('size', { length: 10 }).notNull(),
  quantity:  integer('quantity').default(1).notNull(),
})

export const orders = pgTable('orders', {
  id:              text('id').primaryKey(),
  userId:          text('user_id').references(() => users.id).notNull(),
  totalAmount:     real('total_amount').notNull(),
  discountAmount:  real('discount_amount').default(0),
  finalAmount:     real('final_amount').notNull(),
  paymentStatus:   paymentStatusEnum('payment_status').default('PENDING'),
  paymentMethod:   varchar('payment_method', { length: 50 }),
  paymentGateway:  varchar('payment_gateway', { length: 50 }),  // 'phonepe' | 'razorpay' | 'cod'
  gatewayTxnId:    text('gateway_txn_id'),
  deliveryStatus:  deliveryStatusEnum('delivery_status').default('PROCESSING'),
  shipRocketId:    text('shiprocket_id'),
  awbCode:         text('awb_code'),
  courierName:     varchar('courier_name', { length: 100 }),
  labelUrl:        text('label_url'),
  trackingUrl:     text('tracking_url'),
  shippingAddress: json('shipping_address').notNull(),
  createdAt:       timestamp('created_at').defaultNow(),
  updatedAt:       timestamp('updated_at').defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id:        text('id').primaryKey(),
  orderId:   text('order_id').references(() => orders.id),
  productId: text('product_id').references(() => products.id),
  size:      varchar('size', { length: 10 }).notNull(),
  quantity:  integer('quantity').notNull(),
  price:     real('price').notNull(),
})

export const coupons = pgTable('coupons', {
  id:          text('id').primaryKey(),
  code:        varchar('code', { length: 50 }).notNull().unique(),
  type:        varchar('type', { length: 20 }).notNull(),   // 'percent' | 'flat'
  value:       real('value').notNull(),
  minOrder:    real('min_order').default(0),
  maxUses:     integer('max_uses').default(1),
  usedCount:   integer('used_count').default(0),
  expiresAt:   timestamp('expires_at'),
  isActive:    boolean('is_active').default(true),
})
```

## 4.3 DB Connection Helper

```typescript
// src/db/index.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

export function getDb(databaseUrl: string) {
  const sql = neon(databaseUrl)
  return drizzle(sql, { schema })
}
```

## 4.4 Migration Commands

```bash
# Run from local machine (never from Workers):
npx drizzle-kit generate   # generates SQL migration files
npx drizzle-kit migrate    # pushes to Neon DB

# For production deploy:
npx drizzle-kit migrate    # run before every wrangler deploy
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 5 — AUTHENTICATION SYSTEM
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 5.1 Password Hashing — Web Crypto PBKDF2

```typescript
// src/utils/crypto.ts — NO bcrypt. Workers uses Web Crypto.
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const hash = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)
  const saltHex = [...salt].map(b => b.toString(16).padStart(2,'0')).join('')
  const hashHex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('')
  return `${saltHex}:${hashHex}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, storedHash] = stored.split(':')
  const encoder = new TextEncoder()
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)))
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const hash = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)
  const hashHex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('')
  return hashHex === storedHash
}
```

## 5.2 JWT — jose Library

```typescript
// src/utils/jwt.ts
import { SignJWT, jwtVerify } from 'jose'

export async function signToken(payload: Record<string, any>, secret: string, expiresIn = '15m') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(new TextEncoder().encode(secret))
}

export async function verifyToken(token: string, secret: string) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
  return payload
}
```

## 5.3 Auth Routes

```
POST /api/auth/register   → name, email, phone, password → create user + empty cart
POST /api/auth/login      → email, password → access token (15m) + refresh token cookie (7d)
POST /api/auth/logout     → clear refresh token cookie
GET  /api/auth/me         → return current user (requires Bearer token)
POST /api/auth/refresh    → issue new access token using refresh token cookie
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 6 — PRODUCT MANAGEMENT + ADMIN UPLOAD FORM
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 6.1 The One-Form Product Upload Flow

```
Admin opens /admin/products/new
         ↓
Fills the form (name, description, price, mrp, category, badge, sizes, tags)
         ↓
Drags and drops up to 5 product images
         ↓
Clicks "Publish Product →"
         ↓
React sends multipart/form-data to POST /api/admin/products
         ↓
Cloudflare Worker receives the request
         ↓
All images uploaded to Cloudinary via HTTP REST API
         ↓
Cloudinary returns secure_url + public_id for each image
         ↓
Product + images + variants saved to Neon PostgreSQL
         ↓
Cloudflare KV cache for featured products is invalidated
         ↓
Frontend's React Query auto-refetches after 60 seconds
         ↓
NEW PRODUCT IS LIVE ON THE HOMEPAGE ✓
```

## 6.2 Admin Product Form Fields

```
┌─────────────────────────────────────────────────────────┐
│  ADD NEW PRODUCT                                        │
├─────────────────────────────────────────────────────────┤
│  SECTION A — Basic Info                                 │
│  Product Name     [________________________]            │
│  Description      [________________________]            │
│                   [________________________]            │
│  Category         [Hoodies ▼]                           │
│  Badge            [Best Seller ▼] or None               │
│  Featured?        [Toggle ON/OFF] → shows on homepage   │
├─────────────────────────────────────────────────────────┤
│  SECTION B — Pricing                                    │
│  Selling Price ₹  [______]                              │
│  MRP ₹            [______]                              │
│  Discount         Auto-calculated and shown in preview  │
├─────────────────────────────────────────────────────────┤
│  SECTION C — Sizes & Stock                              │
│  XS [__]  S [__]  M [__]  L [__]  XL [__]  XXL [__]   │
├─────────────────────────────────────────────────────────┤
│  SECTION D — Tags (multi-select chips)                  │
│  [new-arrival] [best-seller] [trending] [sale]          │
│  [limited] [featured]                                   │
├─────────────────────────────────────────────────────────┤
│  SECTION E — Product Images                             │
│  ┌─────────────────────────────────────────────┐        │
│  │  Drag & drop images here (max 5)            │        │
│  │  .jpg .png .webp supported                  │        │
│  └─────────────────────────────────────────────┘        │
│  [img1 PRIMARY] [img2] [img3] [img4] [img5]             │
│   First image = main display image                      │
├─────────────────────────────────────────────────────────┤
│              [ Publish Product → ]                      │
└─────────────────────────────────────────────────────────┘
```

## 6.3 Product API Routes

```
GET    /api/products                → All active products (filters: category, featured, page, limit, sort)
GET    /api/products/:slug          → Single product detail
POST   /api/admin/products          → Create product (Admin only, multipart)
PUT    /api/admin/products/:id      → Update product (Admin only)
DELETE /api/admin/products/:id      → Soft delete — sets isActive=false (Admin only)
PATCH  /api/admin/products/:id/badge     → Update badge only
PATCH  /api/admin/products/:id/featured  → Toggle homepage visibility
```

## 6.4 Cloudinary Image Upload — HTTP REST (No SDK)

```typescript
// src/services/cloudinary.ts
async function sha1(data: string, secret: string): Promise<string> {
  const msg = new TextEncoder().encode(data + secret)
  const hash = await crypto.subtle.digest('SHA-1', msg)
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,'0')).join('')
}

export async function uploadImage(buffer: ArrayBuffer, filename: string, env: Env) {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const folder = 'dripkart/products'
  const params = `folder=${folder}&timestamp=${timestamp}`
  const signature = await sha1(params, env.CLOUDINARY_API_SECRET)

  const form = new FormData()
  form.append('file', new Blob([buffer]), filename)
  form.append('api_key', env.CLOUDINARY_API_KEY)
  form.append('timestamp', timestamp)
  form.append('folder', folder)
  form.append('signature', signature)
  form.append('transformation', 'w_1200,h_1600,c_fill,q_auto,f_auto')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: form }
  )
  const data = await res.json() as any
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed')
  return { url: data.secure_url, publicId: data.public_id }
}
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 7 — PAYMENT GATEWAYS (ALL OPTIONS)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DRIPkaRt supports TWO payment gateways — PhonePe as primary, Razorpay as fallback. COD also supported.

## 7.1 Gateway Comparison

| Feature | PhonePe PG | Razorpay | Cashfree | Paytm PG | COD |
|---|---|---|---|---|---|
| UPI | ✅ All UPI apps | ✅ All UPI apps | ✅ All UPI apps | ✅ All UPI apps | ❌ |
| Cards | ✅ Debit + Credit | ✅ Debit + Credit | ✅ Debit + Credit | ✅ Debit + Credit | ❌ |
| Net Banking | ✅ | ✅ | ✅ | ✅ | ❌ |
| EMI | ✅ | ✅ | ✅ | ✅ | ❌ |
| Wallets | ✅ PhonePe | ✅ Multiple | ✅ Multiple | ✅ Paytm | ❌ |
| MDR Rate | ~1.99% | ~2% | ~1.75% | ~1.99% | 0% |
| Settlement | T+1 | T+1 | T+1 | T+1 | T+2 |
| Setup | Business + GST | Business + GST | Business + GST | Business + GST | None |
| Dashboard | ✅ | ✅ Best in class | ✅ | ✅ | N/A |
| **Used for DRIPkaRt** | ✅ **PRIMARY** | ✅ **FALLBACK** | ❌ | ❌ | ✅ |

## 7.2 PhonePe Integration (Primary Gateway)

**How to Get Access:**
1. Go to → **phonepe.com/business** → Apply for Payment Gateway
2. Submit: GST certificate, cancelled cheque, PAN, address proof
3. Approval takes 2–3 business days
4. Get: Merchant ID, Salt Key, Salt Index

**Integration Flow:**
```
Customer clicks "Pay Now"
    ↓
POST /api/payments/phonepe/initiate { orderId, amount, mobile }
    ↓
Worker creates base64 payload + SHA256 checksum
    ↓
Calls PhonePe API → gets redirectUrl
    ↓
Returns redirectUrl to frontend
    ↓
Frontend window.location = redirectUrl (PhonePe checkout page)
    ↓
Customer pays (UPI / Card / Wallet / Net Banking)
    ↓
PhonePe sends POST to /api/payments/phonepe/callback
    ↓
Worker verifies SHA256 signature (NEVER skip this)
    ↓
If SUCCESS → mark order PAID → trigger ShipRocket
    ↓
Frontend redirected to /orders/success?orderId=xxx
```

**Checksum — Web Crypto version (Workers compatible):**
```typescript
// src/services/phonepe.ts
async function sha256Hex(data: string): Promise<string> {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data))
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2,'0')).join('')
}

export async function initiatePayment(orderId: string, amount: number, mobile: string, env: Env) {
  const payload = {
    merchantId: env.PHONEPE_MERCHANT_ID,
    merchantTransactionId: orderId,
    amount: Math.round(amount * 100), // paise
    redirectUrl: `${env.FRONTEND_URL}/orders/success?orderId=${orderId}`,
    redirectMode: 'REDIRECT',
    callbackUrl: `https://dripkart-api.workers.dev/api/payments/phonepe/callback`,
    mobileNumber: mobile,
    paymentInstrument: { type: 'PAY_PAGE' }
  }

  const base64 = btoa(JSON.stringify(payload))
  const checksum = await sha256Hex(base64 + '/pg/v1/pay' + env.PHONEPE_SALT_KEY)
    + '###' + env.PHONEPE_SALT_INDEX

  const res = await fetch('https://api.phonepe.com/apis/hermes/pg/v1/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum },
    body: JSON.stringify({ request: base64 })
  })

  const data = await res.json() as any
  return data.data.instrumentResponse.redirectInfo.url
}

export async function verifyCallback(base64Response: string, receivedChecksum: string, env: Env) {
  const expected = await sha256Hex(base64Response + env.PHONEPE_SALT_KEY)
    + '###' + env.PHONEPE_SALT_INDEX
  return expected === receivedChecksum  // ALWAYS verify before marking PAID
}
```

## 7.3 Razorpay Integration (Fallback Gateway)

**How to Get Access:**
1. Go to → **razorpay.com** → Sign Up for Business
2. Complete KYC: GST, PAN, bank account
3. Approval: 1–2 business days
4. Get: Key ID and Key Secret from Dashboard

**Integration Flow (different from PhonePe — uses client-side SDK):**
```
Customer clicks "Pay with Razorpay"
    ↓
POST /api/payments/razorpay/create-order { amount, orderId }
    ↓
Worker calls Razorpay API → gets razorpay_order_id
    ↓
Returns { razorpay_order_id, key_id, amount } to frontend
    ↓
Frontend loads Razorpay checkout SDK:
  new Razorpay({ key, amount, order_id, ... }).open()
    ↓
Customer pays in Razorpay modal
    ↓
Razorpay gives frontend: razorpay_payment_id, razorpay_signature
    ↓
Frontend sends POST /api/payments/razorpay/verify { payment_id, order_id, signature }
    ↓
Worker verifies HMAC-SHA256 signature
    ↓
If valid → mark order PAID → trigger ShipRocket
```

**Signature Verification — Web Crypto:**
```typescript
// src/services/razorpay.ts
export async function createRazorpayOrder(amount: number, receiptId: string, env: Env) {
  const credentials = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: Math.round(amount * 100), currency: 'INR', receipt: receiptId })
  })
  return await res.json()
}

export async function verifyRazorpaySignature(
  orderId: string, paymentId: string, signature: string, env: Env
): Promise<boolean> {
  const message = `${orderId}|${paymentId}`
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(env.RAZORPAY_KEY_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  const expected = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2,'0')).join('')
  return expected === signature
}
```

## 7.4 COD (Cash on Delivery)

```typescript
// POST /api/orders/cod — No payment gateway needed
// Flow:
// 1. Customer selects COD at checkout
// 2. Order created with paymentStatus='PENDING', paymentGateway='cod'
// 3. ShipRocket order created immediately with payment_method='COD'
// 4. On delivery → courier collects cash → marks delivered
// 5. ShipRocket webhook → update order to DELIVERED

// COD limits:
// - Only available for orders under ₹5,000 (configurable)
// - Not available for all pincodes (check ShipRocket serviceability)
```

## 7.5 Payment Routes Summary

```
POST /api/payments/phonepe/initiate     → Start PhonePe (primary)
POST /api/payments/phonepe/callback     → PhonePe webhook (POST from PhonePe)
GET  /api/payments/phonepe/status/:id   → Check PhonePe payment status

POST /api/payments/razorpay/create      → Create Razorpay order
POST /api/payments/razorpay/verify      → Verify signature after payment

POST /api/orders/cod                    → Place COD order directly

GET  /api/payments/status/:orderId      → Universal status check (any gateway)
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 8 — DELIVERY PARTNER (SHIPROCKET)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 8.1 Why ShipRocket

ShipRocket is a courier aggregator. One API → access to all major Indian couriers.

| Courier | Coverage | Speed |
|---|---|---|
| Delhivery | Pan India | Standard |
| Ekart (Flipkart) | Pan India | Standard |
| Xpressbees | Pan India | Standard |
| BlueDart | Metro + Tier 1 | Premium / Fast |
| DTDC | Pan India | Standard |
| Shadowfax | Metro cities | Same-day |
| Ecom Express | Pan India | Standard |

ShipRocket automatically picks the cheapest/fastest available courier for each pincode.

## 8.2 ShipRocket Setup

1. Go to → **shiprocket.in** → Create account
2. Go to Settings → Pickup Locations → Add warehouse address
3. Name it exactly: "DRIPkaRt Warehouse"
4. Go to Settings → API → Generate token (email + password used for API auth)
5. Go to Settings → Webhooks → Add URL: `https://dripkart-api.workers.dev/api/shipping/webhook`

## 8.3 ShipRocket Token (Auto-refresh)

ShipRocket tokens expire every 24 hours. Store and refresh in Cloudflare KV:

```typescript
// src/services/shiprocket.ts
async function getToken(env: Env): Promise<string> {
  const cached = await env.CACHE.get('shiprocket:token')
  if (cached) return cached

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: env.SHIPROCKET_EMAIL, password: env.SHIPROCKET_PASSWORD })
  })
  const data = await res.json() as any
  const token = data.token

  // Cache for 23 hours (expires every 24h)
  await env.CACHE.put('shiprocket:token', token, { expirationTtl: 82800 })
  return token
}
```

## 8.4 Full ShipRocket Flow

```typescript
// STEP 1: Check pincode serviceability (before order placed)
// GET /api/shipping/check?from=400001&to=560001&weight=0.5
export async function checkServiceability(from: string, to: string, weight: number, env: Env) {
  const token = await getToken(env)
  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${from}&delivery_postcode=${to}&weight=${weight}&cod=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.json()
}

// STEP 2: Create ShipRocket order (auto-called after payment confirmed)
export async function createOrder(orderData: any, env: Env) {
  const token = await getToken(env)
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      order_id: orderData.id,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: 'DRIPkaRt Warehouse',
      billing_customer_name: orderData.customer.name,
      billing_phone: orderData.customer.phone,
      billing_email: orderData.customer.email,
      billing_address: orderData.address.line1,
      billing_city: orderData.address.city,
      billing_state: orderData.address.state,
      billing_pincode: orderData.address.pincode,
      billing_country: 'India',
      shipping_is_billing: true,
      order_items: orderData.items.map((item: any) => ({
        name: item.productName,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: orderData.isCOD ? 'COD' : 'Prepaid',
      sub_total: orderData.finalAmount,
      length: 30, breadth: 25, height: 10,   // package dimensions cm
      weight: 0.5                             // kg per item approx
    })
  })
  return res.json()
}

// STEP 3: Auto-assign best courier
export async function assignCourier(shipmentId: string, env: Env) {
  const token = await getToken(env)
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/courier/assign/awb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ shipment_id: shipmentId })
  })
  return res.json()
}

// STEP 4: Generate shipping label PDF
export async function generateLabel(shipmentId: string, env: Env) {
  const token = await getToken(env)
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/courier/generate/label', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ shipment_id: [shipmentId] })
  })
  const data = await res.json() as any
  return data.label_url   // PDF URL to print and stick on package
}

// STEP 5: Track order by AWB code
export async function trackOrder(awbCode: string, env: Env) {
  const token = await getToken(env)
  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.json()
}
```

## 8.5 ShipRocket Webhook — Auto Status Updates

```typescript
// POST /api/shipping/webhook
// Register this URL in ShipRocket dashboard
// ShipRocket calls this automatically whenever courier updates status

app.post('/webhook', async (c) => {
  const db = getDb(c.env.DATABASE_URL)
  const { awb, current_status, order_id } = await c.req.json()

  const statusMap: Record<string, string> = {
    'Pickup Scheduled':  'PICKUP_SCHEDULED',
    'Out For Pickup':    'OUT_FOR_PICKUP',
    'Picked Up':         'SHIPPED',
    'In Transit':        'IN_TRANSIT',
    'Out For Delivery':  'OUT_FOR_DELIVERY',
    'Delivered':         'DELIVERED',
    'RTO Initiated':     'RETURN_INITIATED',
    'RTO Delivered':     'RETURNED',
  }

  await db.update(orders)
    .set({ deliveryStatus: statusMap[current_status] as any, updatedAt: new Date() })
    .where(eq(orders.id, order_id))

  return c.json({ success: true })
})
```

## 8.6 Delivery Routes Summary

```
POST /api/shipping/check          → Check pincode serviceability + COD availability
GET  /api/shipping/track/:awbCode → Live tracking data for customer
POST /api/shipping/webhook        → ShipRocket status updates (internal)
GET  /api/shipping/label/:orderId → Get label PDF URL (Admin only)
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 9 — CART & ORDER FLOW
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 9.1 Cart Routes

```
GET    /api/cart              → Get cart with product details
POST   /api/cart/add          → { productId, size, quantity }
PUT    /api/cart/update       → { cartItemId, quantity }
DELETE /api/cart/remove/:id   → Remove one item
DELETE /api/cart/clear        → Empty cart (called after order placed)
```

## 9.2 Complete Order Creation Flow

```
POST /api/orders/create
Body: { addressId, items: [{productId, size, qty}], couponCode?, paymentMethod }

Step 1: Validate all items exist and are in stock
Step 2: Calculate amounts (subtotal, discount, final)
Step 3: Verify coupon if provided (check coupons table)
Step 4: Create order in DB with status PENDING
Step 5: Return { orderId, finalAmount } to frontend
Step 6: Frontend initiates payment with orderId
Step 7: (After payment confirmed via callback/webhook):
Step 8: Deduct stock from product_variants (atomic)
Step 9: Clear user's cart
Step 10: Create ShipRocket order
Step 11: Auto-assign courier
Step 12: Send order confirmation email to customer
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 10 — CLOUDFLARE KV CACHING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KV replaces Redis. Access via `c.env.CACHE` (bound in wrangler.toml).

| Cache Key | Content | TTL |
|---|---|---|
| `products:featured` | Featured products JSON | 5 min |
| `product:{slug}` | Single product JSON | 10 min |
| `products:category:{name}` | Category products | 5 min |
| `pincode:{from}:{to}` | Serviceability result | 24 hours |
| `shiprocket:token` | Auth token | 23 hours |

```typescript
// Write to KV
await c.env.CACHE.put('products:featured', JSON.stringify(data), { expirationTtl: 300 })

// Read from KV
const raw = await c.env.CACHE.get('products:featured')
const data = raw ? JSON.parse(raw) : null

// Delete (invalidate) on update
await c.env.CACHE.delete('products:featured')
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 11 — ADMIN DASHBOARD PAGES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Admin Pages to Build

```
/admin                 → Redirect to /admin/dashboard
/admin/login           → Admin login (separate from customer login)
/admin/dashboard       → Stats: total revenue, orders today, products, low stock alerts
/admin/products        → Table of all products with edit/delete/toggle featured
/admin/products/new    → Add product form (the one form described in Part 6)
/admin/products/:id    → Edit product form (same form, prefilled)
/admin/orders          → All orders table with filters (status, date, amount)
/admin/orders/:id      → Order detail: items, customer, payment info, delivery status
                         + Button to manually update delivery status
```

## Admin Protected Route (React)

```typescript
// All /admin/* routes require:
// 1. Valid JWT token in localStorage
// 2. User role === 'ADMIN'
// If not → redirect to /admin/login

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore()
  if (!token || user?.role !== 'ADMIN') return <Navigate to="/admin/login" />
  return <>{children}</>
}
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 12 — COMPLETE API REFERENCE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
AUTH
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh

PRODUCTS (Public — no auth)
GET    /api/products               ?featured=true&category=Hoodies&page=1&limit=12&sort=price
GET    /api/products/:slug

ADMIN (Auth + Admin role required)
GET    /api/admin/products
POST   /api/admin/products         ← multipart/form-data product upload form
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
PATCH  /api/admin/products/:id/badge
PATCH  /api/admin/products/:id/featured
GET    /api/admin/orders
GET    /api/admin/orders/:id
PUT    /api/admin/orders/:id/status
GET    /api/admin/dashboard/stats

CART (Auth required)
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update
DELETE /api/cart/remove/:itemId
DELETE /api/cart/clear

ORDERS (Auth required)
POST   /api/orders/create
POST   /api/orders/cod
GET    /api/orders
GET    /api/orders/:id

PAYMENTS
POST   /api/payments/phonepe/initiate
POST   /api/payments/phonepe/callback     ← PhonePe calls this (no auth)
GET    /api/payments/phonepe/status/:id
POST   /api/payments/razorpay/create
POST   /api/payments/razorpay/verify
GET    /api/payments/status/:orderId

SHIPPING
POST   /api/shipping/check
GET    /api/shipping/track/:awbCode
POST   /api/shipping/webhook              ← ShipRocket calls this (no auth)
GET    /api/shipping/label/:orderId       ← Admin only

COUPONS (Public verify, Admin manage)
POST   /api/coupons/verify               → { code, cartTotal }
POST   /api/admin/coupons               → Create coupon
DELETE /api/admin/coupons/:id           → Delete coupon
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 13 — DEPLOYMENT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 13.1 Infrastructure at a Glance

| Service | Platform | Cost |
|---|---|---|
| Frontend | Vercel | **Free** |
| Backend API | Cloudflare Workers | **Free** (100k req/day) / $5/mo paid |
| Database | Neon PostgreSQL | **Free** (0.5GB storage) |
| Cache | Cloudflare KV | **Free** (1GB) |
| Image Storage | Cloudinary | **Free** (25GB) |
| Domain | Namecheap / GoDaddy | ~₹800/year |
| **TOTAL** | | **₹0 to start** |

## 13.2 Step-by-Step Deploy Order

```
Step 1: Set up Neon DB → run migrations
Step 2: Create Cloudflare KV namespace → get ID
Step 3: Add KV ID to wrangler.toml
Step 4: Run all wrangler secret put commands
Step 5: Deploy backend → npx wrangler deploy
Step 6: Test /health endpoint → should return { status: 'ok' }
Step 7: Add VITE_API_URL in frontend .env
Step 8: Deploy frontend → vercel --prod
Step 9: Set VITE_API_URL in Vercel dashboard
Step 10: Add custom domain (api.dripkart.in → Worker, dripkart.in → Vercel)
Step 11: Register PhonePe callback URL with PhonePe merchant dashboard
Step 12: Register ShipRocket webhook URL in ShipRocket settings
Step 13: Create first admin user directly in Neon (SQL: UPDATE users SET role='ADMIN')
Step 14: Login to /admin, upload first product, verify it shows on homepage
Step 15: Do a full test order end-to-end (sandbox mode first)
Step 16: Switch PhonePe to production credentials
Step 17: LIVE ✓
```

## 13.3 Go-Live Final Checklist

```
□ Neon DB migrated (npx drizzle-kit migrate)
□ All wrangler secrets set (14 secrets)
□ KV namespace created and ID in wrangler.toml
□ Worker deployed and healthy at /health
□ CORS origin set to exact Vercel URL
□ Frontend deployed and hitting correct Worker URL
□ Admin account exists in DB with role='ADMIN'
□ First product uploaded via admin form and visible on homepage
□ PhonePe sandbox test passed (full order flow)
□ PhonePe production credentials active
□ PhonePe callback URL: https://dripkart-api.workers.dev/api/payments/phonepe/callback
□ Razorpay key ID and secret in wrangler secrets
□ ShipRocket warehouse address set up
□ ShipRocket webhook URL registered
□ COD order test completed
□ Tracking page working with AWB code
□ Cloudinary images loading fast
□ Mobile responsive verified (iPhone + Android)
□ Admin product form tested (upload images → live on site)
```

---

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART 14 — 20 HARD RULES FOR ANTIGRAVITY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

```
1.  NEVER use process.env → always c.env.VARIABLE_NAME
2.  NEVER import from 'node:crypto' → use global crypto.subtle
3.  NEVER use Prisma → use Drizzle + @neondatabase/serverless
4.  NEVER use bcrypt → use PBKDF2 via crypto.subtle (see Part 5.1)
5.  NEVER use jsonwebtoken → use jose
6.  NEVER use Redis/ioredis → use c.env.CACHE (Cloudflare KV)
7.  NEVER use axios in backend → use native fetch()
8.  NEVER use Fastify or Express → use Hono
9.  ALWAYS export default app at end of index.ts (Workers requirement)
10. ALWAYS call getDb(c.env.DATABASE_URL) inside route handlers (not globally)
11. ALWAYS set expirationTtl when writing to KV
12. ALWAYS verify PhonePe signature before marking order PAID (security critical)
13. ALWAYS verify Razorpay HMAC-SHA256 signature before marking order PAID
14. ALWAYS use Drizzle transactions for stock deduction (prevent overselling)
15. ALWAYS store Cloudinary public_id to enable image deletion later
16. ALWAYS invalidate KV cache when admin updates products
17. ALWAYS validate request body with Zod before touching the database
18. NEVER allow access to /api/admin/* without requireAdmin middleware
19. Product slug must be unique — append "-2", "-3" if slug already exists in DB
20. Stock must be checked AND decremented atomically in same DB transaction
```

---

*END OF DRIPKART MASTER PROMPT*
*Stack Summary: Vite + React (Vercel) | Hono + TypeScript (Cloudflare Workers) | Neon PostgreSQL | Cloudflare KV | Cloudinary | PhonePe + Razorpay + COD | ShipRocket*
