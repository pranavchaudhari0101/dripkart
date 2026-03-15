import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { hashPassword } from '../utils/crypto';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not defined in .env');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  const adminEmail = 'admin@dripkart.com';
  const adminPassword = 'DripMASTER@2026!';
  
  console.log('--- ADMIN SEEDER ---');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log('--------------------');

  try {
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, adminEmail)).limit(1);
    
    if (existing.length > 0) {
      console.log('Admin user already exists. Updating password...');
      const hashedPassword = await hashPassword(adminPassword);
      await db.update(schema.users)
        .set({ password: hashedPassword, role: 'ADMIN' })
        .where(eq(schema.users.email, adminEmail));
    } else {
      console.log('Creating new Admin user...');
      const hashedPassword = await hashPassword(adminPassword);
      const userId = `usr_${crypto.randomUUID()}`;
      
      await db.insert(schema.users).values({
        id: userId,
        name: 'Master Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      });

      await db.insert(schema.carts).values({
        id: `crt_${crypto.randomUUID()}`,
        userId: userId
      });
    }

    console.log('SUCCESS: Master Admin account is ready.');
  } catch (error) {
    console.error('FAILED to seed admin:', error);
  }
}

seed();
