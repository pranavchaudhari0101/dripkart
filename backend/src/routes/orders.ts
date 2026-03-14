import { Hono } from 'hono'
import { getDb } from '../db'
import { orders, orderItems, products, productVariants, cartItems, carts } from '../db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { authMiddleware } from '../middleware/auth'
import { initiatePayment } from '../services/phonepe'
import { processShiprocketOrder } from '../utils/shiprocketHelper'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env; Variables: { user: any } }>()
router.use('/*', authMiddleware)

router.post('/create', async (c) => {
  const user = c.get('user')
  const { address, items, paymentMethod } = await c.req.json()
  const db = getDb(c.env.DATABASE_URL)

  const uuid = crypto.randomUUID().replace(/-/g, '')
  const orderId = `ord_${uuid}`

  try {
    let totalAmount = 0
    const orderItemValues = []

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
      orderItemValues.push({
        id: `oi_${crypto.randomUUID()}`,
        orderId,
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        price: product.price,
        variantId: variant.id // Store for update
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

    // 3. Insert Items and Update Stock Sequentially (Since transactions are buggy here)
    for (const oi of orderItemValues) {
      const { variantId, ...values } = oi as any
      await db.insert(orderItems).values(values)
      await db.update(productVariants)
        .set({ stock: sql`${productVariants.stock} - ${oi.quantity}` })
        .where(eq(productVariants.id, variantId))
    }

    // 4. Clear Cart
    const cartRes = await db.select().from(carts).where(eq(carts.userId, user.id)).limit(1)
    if (cartRes.length > 0) {
      await db.delete(cartItems).where(eq(cartItems.cartId, cartRes[0].id))
    }

    // 5. Initiate Payment
    if (isCod) {
      try {
        await processShiprocketOrder(orderId, c.env)
      } catch (err: any) {
        console.error('Shiprocket COD Trigger Error:', err.message)
      }
      return c.json({ success: true, orderId, paymentUrl: null })
    }

    const paymentUrl = await initiatePayment(orderId, totalAmount, address.phone, c.env)
    return c.json({ success: true, orderId, paymentUrl })

  } catch (err: any) {
    console.error('Order Creation Error:', err.message, err.stack)
    return c.json({ error: 'Order creation failed', details: err.message }, 500)
  }
})

// Get user's orders
router.get('/', async (c) => {
  const user = c.get('user')
  const db = getDb(c.env.DATABASE_URL)
  const userOrders = await db.select().from(orders).where(eq(orders.userId, user.id))
  return c.json(userOrders)
})

export default router
