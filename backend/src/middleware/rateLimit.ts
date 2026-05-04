import { createMiddleware } from 'hono/factory'
import type { Env } from '../types/env'

interface RateLimitOptions {
  /** Max requests allowed in the window */
  maxRequests: number
  /** Window size in seconds */
  windowSeconds: number
}

/**
 * Rate limiting middleware using Cloudflare KV.
 * Uses a simple sliding window counter approach.
 */
export function rateLimitMiddleware(options: RateLimitOptions) {
  const { maxRequests, windowSeconds } = options

  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    // Get client IP from Cloudflare headers
    const ip = c.req.header('cf-connecting-ip') 
      || c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || 'unknown'

    // Create a key based on IP + rough path bucket
    const path = new URL(c.req.url).pathname
    const pathBucket = path.split('/').slice(0, 4).join('/') // e.g. /api/orders/create
    const windowKey = Math.floor(Date.now() / (windowSeconds * 1000))
    const key = `rl:${ip}:${pathBucket}:${windowKey}`

    try {
      const current = await c.env.CACHE.get(key)
      const count = current ? parseInt(current, 10) : 0

      if (count >= maxRequests) {
        return c.json(
          { 
            error: 'Too Many Requests', 
            message: `Rate limit exceeded. Try again in ${windowSeconds} seconds.`,
            retryAfter: windowSeconds 
          }, 
          429
        )
      }

      // Increment counter
      await c.env.CACHE.put(key, String(count + 1), { 
        expirationTtl: windowSeconds * 2 // TTL slightly longer than window
      })

      // Add rate limit headers
      c.header('X-RateLimit-Limit', String(maxRequests))
      c.header('X-RateLimit-Remaining', String(Math.max(0, maxRequests - count - 1)))

      await next()
    } catch (err) {
      // If KV fails, allow the request through (fail-open)
      console.error('[RateLimit] KV error, allowing request:', err)
      await next()
    }
  })
}
