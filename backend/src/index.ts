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
  const allowedOrigins = [
    c.env.FRONTEND_URL,
    'https://dripkarts.vercel.app',
    'https://dripkart-delta.vercel.app',
  ].filter(Boolean);

  const corsHandler = cors({
    origin: (origin) => {
      if (!origin) return allowedOrigins[0] || 'http://localhost:5173';
      if (allowedOrigins.includes(origin)) return origin;
      // Strict development check
      if (origin === 'http://localhost:5173' || origin === 'http://127.0.0.1:5173') return origin;
      return null;
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
  console.error(`[GLOBAL ERROR] ${c.req.method} ${c.req.url}`, err.message)
  const isDev = c.env.NODE_ENV === 'development'
  return c.json({
    error: 'Internal Server Error',
    message: isDev ? err.message : 'An unexpected error occurred',
    ...(isDev && err.stack ? { stack: err.stack } : {}),
  }, 500)
})

export default app
