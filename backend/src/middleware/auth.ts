import { createMiddleware } from 'hono/factory'
import { verifyToken } from '../utils/jwt'
import { getDb } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import type { Env } from '../types/env'

type Variables = {
  user: { id: string; role: 'CUSTOMER' | 'ADMIN' }
}

export const authMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401)
  }

  const token = authHeader.split(' ')[1]
  
  try {
    const payload = await verifyToken(token, c.env.JWT_SECRET)
    c.set('user', payload as Variables['user'])
    await next()
  } catch (error) {
    return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401)
  }
})

export const adminOnlyMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const user = c.get('user')
  console.log('[ADMIN_ONLY_MIDDLEWARE] User from context:', JSON.stringify(user));

  if (!user) {
    console.warn('[ADMIN_ONLY_MIDDLEWARE] No user in context');
    return c.json({ error: 'Forbidden: Admin access required' }, 403)
  }

  if (user.role !== 'ADMIN') {
    console.warn(`[ADMIN_ONLY_MIDDLEWARE] Role mismatch. Expected ADMIN, got: ${user.role}`);
    return c.json({ error: 'Forbidden: Admin access required' }, 403)
  }
  
  console.log('[ADMIN_ONLY_MIDDLEWARE] Access granted');
  await next()
})
