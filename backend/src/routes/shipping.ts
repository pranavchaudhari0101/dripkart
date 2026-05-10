import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { getDb } from '../db'
import { orders } from '../db/schema'
import { eq } from 'drizzle-orm'
import { checkServiceability, trackOrder, generateLabel } from '../services/shiprocket'
import { adminOnlyMiddleware } from '../middleware/auth'
import { shippingCheckSchema } from '../lib/validators'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env }>()

router.post('/check', zValidator('json', shippingCheckSchema), async (c) => {
  const { from, to, weight = 0.5 } = c.req.valid('json')
  const data = await checkServiceability(from, to, weight, c.env)
  return c.json(data)
})

router.get('/track/:awb', async (c) => {
  const awb = c.req.param('awb')
  const data = await trackOrder(awb, c.env)
  return c.json(data)
})

router.post('/webhook', async (c) => {
  // Verify webhook secret to prevent spoofed status updates
  const secret = c.req.header('X-Webhook-Secret')
  if (!secret || secret !== c.env.SHIPPING_WEBHOOK_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const { awb, current_status, order_id } = await c.req.json()
  const db = getDb(c.env.DATABASE_URL)

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

  const newStatus = statusMap[current_status] 
  if (newStatus) {
    await db.update(orders)
      .set({ deliveryStatus: newStatus as any, updatedAt: new Date() })
      .where(eq(orders.id, order_id))
  }

  return c.json({ success: true })
})

router.get('/label/:orderId', adminOnlyMiddleware, async (c) => {
  const orderId = c.req.param('orderId')
  const db = getDb(c.env.DATABASE_URL)
  
  const orderRes = await db.select({ awb: orders.awbCode }).from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!orderRes.length || !orderRes[0].awb) return c.json({ error: 'AWB not found' }, 404)

  const url = await generateLabel(orderRes[0].awb, c.env)
  return c.json({ labelUrl: url })
})

export default router
