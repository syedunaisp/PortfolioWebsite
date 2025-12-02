import { PrismaClient } from '@prisma/client';
// Force reload
// Force reload

// Ensure a single PrismaClient instance across hot reloads (Next.js dev mode)
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };