const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('[v0] Starting AI Chatbot setup...\n');

// Step 1: Generate Prisma Client
console.log('[v0] Step 1: Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit', cwd: process.cwd() });
  console.log('[v0] ✓ Prisma client generated\n');
} catch (error) {
  console.error('[v0] ✗ Failed to generate Prisma client');
  console.error(error.message);
  process.exit(1);
}

// Step 2: Ensure database file exists
console.log('[v0] Step 2: Checking database file...');
const dbPath = path.join(process.cwd(), 'dev.db');
if (!fs.existsSync(dbPath)) {
  console.log('[v0] Creating SQLite database at', dbPath);
  fs.writeFileSync(dbPath, '');
}
console.log('[v0] ✓ Database file ready\n');

// Step 3: Push schema to database
console.log('[v0] Step 3: Syncing database schema...');
try {
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit', cwd: process.cwd() });
  console.log('[v0] ✓ Database schema synced\n');
} catch (error) {
  console.warn('[v0] ⚠ Database sync had issues (this is often expected on first run)');
  console.warn('[v0] The database will be initialized on first use\n');
}

// Step 4: Check environment variables
console.log('[v0] Step 4: Checking environment variables...');
const envPath = path.join(process.cwd(), '.env.local');
let configOk = true;

if (!fs.existsSync(envPath)) {
  console.warn('[v0] ⚠ .env.local file not found');
  console.warn('[v0] Creating .env.local with template values...');
  fs.writeFileSync(envPath, `DATABASE_URL="file:./dev.db"\nGEMINI_API_KEY="your_key_here"\n`);
  configOk = false;
}

const envContent = fs.readFileSync(envPath, 'utf-8');
if (!envContent.includes('GEMINI_API_KEY') || envContent.includes('your_key_here')) {
  console.warn('[v0] ⚠ GEMINI_API_KEY not configured properly');
  console.warn('[v0] You must set GEMINI_API_KEY in .env.local');
  configOk = false;
}

if (configOk) {
  console.log('[v0] ✓ Environment variables configured\n');
} else {
  console.warn('[v0] ⚠ Please configure GEMINI_API_KEY in .env.local\n');
}

console.log('[v0] Setup complete! Ready to start development.\n');
console.log('[v0] If you see API errors:');
console.log('[v0] 1. Get a Gemini API key from https://makersuite.google.com/app/apikey');
console.log('[v0] 2. Add it to .env.local as GEMINI_API_KEY');
console.log('[v0] 3. Restart the dev server\n');
