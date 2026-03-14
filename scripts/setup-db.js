#!/usr/bin/env node

/**
 * Database setup script
 * Run with: node scripts/setup-db.js
 * This script generates Prisma client and sets up the SQLite database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('🔧 Setting up database...\n');

  // 1. Create .env if it doesn't exist
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, 'DATABASE_URL="file:./dev.db"\nGEMINI_API_KEY="your-api-key-here"\n');
    console.log('✅ Created .env.local file. Please update GEMINI_API_KEY with your actual key.');
  }

  // 2. Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');

  // 3. Run migrations
  console.log('🗄️  Running migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Migrations completed\n');

  // 4. Push schema (for development)
  console.log('📝 Pushing schema to database...');
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  console.log('✅ Schema pushed\n');

  console.log('🎉 Database setup complete!');
} catch (error) {
  console.error('❌ Error setting up database:', error.message);
  process.exit(1);
}
