import { execSync, spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

/**
 * Ensure Prisma client is generated
 * This runs once when the module is first imported
 */
export function ensurePrismaClient() {
  try {
    const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client', 'index.d.ts')
    
    // Check if Prisma client already exists
    if (fs.existsSync(prismaClientPath)) {
      console.log('[v0] Prisma client already generated')
      return true
    }
    
    console.log('[v0] Generating Prisma client...')
    
    try {
      // Try using spawnSync for better error handling
      const result = spawnSync('npx', ['prisma', 'generate'], {
        stdio: ['inherit', 'inherit', 'inherit'],
        cwd: process.cwd(),
        timeout: 30000
      })
      
      if (result.error) {
        throw result.error
      }
      
      if (result.status !== 0) {
        console.warn('[v0] Prisma generate completed with status:', result.status)
      }
    } catch (spawnError) {
      console.warn('[v0] spawnSync failed, trying execSync:', spawnError)
      
      // Fallback to execSync
      execSync('npx prisma generate', {
        stdio: 'pipe',
        cwd: process.cwd()
      })
    }
    
    console.log('[v0] Prisma client generated successfully')
    return true
  } catch (error) {
    console.error('[v0] Failed to generate Prisma client:', error)
    // Don't fail completely, let the app try to load
    return false
  }
}

// Ensure Prisma client is generated when this module is imported
if (typeof window === 'undefined') {
  ensurePrismaClient()
}
