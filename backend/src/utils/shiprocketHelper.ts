import { getDb } from '../db'
import { orders, orderItems, products, users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { createOrder as shiprocketCreateOrder } from '../services/shiprocket'
import type { Env } from '../types/env'

export async function processShiprocketOrder(orderId: string, env: Env) {
  const db = getDb(env.DATABASE_URL)
  
  const orderRes = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!orderRes.length) throw new Error('Order not found')
  const order = orderRes[0]

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

  const shiprocketOrderData = {
    id: order.id,
    customer: {
      name: address.fullName || user.name,
      phone: address.phone || user.phone,
      email: user.email,
    },
    address: address, // expects line1, city, state, pincode
    items: itemsRes,
    isCOD: order.paymentGateway === 'cod',
    finalAmount: order.finalAmount,
  }

  const srRes = await shiprocketCreateOrder(shiprocketOrderData, env) as any
  
  if (srRes.order_id) {
    await db.update(orders)
      .set({ 
        shipRocketId: srRes.order_id.toString(), 
        deliveryStatus: 'PROCESSING' 
      })
      .where(eq(orders.id, orderId))
  }
  
  return srRes
}
