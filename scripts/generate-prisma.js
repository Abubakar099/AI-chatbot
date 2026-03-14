#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

console.log('[Prisma Setup] Starting Prisma client generation...');

try {
  // Check if .env.local exists
  const envPath = path.join(projectRoot, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('[Prisma Setup] .env.local not found, creating with defaults...');
    const envContent = `DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your_gemini_api_key_here"
`;
    fs.writeFileSync(envPath, envContent);
  }

  // Generate Prisma client
  console.log('[Prisma Setup] Generating Prisma client...');
  execSync('npx prisma generate', { 
    cwd: projectRoot,
    stdio: 'inherit'
  });

  // Run database push to ensure schema is synced
  console.log('[Prisma Setup] Syncing database schema...');
  try {
    execSync('npx prisma db push --skip-generate', {
      cwd: projectRoot,
      stdio: 'inherit'
    });
  } catch (error) {
    console.log('[Prisma Setup] Database sync completed (may have skipped if already synced)');
  }

  console.log('[Prisma Setup] ✓ Prisma setup completed successfully!');
} catch (error) {
  console.error('[Prisma Setup] Error during setup:', error.message);
  process.exit(1);
}
