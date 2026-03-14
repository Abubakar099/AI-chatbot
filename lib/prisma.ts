// import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
// import { PrismaClient } from "@prisma/client";
// import Database from "better-sqlite3";

// const db = new Database("dev.db");
// const adapter = new PrismaBetterSqlite3(db);
// const prisma = new PrismaClient({ adapter });

// export { prisma };


import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma



