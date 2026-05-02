import { Hono } from 'hono'
import { getDb } from '../db'
import { orders, carts, cartItems } from '../db/schema'
import { eq, ne, and } from 'drizzle-orm'
import { verifyCallback } from '../services/phonepe'
import { sendOrderConfirmedEmail } from '../services/email'
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
    
    // Update Order Status only if it's not already PAID
    const updatedOrder = await db.update(orders)
      .set({ paymentStatus: 'PAID', gatewayTxnId: transactionId, updatedAt: new Date() })
      .where(and(
        eq(orders.id, orderId),
        ne(orders.paymentStatus, 'PAID')
      ))
      .returning({ userId: orders.userId, shippingAddress: orders.shippingAddress, finalAmount: orders.finalAmount })

    // Clear User Cart after successful payment
    if (updatedOrder.length > 0) {
      try {
        const orderData = updatedOrder[0]
        const userId = orderData.userId
        
        // Send Order Confirmed Email
        const email = (orderData.shippingAddress as any)?.email
        if (email) {
          c.executionCtx.waitUntil(
            sendOrderConfirmedEmail(
              email, 
              { id: orderId, finalAmount: orderData.finalAmount, shippingAddress: orderData.shippingAddress }, 
              c.env
            ).catch(e => console.error('Failed to send confirmed email:', e))
          )
        }

        const cartRes = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1)
        if (cartRes.length > 0) {
          await db.delete(cartItems).where(eq(cartItems.cartId, cartRes[0].id))
        }
      } catch (cartErr: any) {
        console.error('Failed to clear cart during callback:', cartErr.message)
      }
    }

    // Shipping is now triggered manually by admin from the dashboard
    // Order sits at deliveryStatus: PROCESSING until admin confirms
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
