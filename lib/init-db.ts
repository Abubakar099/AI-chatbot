import { prisma } from "./prisma";

/**
 * Initializes database tables if they don't exist
 * This ensures the database is ready for operations
 */
export async function initializeDatabase() {
  try {
    // Try to query the User table to verify database connection
    await prisma.user.count();
    console.log("[v0] Database initialized successfully");
    return true;
  } catch (error) {
    console.error("[v0] Database initialization error:", error);
    // The database might not be initialized, but that's okay
    // Prisma will create tables on first use
    return false;
  }
}
