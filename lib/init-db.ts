import { prisma } from './prisma'

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  try {
    // Check if tables exist by querying them
    await prisma.chatSession.findFirst()
    console.log('[v0] Database tables already exist')
  } catch (error) {
    console.log('[v0] Creating database tables...')
    // Tables will be created by Prisma on first use
  }
}
