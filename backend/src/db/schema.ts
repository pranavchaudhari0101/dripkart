import { pgTable, text, varchar, integer, real,
         boolean, timestamp, pgEnum, json } from 'drizzle-orm/pg-core'

export const roleEnum          = pgEnum('role', ['CUSTOMER', 'ADMIN'])
export const paymentStatusEnum = pgEnum('payment_status', ['PENDING','PAID','FAILED','REFUNDED'])
export const deliveryStatusEnum = pgEnum('delivery_status', [
  'PROCESSING','PICKUP_SCHEDULED','OUT_FOR_PICKUP',
  'SHIPPED','IN_TRANSIT','OUT_FOR_DELIVERY',
  'DELIVERED','RETURN_INITIATED','RETURNED'
])

export const users = pgTable('users', {
  id:         text('id').primaryKey(),
  name:       varchar('name', { length: 100 }).notNull(),
  email:      varchar('email', { length: 255 }).notNull().unique(),
  phone:      varchar('phone', { length: 15 }).unique(),
  password:   text('password').notNull(),
  role:       roleEnum('role').default('CUSTOMER').notNull(),
  isVerified: boolean('is_verified').default(false),
  createdAt:  timestamp('created_at').defaultNow(),
  updatedAt:  timestamp('updated_at').defaultNow(),
})

export const addresses = pgTable('addresses', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').references(() => users.id).notNull(),
  fullName:  varchar('full_name', { length: 100 }).notNull(),
  phone:     varchar('phone', { length: 15 }).notNull(),
  line1:     text('line1').notNull(),
  line2:     text('line2'),
  city:      varchar('city', { length: 100 }).notNull(),
  state:     varchar('state', { length: 100 }).notNull(),
  pincode:   varchar('pincode', { length: 10 }).notNull(),
  isDefault: boolean('is_default').default(false),
})

export const products = pgTable('products', {
  id:          text('id').primaryKey(),
  name:        varchar('name', { length: 255 }).notNull(),
  slug:        varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  price:       real('price').notNull(),
  mrp:         real('mrp').notNull(),
  sku:         varchar('sku', { length: 50 }).notNull().unique(),
  category:    varchar('category', { length: 100 }).notNull(),
  badge:       varchar('badge', { length: 50 }),
  tags:        text('tags').array().default([]),
  isFeatured:  boolean('is_featured').default(false),
  isActive:    boolean('is_active').default(true),
  createdAt:   timestamp('created_at').defaultNow(),
  updatedAt:   timestamp('updated_at').defaultNow(),
})

export const productImages = pgTable('product_images', {
  id:           text('id').primaryKey(),
  productId:    text('product_id').references(() => products.id, { onDelete: 'cascade' }),
  url:          text('url').notNull(),
  publicId:     text('public_id').notNull(),
  isPrimary:    boolean('is_primary').default(false),
  displayOrder: integer('display_order').default(0),
})

export const productVariants = pgTable('product_variants', {
  id:        text('id').primaryKey(),
  productId: text('product_id').references(() => products.id, { onDelete: 'cascade' }),
  size:      varchar('size', { length: 10 }).notNull(),
  stock:     integer('stock').default(0).notNull(),
  isActive:  boolean('is_active').default(true),
})

export const carts = pgTable('carts', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').references(() => users.id).notNull().unique(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const cartItems = pgTable('cart_items', {
  id:        text('id').primaryKey(),
  cartId:    text('cart_id').references(() => carts.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id),
  size:      varchar('size', { length: 10 }).notNull(),
  quantity:  integer('quantity').default(1).notNull(),
})

export const orders = pgTable('orders', {
  id:              text('id').primaryKey(),
  userId:          text('user_id').references(() => users.id).notNull(),
  totalAmount:     real('total_amount').notNull(),
  discountAmount:  real('discount_amount').default(0),
  finalAmount:     real('final_amount').notNull(),
  paymentStatus:   paymentStatusEnum('payment_status').default('PENDING'),
  paymentMethod:   varchar('payment_method', { length: 50 }),
  paymentGateway:  varchar('payment_gateway', { length: 50 }),  // 'phonepe' | 'razorpay' | 'cod'
  gatewayTxnId:    text('gateway_txn_id'),
  deliveryStatus:  deliveryStatusEnum('delivery_status').default('PROCESSING'),
  shipRocketId:    text('shiprocket_id'),
  awbCode:         text('awb_code'),
  courierName:     varchar('courier_name', { length: 100 }),
  labelUrl:        text('label_url'),
  trackingUrl:     text('tracking_url'),
  shippingAddress: json('shipping_address').notNull(),
  createdAt:       timestamp('created_at').defaultNow(),
  updatedAt:       timestamp('updated_at').defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id:        text('id').primaryKey(),
  orderId:   text('order_id').references(() => orders.id),
  productId: text('product_id').references(() => products.id),
  size:      varchar('size', { length: 10 }).notNull(),
  quantity:  integer('quantity').notNull(),
  price:     real('price').notNull(),
})

export const coupons = pgTable('coupons', {
  id:          text('id').primaryKey(),
  code:        varchar('code', { length: 50 }).notNull().unique(),
  type:        varchar('type', { length: 20 }).notNull(),   // 'percent' | 'flat'
  value:       real('value').notNull(),
  minOrder:    real('min_order').default(0),
  maxUses:     integer('max_uses').default(1),
  usedCount:   integer('used_count').default(0),
  expiresAt:   timestamp('expires_at'),
  isActive:    boolean('is_active').default(true),
})
