import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './types/env'

import authRoutes from './routes/auth'
import productRoutes from './routes/products'
import cartRoutes from './routes/cart'
import orderRoutes from './routes/orders'
import paymentRoutes from './routes/payments'
import shippingRoutes from './routes/shipping'
import adminRoutes from './routes/admin'

const app = new Hono<{ Bindings: Env }>()

// Global Middleware
app.use('/*', async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.FRONTEND_URL || 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
  return corsMiddleware(c, next)
})

// Healthcheck
app.get('/health', (c) => c.json({ status: 'ok', time: new Date().toISOString() }))

// Routes
app.route('/api/auth', authRoutes)
app.route('/api/products', productRoutes)
app.route('/api/admin', adminRoutes)
app.route('/api/cart', cartRoutes)
app.route('/api/orders', orderRoutes)
app.route('/api/payments', paymentRoutes)
app.route('/api/shipping', shippingRoutes)

// Expose router to Cloudflare
app.onError((err, c) => {
  console.error(`[GLOBAL ERROR] ${c.req.method} ${c.req.url}`, err)
  return c.text(`Internal Server Error: ${err.message}`, 500)
})

export default app
