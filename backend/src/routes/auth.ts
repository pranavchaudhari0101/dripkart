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
  console.log('[AUTH/REGISTER] Request received');
  const data = c.req.valid('json')
  console.log(`[AUTH/REGISTER] Data validated for: ${data.email}`);
  
  try {
    const db = getDb(c.env.DATABASE_URL)
    console.log('[AUTH/REGISTER] DB connected');

    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1)
    if (existingUser.length > 0) {
      console.warn(`[AUTH/REGISTER] Email already registered: ${data.email}`);
      return c.json({ error: 'Email already registered' }, 400)
    }

    const hashedPassword = await hashPassword(data.password)
    const userId = `usr_${crypto.randomUUID()}`
    console.log(`[AUTH/REGISTER] ID generated: ${userId}`);

    // Insert user
    await db.insert(users).values({
      id: userId,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      password: hashedPassword,
      role: 'CUSTOMER'
    })
    console.log('[AUTH/REGISTER] User inserted');

    // Create empty cart for user
    await db.insert(carts).values({
      id: `crt_${crypto.randomUUID()}`,
      userId: userId
    })
    console.log('[AUTH/REGISTER] Cart created');

    const token = await signToken({ id: userId, role: 'CUSTOMER' }, c.env.JWT_SECRET)
    
    console.log('[AUTH/REGISTER] Registration successful');
    return c.json({ 
      message: 'Registration successful',
      user: { id: userId, name: data.name, email: data.email, role: 'CUSTOMER' },
      token 
    }, 201)
  } catch (err: any) {
    console.error('[AUTH/REGISTER] Error:', err);
    return c.json({ error: `Registration failed: ${err.message}` }, 500);
  }
})

router.post('/login', zValidator('json', loginSchema), async (c) => {
  console.log('[AUTH/LOGIN] Request received');
  const { email, password } = c.req.valid('json')
  
  try {
    const db = getDb(c.env.DATABASE_URL)
    console.log('[AUTH/LOGIN] DB connected');

    const userRes = await db.select().from(users).where(eq(users.email, email)).limit(1)
    const user = userRes[0]

    if (!user || !(await verifyPassword(password, user.password))) {
      console.warn(`[AUTH/LOGIN] Invalid credentials for: ${email}`);
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    const token = await signToken({ id: user.id, role: user.role }, c.env.JWT_SECRET)

    console.log('[AUTH/LOGIN] Login successful');
    return c.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token 
    })
  } catch (err: any) {
    console.error('[AUTH/LOGIN] Error:', err);
    return c.json({ error: `Login failed: ${err.message}` }, 500);
  }
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
