import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

// Support Vercel Serverless environment where root is read-only
if (process.env.VERCEL) {
  try {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.resolve('./prisma/dev.db'),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          fs.copyFileSync(candidate, tmpDbPath);
          break;
        }
      }
    }
    dbUrl = 'file:/tmp/dev.db';
    process.env.DATABASE_URL = dbUrl;
  } catch (err) {
    console.error('Failed to prepare sqlite in /tmp on Vercel:', err);
  }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: process.env.VERCEL ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
