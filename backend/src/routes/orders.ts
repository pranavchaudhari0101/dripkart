import { Hono } from 'hono'
import { getDb } from '../db'
import { orders, orderItems, products, productVariants, cartItems, carts } from '../db/schema'
import { eq, and, sql, gte } from 'drizzle-orm'
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
    const result = await db.transaction(async (tx) => {
      let totalAmount = 0
      const orderItemsToInsert = []

      // 1. Verify items and stock
      for (const item of items) {
        const productRes = await tx.select().from(products)
          .where(eq(products.id, item.productId)).limit(1)
        const product = productRes[0]

        const variantRes = await tx.select().from(productVariants)
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
      await tx.insert(orders).values({
        id: orderId,
        userId: user.id,
        totalAmount,
        finalAmount: totalAmount,
        paymentStatus: 'PENDING',
        paymentGateway: isCod ? 'cod' : 'phonepe',
        shippingAddress: address
      })

      // 3. Insert Items and Update Stock in transaction
      for (const item of orderItemsToInsert) {
        const { variantId, ...values } = item
        await tx.insert(orderItems).values(values)
        
        const updateRes = await tx.update(productVariants)
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

      return { totalAmount, isCod }
    })

    const { totalAmount, isCod } = result

    // 4. Initiate Payment / Shipping Trigger
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

export default router
