import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('[v0] Starting database migration...');

// Generate Prisma Client
console.log('[v0] Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('[v0] ✓ Prisma client generated successfully');
} catch (error) {
  console.error('[v0] ✗ Failed to generate Prisma client:', error);
  process.exit(1);
}

// Create database file if it doesn't exist
const dbPath = path.join(process.cwd(), 'dev.db');
if (!fs.existsSync(dbPath)) {
  console.log('[v0] Creating SQLite database file...');
  fs.writeFileSync(dbPath, '');
  console.log('[v0] ✓ Database file created at', dbPath);
}

// Run Prisma migrations
console.log('[v0] Running database migrations...');
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('[v0] ✓ Database migrations completed successfully');
} catch (error) {
  // Migration may fail if no migrations exist, which is ok
  console.log('[v0] Note: Prisma migrations may not exist yet. Attempting db push...');
  try {
    execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
    console.log('[v0] ✓ Database schema pushed successfully');
  } catch (dbPushError) {
    console.error('[v0] ✗ Failed to sync database:', dbPushError);
    process.exit(1);
  }
}

console.log('[v0] ✓ Database setup completed successfully');
