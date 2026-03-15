import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

async function verify() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not defined');
    return;
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  const adminEmail = 'admin@dripkart.com';
  const user = await db.select().from(schema.users).where(eq(schema.users.email, adminEmail)).limit(1);

  if (user.length > 0) {
    console.log('--- USER INFO ---');
    console.log('ID:', user[0].id);
    console.log('Email:', user[0].email);
    console.log('Role:', user[0].role);
    console.log('-----------------');
  } else {
    console.log('Admin user NOT FOUND in database.');
  }
}

verify();
