const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set for Prisma to initialize');
}

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = prisma;
