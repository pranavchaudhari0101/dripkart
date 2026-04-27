import { Hono } from 'hono'
import { getDb } from '../db'
import { users, carts } from '../db/schema'
import { eq } from 'drizzle-orm'
import { authMiddleware } from '../middleware/auth'
import { createClerkClient } from '@clerk/backend'
import type { Env } from '../types/env'

const router = new Hono<{ Bindings: Env; Variables: { user: any } }>()

// Auto-sync or return user
router.get('/me', authMiddleware, async (c) => {
  const payload = c.get('user') // { id: sub, role }
  const db = getDb(c.env.DATABASE_URL)
  
  let userRes = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role
  }).from(users).where(eq(users.id, payload.id)).limit(1)

  // If user doesn't exist, we sync them from Clerk
  if (userRes.length === 0) {
    console.log(`[AUTH/SYNC] Syncing new Clerk user: ${payload.id}`);
    try {
      const clerk = createClerkClient({
        publishableKey: c.env.CLERK_PUBLISHABLE_KEY,
        secretKey: c.env.CLERK_SECRET_KEY,
      });

      const clerkUser = await clerk.users.getUser(payload.id);
      
      const email = clerkUser.emailAddresses[0]?.emailAddress || '';
      const name = clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : 'User';

      await db.insert(users).values({
        id: payload.id, // Use Clerk's ID
        name,
        email,
        phone: null,
        password: '', // No password, handled by Clerk
        role: 'CUSTOMER'
      });

      await db.insert(carts).values({
        id: `crt_${crypto.randomUUID()}`,
        userId: payload.id
      });

      console.log(`[AUTH/SYNC] Created new user and cart for: ${payload.id}`);

      // Re-fetch
      userRes = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      }).from(users).where(eq(users.id, payload.id)).limit(1)

    } catch (err) {
      console.error('[AUTH/SYNC] Error syncing user from Clerk:', err);
      return c.json({ error: 'Failed to sync user data' }, 500);
    }
  }
  
  return c.json({ user: userRes[0] })
})

export default router
