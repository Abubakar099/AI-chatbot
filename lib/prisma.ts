import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  let globalPrisma = global as unknown as { prisma?: PrismaClient };
  
  if (!globalPrisma.prisma) {
    globalPrisma.prisma = new PrismaClient({
      log: ['warn', 'error'],
    });
  }
  
  prisma = globalPrisma.prisma;
}

export { prisma };



