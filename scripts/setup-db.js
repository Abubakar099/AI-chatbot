#!/usr/bin/env node

import Database from 'better-sqlite3';
import { spawn } from 'child_process';

// Simple approach: use current working directory
const dbPath = 'dev.db';

console.log(`[v0] Creating database at: ${dbPath}`);
console.log(`[v0] CWD: ${process.cwd()}`);

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sessionId TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    originalContent TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sessionId) REFERENCES chat_sessions(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS messages_sessionId_idx ON messages(sessionId);
  CREATE INDEX IF NOT EXISTS chat_sessions_updatedAt_idx ON chat_sessions(updatedAt DESC);
`);

console.log('[v0] Database tables created!');
db.close();

// Run prisma generate to create client files
console.log('[v0] Running prisma generate...');
const prismaGen = spawn('npx', ['prisma', 'generate'], {
  stdio: 'inherit',
  shell: true
});

prismaGen.on('close', (code) => {
  if (code === 0) {
    console.log('[v0] Setup complete! Prisma client generated successfully.');
  } else {
    console.error('[v0] Prisma generation failed with code', code);
  }
});
