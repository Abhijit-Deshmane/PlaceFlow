import { PrismaClient } from "@prisma/client";

// ─── Prisma Singleton ───────────────────────────────────────────────────────
// One PrismaClient instance for the entire API process.
// Do NOT instantiate PrismaClient anywhere else.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
