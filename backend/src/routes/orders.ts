import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { getDb } from '../db'
import { orders, orderItems, products, productVariants } from '../db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { authMiddleware } from '../middleware/auth'
import { initiatePayment } from '../services/phonepe'
import { sendOrderConfirmedEmail } from '../services/email'
import { orderCreateSchema } from '../lib/validators'
import type { UserContext } from '../middleware/auth'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env; Variables: { user: UserContext } }>()
router.use('/*', authMiddleware)

router.post('/create', zValidator('json', orderCreateSchema), async (c) => {
  const user = c.get('user')
  const { address, items, paymentMethod } = await c.req.json()
  const db = getDb(c.env.DATABASE_URL)

  const uuid = crypto.randomUUID().replace(/-/g, '')
  const orderId = `ord_${uuid.substring(0, 28)}`

  try {
    // 1. Pre-validate items (non-transactional read for price computation)
    let totalAmount = 0
    const validatedItems: Array<{
      productId: string
      size: string
      quantity: number
      price: number
      variantId: string
    }> = []

    for (const item of items) {
      const productRes = await db.select().from(products)
        .where(eq(products.id, item.productId)).limit(1)
      const product = productRes[0]

      const variantRes = await db.select().from(productVariants)
        .where(and(eq(productVariants.productId, item.productId), eq(productVariants.size, item.size)))
        .limit(1)
      const variant = variantRes[0]

      if (!product || !variant) {
        return c.json({ error: `Product or variant not found for ${item.productId}` }, 400)
      }
      if (variant.stock < item.quantity) {
        return c.json({ error: `Insufficient stock for ${product.name} (Size: ${item.size})` }, 409)
      }

      totalAmount += product.price * item.quantity
      validatedItems.push({
        productId: item.productId,
        size: item.size,
        quantity: item.quantity,
        price: product.price,
        variantId: variant.id
      })
    }

    const isCod = paymentMethod === 'COD'

    // 2. Atomic transaction: insert order + items + update stock
    await db.transaction(async (tx) => {
      // Insert order
      await tx.insert(orders).values({
        id: orderId,
        userId: user.id,
        totalAmount,
        finalAmount: totalAmount,
        paymentStatus: 'PENDING',
        paymentGateway: isCod ? 'cod' : 'phonepe',
        shippingAddress: address
      })

      // Insert order items and update stock atomically
      for (const item of validatedItems) {
        await tx.insert(orderItems).values({
          id: `oi_${crypto.randomUUID()}`,
          orderId,
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })

        // Atomic stock decrement with safety check
        const updateRes = await tx.update(productVariants)
          .set({ stock: sql`${productVariants.stock} - ${item.quantity}` })
          .where(and(
            eq(productVariants.id, item.variantId),
            sql`${productVariants.stock} >= ${item.quantity}`
          ))
          .returning({ id: productVariants.id })

        if (updateRes.length === 0) {
          throw new Error(`Stock depleted for variant ${item.variantId} during checkout`)
        }
      }
    })

    // 3. Invalidate caches after successful transaction
    const affectedProductIds = Array.from(new Set(items.map((i: any) => String(i.productId))))
    await Promise.all([
      ...affectedProductIds.map(async (pid) => {
        const pRes = await db.select({ slug: products.slug }).from(products).where(eq(products.id, pid as string)).limit(1)
        if (pRes[0]?.slug) {
          await c.env.CACHE.delete(`product:${pRes[0].slug}`)
        }
      }),
      c.env.CACHE.delete('products:all'),
      c.env.CACHE.delete('products:featured'),
    ])

    // 4. Initiate Payment
    if (isCod) {
      const email = address?.email
      if (email) {
        sendOrderConfirmedEmail(
          email,
          { id: orderId, finalAmount: totalAmount, shippingAddress: address },
          c.env
        ).catch(e => console.error('Failed to send confirmed email (COD):', e))
      }
      return c.json({ success: true, orderId, paymentUrl: null })
    }

    const paymentUrl = await initiatePayment(orderId, totalAmount, address.phone, user.id, c.env)
    return c.json({ success: true, orderId, paymentUrl })

  } catch (err: any) {
    console.error('Order Creation Error:', err.message, err.stack)
    if (err.message?.includes('Stock depleted')) {
      return c.json({ error: 'Some items went out of stock. Please review your cart.' }, 409)
    }
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
