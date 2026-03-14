#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('[v0] Generating Prisma client...');

try {
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('[v0] Prisma client generated successfully!');
} catch (error) {
  console.error('[v0] Failed to generate Prisma client:', error.message);
  process.exit(1);
}
