import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { getDb } from '../db'
import { users, carts } from '../db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword, verifyPassword } from '../utils/crypto'
import { signToken } from '../utils/jwt'
import { authMiddleware } from '../middleware/auth'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env; Variables: { user: any } }>()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  password: z.string().min(8)
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

router.post('/register', zValidator('json', registerSchema), async (c) => {
  const data = c.req.valid('json')
  const db = getDb(c.env.DATABASE_URL)

  const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1)
  if (existingUser.length > 0) {
    return c.json({ error: 'Email already registered' }, 400)
  }

  const hashedPassword = await hashPassword(data.password)
  const userId = `usr_${crypto.randomUUID()}`

  // Insert user
  await db.insert(users).values({
    id: userId,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    password: hashedPassword,
    role: 'CUSTOMER'
  })

  // Create empty cart for user
  await db.insert(carts).values({
    id: `crt_${crypto.randomUUID()}`,
    userId: userId
  })

  const token = await signToken({ id: userId, role: 'CUSTOMER' }, c.env.JWT_SECRET)
  
  return c.json({ 
    message: 'Registration successful',
    user: { id: userId, name: data.name, email: data.email, role: 'CUSTOMER' },
    token 
  }, 201)
})

router.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json')
  const db = getDb(c.env.DATABASE_URL)

  const userRes = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const user = userRes[0]

  if (!user || !(await verifyPassword(password, user.password))) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const token = await signToken({ id: user.id, role: user.role }, c.env.JWT_SECRET)

  return c.json({ 
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token 
  })
})

router.get('/me', authMiddleware, async (c) => {
  const payload = c.get('user')
  const db = getDb(c.env.DATABASE_URL)
  
  const userRes = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role
  }).from(users).where(eq(users.id, payload.id)).limit(1)

  if (!userRes.length) return c.json({ error: 'User not found' }, 404)
  
  return c.json({ user: userRes[0] })
})

export default router
