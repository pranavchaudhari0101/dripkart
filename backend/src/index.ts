import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env } from './types/env'
import { rateLimitMiddleware } from './middleware/rateLimit'

import authRoutes from './routes/auth'
import productRoutes from './routes/products'
import cartRoutes from './routes/cart'
import orderRoutes from './routes/orders'
import paymentRoutes from './routes/payments'
import shippingRoutes from './routes/shipping'
import adminRoutes from './routes/admin'

const app = new Hono<{ Bindings: Env }>()

// Global Middleware
app.use('*', async (c, next) => {
  const corsHandler = cors({
    origin: (origin) => {
      // Allow the configured frontend URL
      if (origin === c.env.FRONTEND_URL) return origin;
      // Allow known Vercel deployment URLs
      if (origin === 'https://dripkarts.vercel.app') return origin;
      if (origin === 'https://dripkart-delta.vercel.app') return origin;
      // Default fallback for development
      return origin?.includes('localhost') || origin?.includes('127.0.0.1') ? origin : c.env.FRONTEND_URL || 'http://localhost:5173';
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
  return corsHandler(c, next)
})

// Rate Limiting — applied per route group
// Public routes: 60 requests per minute
app.use('/api/products/*', rateLimitMiddleware({ maxRequests: 60, windowSeconds: 60 }))
// Auth routes: 30 requests per minute
app.use('/api/auth/*', rateLimitMiddleware({ maxRequests: 30, windowSeconds: 60 }))
// Order creation: 10 requests per minute (prevent spam)
app.use('/api/orders/*', rateLimitMiddleware({ maxRequests: 10, windowSeconds: 60 }))
// Payment routes: 15 requests per minute
app.use('/api/payments/*', rateLimitMiddleware({ maxRequests: 15, windowSeconds: 60 }))
// Admin routes: 30 requests per minute
app.use('/api/admin/*', rateLimitMiddleware({ maxRequests: 30, windowSeconds: 60 }))
// Cart routes: 40 requests per minute
app.use('/api/cart/*', rateLimitMiddleware({ maxRequests: 40, windowSeconds: 60 }))

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
  return c.json({ 
    error: 'Internal Server Error', 
    message: err.message,
    stack: c.env.NODE_ENV === 'development' ? err.stack : undefined
  }, 500)
})

export default app
