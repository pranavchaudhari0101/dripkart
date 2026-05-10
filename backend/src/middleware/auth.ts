import { createMiddleware } from 'hono/factory'
import { verifyToken } from '@clerk/backend'
import { getDb } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import type { Env } from '../types/env'

export interface UserContext {
  id: string
  role: 'CUSTOMER' | 'ADMIN'
}

type Variables = {
  user: UserContext
}

export const authMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: Missing or invalid token' }, 401)
  }

  const token = authHeader.split(' ')[1]
  
  try {
    const payload = await verifyToken(token, {
      secretKey: c.env.CLERK_SECRET_KEY,
    })
    
    // Default role
    let role: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER'
    
    // Try to find the user in DB
    const db = getDb(c.env.DATABASE_URL)
    const dbUser = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1)
    
    if (dbUser.length > 0) {
      role = dbUser[0].role as 'CUSTOMER' | 'ADMIN'
    } else {
      // If user doesn't exist yet, we will auto-sync them later or on a specific route
    }

    c.set('user', { id: payload.sub, role })
    await next()
  } catch (error) {
    console.error('Clerk Token Verification Failed:', error)
    return c.json({ error: 'Unauthorized: Invalid or expired token' }, 401)
  }
})

export const adminOnlyMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const user = c.get('user')

  if (!user) {
    return c.json({ error: 'Forbidden: Admin access required' }, 403)
  }

  if (String(user.role).toUpperCase() !== 'ADMIN') {
    return c.json({ error: 'Forbidden: Admin access required' }, 403)
  }

  await next()
})
