import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

let generatedOnce = false

export async function GET() {
  try {
    // Only run once per server instance
    if (generatedOnce) {
      return NextResponse.json({ status: 'already_generated', message: 'Prisma client was already generated' })
    }

    const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client')
    
    // Check if Prisma client already exists
    if (fs.existsSync(prismaClientPath)) {
      console.log('[v0] Prisma client already exists')
      generatedOnce = true
      return NextResponse.json({ status: 'exists', message: 'Prisma client already exists' })
    }
    
    console.log('[v0] Generating Prisma client...')
    
    try {
      // Try to generate using npx
      execSync('npx prisma generate', {
        stdio: 'pipe',
        cwd: process.cwd(),
        timeout: 30000
      })
      
      console.log('[v0] Prisma client generated successfully')
      generatedOnce = true
      
      return NextResponse.json({ 
        status: 'success', 
        message: 'Prisma client generated successfully'
      })
    } catch (execError) {
      console.error('[v0] npx prisma generate failed:', execError)
      
      // Fallback: check if client was still created despite error
      if (fs.existsSync(prismaClientPath)) {
        console.log('[v0] Prisma client created despite error')
        generatedOnce = true
        return NextResponse.json({ 
          status: 'success_with_error', 
          message: 'Prisma client exists (created despite error)'
        })
      }
      
      throw execError
    }
  } catch (error) {
    console.error('[v0] Prisma init error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to initialize Prisma',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
