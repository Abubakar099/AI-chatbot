import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  let globalPrisma = global as unknown as { prisma?: PrismaClient };
  
  if (!globalPrisma.prisma) {
    const db = new Database(process.env.DATABASE_URL || 'dev.db');
    const adapter = new PrismaBetterSqlite3(db);
    globalPrisma.prisma = new PrismaClient({ adapter });
  }
  
  prisma = globalPrisma.prisma;
}

export { prisma };



