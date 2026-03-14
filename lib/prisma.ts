import { PrismaClient } from "@prisma/client";

// Ensure Prisma client is generated (runs once on first import)
if (typeof window === 'undefined') {
  try {
    require('./ensure-prisma-client')
  } catch (e) {
    console.warn('[v0] Could not ensure Prisma client:', e)
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma



