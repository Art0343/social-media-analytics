import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Resolve the absolute path to the SQLite DB file
  const dbFile = (process.env.DATABASE_URL ?? 'file:./dev.db').replace(/^file:/, '');
  const absolutePath = path.isAbsolute(dbFile)
    ? dbFile
    : path.resolve(process.cwd(), dbFile);

  // Prisma v7 requires a driver adapter for SQLite
  const adapter = new PrismaBetterSqlite3({ url: absolutePath });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
