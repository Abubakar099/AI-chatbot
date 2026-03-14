import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('[v0] Initializing database...');
    
    // Try to connect to the database
    await prisma.$queryRaw`SELECT 1`;
    
    console.log('[v0] Database is ready');
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database initialized and connected'
    });
  } catch (error) {
    console.error('[v0] Database initialization error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to initialize database',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
