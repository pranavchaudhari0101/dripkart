import type { KVNamespace } from '@cloudflare/workers-types'

export interface Env {
  CACHE: KVNamespace
  DATABASE_URL: string
  FRONTEND_URL: string
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
  CLERK_PUBLISHABLE_KEY: string
  CLERK_SECRET_KEY: string
  PHONEPE_MERCHANT_ID: string
  PHONEPE_SALT_KEY: string
  PHONEPE_SALT_INDEX: string
  RAZORPAY_KEY_ID: string
  RAZORPAY_KEY_SECRET: string
  SHIPROCKET_EMAIL: string
  SHIPROCKET_PASSWORD: string
  PHONEPE_ENV: 'sandbox' | 'production'
  BACKEND_URL: string
  DEV_SECRET: string
  NODE_ENV?: string
  RESEND_API_KEY: string
  SHIPPING_WEBHOOK_SECRET: string
}
