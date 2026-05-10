import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import type { NeonDatabase } from 'drizzle-orm/neon-serverless'
import * as schema from './schema'

let pool: Pool | null = null

export function getDb(databaseUrl: string): NeonDatabase<typeof schema> {
  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl })
  }
  return drizzle(pool, { schema })
}
