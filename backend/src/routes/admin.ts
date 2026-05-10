import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { getDb } from '../db'
import { products, productImages, productVariants, orders, orderItems, users } from '../db/schema'
import { eq, desc, and, sql, inArray } from 'drizzle-orm'
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth'
import { uploadImage } from '../services/cloudinary'
import { createOrder as shiprocketCreateOrder, assignCourier, generateLabel } from '../services/shiprocket'
import { sendOrderShippedEmail } from '../services/email'
import { statusUpdateSchema } from '../lib/validators'
import type { UserContext } from '../middleware/auth'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env; Variables: { user: UserContext } }>()

// All routes here require Auth + Admin role
router.use('/*', authMiddleware)
router.use('/*', adminOnlyMiddleware)

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ═══════════════════════════════════════════════════════════════
//  ORDER MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// GET /admin/orders — List all orders (with optional filters) — paginated
router.get('/orders', async (c) => {
  const db = getDb(c.env.DATABASE_URL)
  const statusFilter = c.req.query('status')
  const deliveryFilter = c.req.query('delivery')
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '20', 10)))
  const offset = (page - 1) * limit

  let allOrders

  if (deliveryFilter) {
    allOrders = await db.select().from(orders)
      .where(eq(orders.deliveryStatus, deliveryFilter as any))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)
  } else if (statusFilter) {
    allOrders = await db.select().from(orders)
      .where(eq(orders.paymentStatus, statusFilter as any))
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)
  } else {
    allOrders = await db.select().from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset)
  }

  if (allOrders.length === 0) return c.json([])

  const userIds = allOrders.map(o => o.userId)
  const orderIds = allOrders.map(o => o.id)

  // Batch fetch users
  const userList = await db.select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(inArray(users.id, userIds))

  const userMap = new Map(userList.map(u => [u.id, u]))

  // Batch count items per order
  const itemCounts = await db.select({
    orderId: orderItems.orderId,
    count: sql<number>`count(*)`,
  })
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds))
    .groupBy(orderItems.orderId)

  const itemCountMap = new Map(itemCounts.map(r => [r.orderId, Number(r.count)]))

  const ordersWithCustomer = allOrders.map(order => ({
    ...order,
    customerName: userMap.get(order.userId)?.name || 'Unknown',
    customerEmail: userMap.get(order.userId)?.email || '',
    itemCount: itemCountMap.get(order.id) || 0,
  }))

  return c.json(ordersWithCustomer)
})

// GET /admin/orders/:id — Get single order with full details
router.get('/orders/:id', async (c) => {
  const orderId = c.req.param('id')
  const db = getDb(c.env.DATABASE_URL)

  const orderRes = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!orderRes.length) return c.json({ error: 'Order not found' }, 404)
  const order = orderRes[0]

  // Get customer info
  const userRes = await db.select({ name: users.name, email: users.email, phone: users.phone })
    .from(users)
    .where(eq(users.id, order.userId))
    .limit(1)

  // Get order items with product details
  const items = await db.select({
    id: orderItems.id,
    productId: orderItems.productId,
    size: orderItems.size,
    quantity: orderItems.quantity,
    price: orderItems.price,
    productName: products.name,
    productSlug: products.slug,
    productSku: products.sku,
  })
  .from(orderItems)
  .leftJoin(products, eq(orderItems.productId, products.id))
  .where(eq(orderItems.orderId, orderId))

  // Get primary image for each item
  const itemsWithImages = await Promise.all(items.map(async (item) => {
    if (!item.productId) return { ...item, image: null }
    const imgRes = await db.select({ url: productImages.url })
      .from(productImages)
      .where(and(eq(productImages.productId, item.productId), eq(productImages.isPrimary, true)))
      .limit(1)
    return { ...item, image: imgRes[0]?.url || null }
  }))

  return c.json({
    ...order,
    customer: userRes[0] || { name: 'Unknown', email: '', phone: '' },
    items: itemsWithImages,
  })
})

// PATCH /admin/orders/:id/confirm-shipping — Admin confirms & ships the order
router.patch('/orders/:id/confirm-shipping', async (c) => {
  const orderId = c.req.param('id')
  const db = getDb(c.env.DATABASE_URL)

  // 1. Get order
  const orderRes = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!orderRes.length) return c.json({ error: 'Order not found' }, 404)
  const order = orderRes[0]

  // 2. Validation: only allow shipping if order is in PROCESSING state
  if (order.deliveryStatus !== 'PROCESSING') {
    return c.json({ error: `Cannot ship order in ${order.deliveryStatus} state` }, 400)
  }

  // For online payments, require PAID status. For COD, PENDING is ok.
  if (order.paymentGateway !== 'cod' && order.paymentStatus !== 'PAID') {
    return c.json({ error: 'Cannot ship: payment not confirmed yet' }, 400)
  }

  try {
    // 3. Get user & items for Shiprocket
    const userRes = await db.select().from(users).where(eq(users.id, order.userId)).limit(1)
    const user = userRes[0]

    const itemsRes = await db.select({
      quantity: orderItems.quantity,
      price: orderItems.price,
      size: orderItems.size,
      productName: products.name,
      sku: products.sku,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId))

    const address = order.shippingAddress as any

    // 4. Create Shiprocket order
    const shiprocketOrderData = {
      id: order.id,
      customer: {
        name: address.fullName || user.name,
        phone: address.phone || user.phone,
        email: user.email,
      },
      address,
      items: itemsRes,
      isCOD: order.paymentGateway === 'cod',
      finalAmount: order.finalAmount,
    }

    const srRes = await shiprocketCreateOrder(shiprocketOrderData, c.env) as any

    if (!srRes.order_id) {
      console.error('Shiprocket order creation failed:', srRes)
      return c.json({ error: 'Shiprocket order creation failed', details: srRes }, 500)
    }

    // 5. Assign courier to get AWB
    let awbCode = null
    let courierName = null
    try {
      const shipmentId = srRes.shipment_id?.toString()
      if (shipmentId) {
        const courierRes = await assignCourier(shipmentId, c.env) as any
        awbCode = courierRes?.response?.data?.awb_code || null
        courierName = courierRes?.response?.data?.courier_name || null
      }
    } catch (err: any) {
      console.error('Courier assignment failed (non-fatal):', err.message)
    }

    // 6. Update order in DB
    await db.update(orders)
      .set({
        shipRocketId: srRes.order_id.toString(),
        awbCode: awbCode,
        courierName: courierName,
        deliveryStatus: awbCode ? 'SHIPPED' : 'PICKUP_SCHEDULED',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))

    // Send Order Shipped Email
    if (user.email && awbCode) {
      const trackingUrl = `https://www.shiprocket.in/shipment-tracking/${awbCode}`
      const safeCourierName = courierName || 'Courier'
      sendOrderShippedEmail(
        user.email,
        { id: orderId, courierName: safeCourierName, awbCode },
        trackingUrl,
        c.env
      ).catch(e => console.error('Failed to send shipped email:', e))
    }

    return c.json({
      success: true,
      shipRocketId: srRes.order_id,
      awbCode,
      courierName,
      deliveryStatus: awbCode ? 'SHIPPED' : 'PICKUP_SCHEDULED',
    })

  } catch (err: any) {
    console.error('Confirm Shipping Error:', err.message, err.stack)
    return c.json({ error: `Shipping confirmation failed: ${err.message}` }, 500)
  }
})

// PATCH /admin/orders/:id/status — Manually override delivery status
router.patch('/orders/:id/status', zValidator('json', statusUpdateSchema), async (c) => {
  const orderId = c.req.param('id')
  const { deliveryStatus: newStatus } = c.req.valid('json')
  const db = getDb(c.env.DATABASE_URL)

  const updated = await db.update(orders)
    .set({ deliveryStatus: newStatus as any, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning({ id: orders.id })

  if (!updated.length) return c.json({ error: 'Order not found' }, 404)

  return c.json({ success: true, deliveryStatus: newStatus })
})

// GET /admin/orders/:id/label — Generate shipping label
router.get('/orders/:id/label', async (c) => {
  const orderId = c.req.param('id')
  const db = getDb(c.env.DATABASE_URL)

  const orderRes = await db.select({ shipRocketId: orders.shipRocketId, awb: orders.awbCode })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!orderRes.length) return c.json({ error: 'Order not found' }, 404)
  if (!orderRes[0].shipRocketId) return c.json({ error: 'Order has not been shipped yet' }, 400)

  try {
    const labelUrl = await generateLabel(orderRes[0].shipRocketId, c.env)
    
    // Save label URL to order
    await db.update(orders)
      .set({ labelUrl: labelUrl as string })
      .where(eq(orders.id, orderId))

    return c.json({ labelUrl })
  } catch (err: any) {
    return c.json({ error: `Label generation failed: ${err.message}` }, 500)
  }
})


// ═══════════════════════════════════════════════════════════════
//  PRODUCT MANAGEMENT (existing)
// ═══════════════════════════════════════════════════════════════

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

  // Save to DB (sequential, as neon-http lacks interactive transactions)
  try {
    // 1. Insert product
    await db.insert(products).values({
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
      await db.insert(productImages).values(imageValues)
    }

    // 3. Insert variants (sizes/stock)
    const variantValues = Object.entries(sizes).map(([size, stock]) => ({
      id: `var_${crypto.randomUUID()}`,
      productId,
      size,
      stock: stock as number
    }))
    
    if (variantValues.length > 0) {
      await db.insert(productVariants).values(variantValues)
    }

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

// ═══════════════════════════════════════════════════════════════
//  INVENTORY MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// GET /admin/products — List all products with variants (paginated)
router.get('/products', async (c) => {
  const db = getDb(c.env.DATABASE_URL)
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '20', 10)))
  const offset = (page - 1) * limit

  const allProducts = await db.select().from(products)
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset)

  if (allProducts.length === 0) return c.json([])

  const productIds = allProducts.map(p => p.id)

  // Batch fetch variants
  const allVariants = await db.select().from(productVariants)
    .where(inArray(productVariants.productId, productIds))

  const variantMap = new Map<string, typeof allVariants>()
  for (const v of allVariants) {
    const list = variantMap.get(v.productId) || []
    list.push(v)
    variantMap.set(v.productId, list)
  }

  // Batch fetch primary images
  const allImages = await db.select({ productId: productImages.productId, url: productImages.url })
    .from(productImages)
    .where(and(inArray(productImages.productId, productIds), eq(productImages.isPrimary, true)))

  const imageMap = new Map(allImages.map(img => [img.productId, img.url]))

  const productsWithVariants = allProducts.map(p => {
    const variants = variantMap.get(p.id) || []
    const totalStock = variants.reduce((sum, v) => sum + (v.stock ?? 0), 0)
    return {
      ...p,
      image: imageMap.get(p.id) || null,
      variants,
      totalStock,
    }
  })

  return c.json(productsWithVariants)
})

// GET /admin/products/:id/variants — Fetch all variants for a product
router.get('/products/:id/variants', async (c) => {
  const productId = c.req.param('id')
  const db = getDb(c.env.DATABASE_URL)

  const productRes = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  if (!productRes.length) return c.json({ error: 'Product not found' }, 404)

  const variants = await db.select().from(productVariants)
    .where(eq(productVariants.productId, productId))

  return c.json({ product: productRes[0], variants })
})

// PATCH /admin/products/:id/variants — Update stock, add new sizes, deactivate sizes
router.patch('/products/:id/variants', async (c) => {
  const productId = c.req.param('id')
  const db = getDb(c.env.DATABASE_URL)

  const productRes = await db.select({ id: products.id, slug: products.slug })
    .from(products).where(eq(products.id, productId)).limit(1)
  if (!productRes.length) return c.json({ error: 'Product not found' }, 404)

  const { variants: variantUpdates } = await c.req.json() as {
    variants: { id?: string; size: string; stock: number; isActive?: boolean; _delete?: boolean }[]
  }

  if (!variantUpdates || !Array.isArray(variantUpdates)) {
    return c.json({ error: 'variants array is required' }, 400)
  }

  try {
    for (const v of variantUpdates) {
      if (v._delete && v.id) {
        // Delete variant
        await db.delete(productVariants).where(eq(productVariants.id, v.id))
      } else if (v.id) {
        // Update existing variant
        await db.update(productVariants)
          .set({
            stock: v.stock,
            isActive: v.isActive !== false,
          })
          .where(eq(productVariants.id, v.id))
      } else {
        // Add new variant
        await db.insert(productVariants).values({
          id: `var_${crypto.randomUUID()}`,
          productId,
          size: v.size,
          stock: v.stock,
          isActive: v.isActive !== false,
        })
      }
    }

    // Invalidate caches
    await c.env.CACHE.delete('products:all')
    await c.env.CACHE.delete('products:featured')
    await c.env.CACHE.delete(`product:${productRes[0].slug}`)

    // Fetch updated variants
    const updated = await db.select().from(productVariants)
      .where(eq(productVariants.productId, productId))

    return c.json({ success: true, variants: updated })
  } catch (err: any) {
    return c.json({ error: `Inventory update failed: ${err.message}` }, 500)
  }
})

export default router

