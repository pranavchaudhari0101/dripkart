import { Hono } from 'hono'
import { getDb } from '../db'
import { products, productImages, productVariants } from '../db/schema'
import { eq, and, desc, inArray } from 'drizzle-orm'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env }>()

// Public Route: Get all active products
router.get('/', async (c) => {
  const db = getDb(c.env.DATABASE_URL)

  const isFeatured = c.req.query('featured') === 'true'
  const cacheKey = isFeatured ? 'products:featured' : 'products:all'

  const cached = await c.env.CACHE.get(cacheKey)
  if (cached) return c.json(JSON.parse(cached))

  const whereClause = isFeatured
    ? and(eq(products.isFeatured, true), eq(products.isActive, true))
    : eq(products.isActive, true)

  const productList = await db.select().from(products)
    .where(whereClause)
    .orderBy(desc(products.createdAt))
    .limit(20)

  if (productList.length === 0) {
    await c.env.CACHE.put(cacheKey, JSON.stringify([]), { expirationTtl: 300 })
    return c.json([])
  }

  const productIds = productList.map(p => p.id)

  // Batch fetch all primary images in one query
  const images = await db.select().from(productImages)
    .where(and(inArray(productImages.productId, productIds), eq(productImages.isPrimary, true)))

  // Batch fetch all variants in one query
  const variants = await db.select().from(productVariants)
    .where(inArray(productVariants.productId, productIds))

  const imageMap = new Map<string, string>()
  for (const img of images) {
    if (!imageMap.has(img.productId)) imageMap.set(img.productId, img.url)
  }

  const variantMap = new Map<string, typeof variants>()
  for (const v of variants) {
    const list = variantMap.get(v.productId) || []
    list.push(v)
    variantMap.set(v.productId, list)
  }

  const productsWithData = productList.map(p => ({
    ...p,
    image: imageMap.get(p.id) || null,
    variants: variantMap.get(p.id) || [],
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

  const [images, variants] = await Promise.all([
    db.select().from(productImages).where(eq(productImages.productId, product.id)),
    db.select().from(productVariants).where(eq(productVariants.productId, product.id)),
  ])

  const result = { ...product, images, variants }
  await c.env.CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 600 })

  return c.json(result)
})

export default router
