import { Hono } from 'hono'
import { getDb } from '../db'
import { products, productImages, productVariants } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env }>()

// Public Route: Get all active products
router.get('/', async (c) => {
  const db = getDb(c.env.DATABASE_URL)
  
  // Basic caching via KV (5 mins) for featured/homepage products
  const isFeatured = c.req.query('featured') === 'true'
  const cacheKey = isFeatured ? 'products:featured' : 'products:all'
  
  const cached = await c.env.CACHE.get(cacheKey)
  if (cached) return c.json(JSON.parse(cached))

  let query = db.select().from(products)

  if (isFeatured) {
    const featuredResults = await query.where(and(eq(products.isFeatured, true), eq(products.isActive, true))).orderBy(desc(products.createdAt)).limit(20)
    
    const productsWithData = await Promise.all(featuredResults.map(async (p) => {
      const images = await db.select().from(productImages)
        .where(and(eq(productImages.productId, p.id), eq(productImages.isPrimary, true)))
        .limit(1)
      const variants = await db.select().from(productVariants)
        .where(eq(productVariants.productId, p.id))
      return { ...p, image: images[0]?.url || null, variants }
    }))
    
    await c.env.CACHE.put(cacheKey, JSON.stringify(productsWithData), { expirationTtl: 300 })
    return c.json(productsWithData)
  }

  const results = await query.where(eq(products.isActive, true)).orderBy(desc(products.createdAt)).limit(20)

  // Attach primary image and sizes for grid display
  const productsWithData = await Promise.all(results.map(async (p) => {
    const images = await db.select().from(productImages)
      .where(and(eq(productImages.productId, p.id), eq(productImages.isPrimary, true)))
      .limit(1)
    const variants = await db.select().from(productVariants)
      .where(eq(productVariants.productId, p.id))
    return { ...p, image: images[0]?.url || null, variants }
  }))

  await c.env.CACHE.put(cacheKey, JSON.stringify(productsWithData), { expirationTtl: 300 })
  return c.json(productsWithData)
})

// Public Route: Get single product detail by slug
router.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const db = getDb(c.env.DATABASE_URL)
  
  const cacheKey = `product:${slug}`
  const cached = await c.env.CACHE.get(cacheKey)
  if (cached) return c.json(JSON.parse(cached))

  const productRes = await db.select().from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1)

  if (!productRes.length) return c.json({ error: 'Product not found' }, 404)
  const product = productRes[0]

  const images = await db.select().from(productImages).where(eq(productImages.productId, product.id))
  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product.id))

  const result = { ...product, images, variants }
  await c.env.CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 600 })
  
  return c.json(result)
})

export default router
