import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import path from "path";

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  let globalPrisma = global as unknown as { prisma?: PrismaClient };
  
  if (!globalPrisma.prisma) {
    // Extract the file path from DATABASE_URL
    let dbPath = process.env.DATABASE_URL || 'dev.db';
    
    // Handle file: protocol if present
    if (dbPath.startsWith('file:')) {
      dbPath = dbPath.replace('file:', '').replace(/^\.\//, '');
    }
    
    // Make path absolute if it's relative
    if (!path.isAbsolute(dbPath)) {
      dbPath = path.join(process.cwd(), dbPath);
    }
    
    const db = new Database(dbPath);
    const adapter = new PrismaBetterSqlite3(db);
    globalPrisma.prisma = new PrismaClient({ adapter });
  }
  
  prisma = globalPrisma.prisma;
}

export { prisma };



