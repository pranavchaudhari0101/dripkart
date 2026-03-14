import { Hono } from 'hono'
import { getDb } from '../db'
import { orders } from '../db/schema'
import { eq } from 'drizzle-orm'
import { verifyCallback } from '../services/phonepe'
import { processShiprocketOrder } from '../utils/shiprocketHelper'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env }>()

// S2S Webhook callback from PhonePe
router.post('/phonepe/callback', async (c) => {
  const { response } = await c.req.json()
  const signature = c.req.header('X-VERIFY')
  if (!signature) return c.json({ error: 'Missing signature' }, 400)

  const isValid = await verifyCallback(response, signature, c.env)
  if (!isValid) return c.json({ error: 'Invalid signature' }, 403)

  // decode base64
  const payload = JSON.parse(atob(response))
  if (payload.success) {
    const orderId = payload.data.merchantTransactionId
    const transactionId = payload.data.transactionId
    
    const db = getDb(c.env.DATABASE_URL)
    await db.update(orders)
      .set({ paymentStatus: 'PAID', gatewayTxnId: transactionId, updatedAt: new Date() })
      .where(eq(orders.id, orderId))

    // Trigger Shiprocket
    try {
      await processShiprocketOrder(orderId, c.env)
    } catch (err: any) {
      console.error('Shiprocket Trigger Error:', err.message)
      // We don't fail the webhook if shipping fails, but we should log it
    }
  }
  
  return c.json({ success: true })
})

// Status polling for frontend redirect page
router.get('/status/:orderId', async (c) => {
  const orderId = c.req.param('orderId')
  const db = getDb(c.env.DATABASE_URL)
  
  const orderRes = await db.select({ status: orders.paymentStatus })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!orderRes.length) return c.json({ error: 'Order not found' }, 404)
  return c.json({ status: orderRes[0].status })
})

export default router
