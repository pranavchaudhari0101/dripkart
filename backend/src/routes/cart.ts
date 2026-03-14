import { Hono } from 'hono'
import { getDb } from '../db'
import { carts, cartItems, products } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { authMiddleware } from '../middleware/auth'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env; Variables: { user: any } }>()

// All cart routes require a logged-in user
router.use('/*', authMiddleware)

// Helper: Get or Create User's Cart
async function getUserCart(db: any, userId: string) {
  let userCart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1)
  if (!userCart.length) {
    const cartId = `crt_${crypto.randomUUID()}`
    await db.insert(carts).values({ id: cartId, userId })
    // Return mock cart object so rest of flow works exactly same
    return { id: cartId, userId } 
  }
  return userCart[0]
}

// Get standard cart payload with populated product details
router.get('/', async (c) => {
  const user = c.get('user')
  const db = getDb(c.env.DATABASE_URL)
  
  const cart = await getUserCart(db, user.id)
  
  // Left join to get product details inside the cart
  const items = await db.select({
    id: cartItems.id,
    quantity: cartItems.quantity,
    size: cartItems.size,
    product: {
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      mrp: products.mrp,
      category: products.category
    }
  })
  .from(cartItems)
  .leftJoin(products, eq(cartItems.productId, products.id))
  .where(eq(cartItems.cartId, cart.id))

  // Calculate totals natively
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0)

  return c.json({ items, subtotal, cartId: cart.id })
})

// Add item to cart
router.post('/add', async (c) => {
  const user = c.get('user')
  const { productId, size, quantity = 1 } = await c.req.json()
  const db = getDb(c.env.DATABASE_URL)
  
  const cart = await getUserCart(db, user.id)

  // Check if item already exists with that size in the cart
  const existingItemRes = await db.select()
    .from(cartItems)
    .where(and(
      eq(cartItems.cartId, cart.id), 
      eq(cartItems.productId, productId),
      eq(cartItems.size, size)
    )).limit(1)

  if (existingItemRes.length > 0) {
    const existing = existingItemRes[0]
    await db.update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id))
  } else {
    await db.insert(cartItems).values({
      id: `ci_${crypto.randomUUID()}`,
      cartId: cart.id,
      productId,
      size,
      quantity
    })
  }

  return c.json({ success: true })
})

// Update quantity
router.put('/update', async (c) => {
  const { cartItemId, quantity } = await c.req.json()
  const db = getDb(c.env.DATABASE_URL)
  
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId))
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, cartItemId))
  }
  
  return c.json({ success: true })
})

// Remove single item
router.delete('/remove/:id', async (c) => {
  const id = c.req.param('id')
  const db = getDb(c.env.DATABASE_URL)
  await db.delete(cartItems).where(eq(cartItems.id, id))
  return c.json({ success: true })
})

// Clear all cart items
router.delete('/clear', async (c) => {
  const user = c.get('user')
  const db = getDb(c.env.DATABASE_URL)
  const cart = await getUserCart(db, user.id)
  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id))
  return c.json({ success: true })
})

export default router
