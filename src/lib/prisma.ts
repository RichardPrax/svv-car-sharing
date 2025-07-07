import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

// Export database info for debugging
export const prismaConfig = {
    databaseUrl: process.env.DATABASE_URL,
    isLocal: process.env.DATABASE_URL?.includes("localhost"),
    environment: process.env.NODE_ENV,
};

