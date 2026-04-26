import { Hono } from 'hono'
import { getDb } from '../db'
import { orders, orderItems, products, productVariants, cartItems, carts } from '../db/schema'
import { eq, and, sql, gte } from 'drizzle-orm'
import { authMiddleware } from '../middleware/auth'
import { initiatePayment } from '../services/phonepe'

import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env; Variables: { user: any } }>()
router.use('/*', authMiddleware)

router.post('/create', async (c) => {
  const user = c.get('user')
  const { address, items, paymentMethod } = await c.req.json()
  const db = getDb(c.env.DATABASE_URL)

  const uuid = crypto.randomUUID().replace(/-/g, '')
  const orderId = `ord_${uuid.substring(0, 28)}` // Max 32 chars total to safely fit PhonePe's 34 char limit

  try {
    let totalAmount = 0
    const orderItemsToInsert = []

    // 1. Verify items and stock
    for (const item of items) {
      const productRes = await db.select().from(products)
        .where(eq(products.id, item.productId)).limit(1)
      const product = productRes[0]

      const variantRes = await db.select().from(productVariants)
        .where(and(eq(productVariants.productId, item.productId), eq(productVariants.size, item.size)))
        .limit(1)
      const variant = variantRes[0]

      if (!product || !variant) throw new Error(`Product or variant not found for ${item.productId}`)
      if (variant.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name} (Size: ${item.size})`)

      totalAmount += product.price * item.quantity
      orderItemsToInsert.push({
        id: `oi_${crypto.randomUUID()}`,
        orderId,
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        price: product.price,
        variantId: variant.id
      })
    }

    const isCod = paymentMethod === 'COD'

    // 2. Create Order
    await db.insert(orders).values({
      id: orderId,
      userId: user.id,
      totalAmount,
      finalAmount: totalAmount,
      paymentStatus: 'PENDING',
      paymentGateway: isCod ? 'cod' : 'phonepe',
      shippingAddress: address
    })

    // 3. Insert Items and Update Stock
    for (const item of orderItemsToInsert) {
      const { variantId, ...values } = item
      await db.insert(orderItems).values(values)
      
      const updateRes = await db.update(productVariants)
        .set({ stock: sql`${productVariants.stock} - ${item.quantity}` })
        .where(and(
          eq(productVariants.id, variantId),
          gte(productVariants.stock, item.quantity) // Safety condition
        ))
        .returning({ id: productVariants.id })
      
      if (updateRes.length === 0) {
        throw new Error(`Insufficient stock for variant ${variantId} during final update`)
      }
    }



    // 4. Initiate Payment (shipping is now triggered manually by admin)
    if (isCod) {
      // COD: order sits at PROCESSING until admin confirms shipping
      return c.json({ success: true, orderId, paymentUrl: null })
    }

    const paymentUrl = await initiatePayment(orderId, totalAmount, address.phone, c.env)
    return c.json({ success: true, orderId, paymentUrl })

  } catch (err: any) {
    console.error('Order Creation Error:', err.message, err.stack)
    return c.json({ error: `Order creation failed: ${err.message}` }, 500)
  }
})

// Get user's orders
router.get('/', async (c) => {
  const user = c.get('user')
  const db = getDb(c.env.DATABASE_URL)
  const userOrders = await db.select().from(orders).where(eq(orders.userId, user.id))
  return c.json(userOrders)
})

// GET /orders/:id/track — Public tracking endpoint (authenticated, user can only see own orders)
router.get('/:id/track', async (c) => {
  const user = c.get('user')
  const orderId = c.req.param('id')
  const db = getDb(c.env.DATABASE_URL)

  const orderRes = await db.select({
    id: orders.id,
    paymentStatus: orders.paymentStatus,
    paymentGateway: orders.paymentGateway,
    deliveryStatus: orders.deliveryStatus,
    awbCode: orders.awbCode,
    courierName: orders.courierName,
    trackingUrl: orders.trackingUrl,
    createdAt: orders.createdAt,
    updatedAt: orders.updatedAt,
  })
  .from(orders)
  .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
  .limit(1)

  if (!orderRes.length) return c.json({ error: 'Order not found' }, 404)
  return c.json(orderRes[0])
})

export default router
