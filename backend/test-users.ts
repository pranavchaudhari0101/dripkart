import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './src/db/schema';
import * as dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let devVars = '';
let databaseUrlMatch = null;
let databaseUrl: string | undefined = undefined;

try {
  devVars = fs.readFileSync(join(__dirname, '.dev.vars'), 'utf8');
  databaseUrlMatch = devVars.match(/DATABASE_URL="([^"]+)"/);
  databaseUrl = databaseUrlMatch ? databaseUrlMatch[1] : undefined;
} catch (err) {
  console.warn('Warning: .dev.vars file not found or could not be read.');
}

async function dumpUsers() {
  if (!databaseUrl) {
    console.error('DATABASE_URL is not defined');
    return;
  }
  try {
    const sql = neon(databaseUrl);
    const db = drizzle(sql, { schema });
    const allUsers = await db.select().from(schema.users);
    
    console.log('--- ALL USERS ---');
    allUsers.forEach(u => {
      const maskedEmail = u.email ? u.email[0] + '***@' + u.email.split('@')[1] : '***';
      console.log(`ID: ${u.id} | Email: ${maskedEmail} | Role: ${u.role}`);
    });
  } catch (err) {
    console.error('Check failed:', err);
  }
}

dumpUsers();
