import { z } from 'zod'

export const orderCreateSchema = z.object({
  address: z.object({
    fullName: z.string().min(1).max(100),
    email: z.string().email(),
    line1: z.string().min(1).max(255),
    line2: z.string().max(255).optional(),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    pincode: z.string().min(4).max(10),
    phone: z.string().min(10).max(15),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    size: z.string().min(1).max(10),
    quantity: z.number().int().min(1).max(20),
  })).min(1).max(50),
  paymentMethod: z.enum(['phonepe', 'COD']),
})

export const cartAddSchema = z.object({
  productId: z.string().min(1),
  size: z.string().min(1).max(10),
  quantity: z.number().int().min(1).max(20).default(1),
})

export const cartUpdateSchema = z.object({
  cartItemId: z.string().min(1),
  quantity: z.number().int().min(0).max(20),
})

export const shippingCheckSchema = z.object({
  from: z.string().regex(/^\d{6}$/),
  to: z.string().regex(/^\d{6}$/),
  weight: z.number().positive().max(50).optional().default(0.5),
})

export const productCreateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  price: z.number().positive(),
  mrp: z.number().positive(),
  category: z.string().min(1).max(100),
  badge: z.string().max(50).optional(),
  isFeatured: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  sizes: z.record(z.string(), z.number().int().min(0)).optional().default({}),
})

export const statusUpdateSchema = z.object({
  deliveryStatus: z.enum([
    'PROCESSING', 'PICKUP_SCHEDULED', 'OUT_FOR_PICKUP',
    'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY',
    'DELIVERED', 'RETURN_INITIATED', 'RETURNED'
  ]),
})
