import { Hono } from 'hono'
import { getDb } from '../db'
import { products, productImages, productVariants } from '../db/schema'
import { eq } from 'drizzle-orm'
import { adminOnlyMiddleware } from '../middleware/auth'
import { uploadImage } from '../services/cloudinary'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env; Variables: { user: any } }>()

// All routes here require Admin role
router.use('/*', adminOnlyMiddleware)

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Upload a new product + images (multipart/form-data as per Master Prompt Part 6)
router.post('/products', async (c) => {
  const db = getDb(c.env.DATABASE_URL)
  const formData = await c.req.formData()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const mrp = parseFloat(formData.get('mrp') as string)
  const category = formData.get('category') as string
  const badge = formData.get('badge') as string | null
  const isFeatured = formData.get('isFeatured') === 'true'
  const tagsStr = formData.get('tags') as string | null
  const sizesStr = formData.get('sizes') as string // expects JSON: '{"S":10, "M":20}'
  
  if (!name || !description || !price || !mrp || !category) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const productId = `prod_${crypto.randomUUID()}`
  let slug = generateSlug(name)
  const sku = `DK-${Math.random().toString(36).substring(2,8).toUpperCase()}`
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : []
  let sizes: Record<string, number> = {}
  try { sizes = JSON.parse(sizesStr || '{}') } catch (e) {}

  // Handle images
  const uploadPromises: Promise<{ url: string; publicId: string }>[] = []
  for (let i = 1; i <= 5; i++) {
    const file = formData.get(`image${i}`) as File | null
    if (file && file.size > 0) {
      uploadPromises.push(file.arrayBuffer().then(buf => uploadImage(buf, file.name, c.env)))
    }
  }

  let uploadedImages: { url: string; publicId: string }[] = []
  try {
    uploadedImages = await Promise.all(uploadPromises)
  } catch (err: any) {
    return c.json({ error: 'Image upload failed', details: err.message }, 500)
  }

  // Save to DB in transaction
  try {
    await db.transaction(async (tx) => {
      // 1. Insert product
      await tx.insert(products).values({
        id: productId, name, slug, description, price, mrp, sku,
        category, badge, tags, isFeatured
      })

      // 2. Insert images
      if (uploadedImages.length > 0) {
        const imageValues = uploadedImages.map((img, idx) => ({
          id: `img_${crypto.randomUUID()}`,
          productId,
          url: img.url,
          publicId: img.publicId,
          isPrimary: idx === 0, // first image is primary
          displayOrder: idx
        }))
        await tx.insert(productImages).values(imageValues)
      }

      // 3. Insert variants (sizes/stock)
      const variantValues = Object.entries(sizes).map(([size, stock]) => ({
        id: `var_${crypto.randomUUID()}`,
        productId,
        size,
        stock
      }))
      if (variantValues.length > 0) {
        await tx.insert(productVariants).values(variantValues)
      }
    })

    // Invalidate KV cache
    await c.env.CACHE.delete('products:all')
    if (isFeatured) await c.env.CACHE.delete('products:featured')

    return c.json({ success: true, productId, slug }, 201)
  } catch (err: any) {
    // If saving fails due to unique constraints (like slug), handle it gracefully
    if (err.message.includes('unique constraint')) {
       return c.json({ error: 'Product name or slug already exists. Try slightly modifying the name.' }, 400)
    }
    return c.json({ error: 'Failed to save product to database', details: err.message }, 500)
  }
})

// Toggle product featured status
router.patch('/products/:id/featured', async (c) => {
  const id = c.req.param('id')
  const { isFeatured } = await c.req.json()
  const db = getDb(c.env.DATABASE_URL)

  await db.update(products).set({ isFeatured, updatedAt: new Date() }).where(eq(products.id, id))
  
  await c.env.CACHE.delete('products:featured')
  await c.env.CACHE.delete('products:all')
  await c.env.CACHE.delete(`product:${id}`) // technically caches by slug, but good practice

  return c.json({ success: true, isFeatured })
})

export default router
