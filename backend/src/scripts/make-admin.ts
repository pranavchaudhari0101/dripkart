import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';
import * as fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .dev.vars to get DB URL
let devVars = '';
try {
  devVars = fs.readFileSync(join(__dirname, '../../.dev.vars'), 'utf8');
} catch (e) {
  devVars = fs.readFileSync(join(__dirname, '../../.env'), 'utf8');
}

const databaseUrlMatch = devVars.match(/DATABASE_URL="([^"]+)"/);
const databaseUrl = databaseUrlMatch ? databaseUrlMatch[1] : undefined;

async function makeAdmin(email: string) {
  if (!databaseUrl) {
    console.error('DATABASE_URL is not defined in .dev.vars or .env');
    return;
  }
  
  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });
  
  try {
    // Check if user exists
    const existingUser = await db.select().from(schema.users).where(schema.users.email.equals(email)).limit(1);
    
    if (existingUser.length > 0) {
      // User exists, update role
      await db.update(schema.users).set({ role: 'ADMIN' }).where(schema.users.email.equals(email));
      console.log(`✅ Success: Updated existing user ${email} to ADMIN.`);
    } else {
      // User does not exist, insert placeholder so Clerk migration catches it
      const placeholderId = `usr_placeholder_${crypto.randomUUID()}`;
      await db.insert(schema.users).values({
        id: placeholderId,
        name: 'Admin User',
        email: email,
        role: 'ADMIN',
        phone: null,
      });
      console.log(`✅ Success: Reserved ${email} as an ADMIN. Go ahead and sign up with this email on the website!`);
    }
  } catch (err) {
    console.error('❌ Failed to make admin:', err);
  }
}

const emailArg = process.argv[2];
if (!emailArg) {
  console.log('Usage: npx tsx src/scripts/make-admin.ts <email>');
  process.exit(1);
}

makeAdmin(emailArg);
