import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('[v0] Checking application setup...');
    
    const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    
    const ready = hasGeminiKey && hasDatabaseUrl;
    
    console.log('[v0] Setup check:', { hasGeminiKey, hasDatabaseUrl, ready });
    
    return NextResponse.json({ 
      ready,
      hasGeminiKey,
      hasDatabaseUrl,
      message: ready ? 'Setup is complete' : 'Setup is incomplete'
    });
  } catch (error) {
    console.error('[v0] Setup check error:', error);
    return NextResponse.json(
      { 
        ready: false,
        hasGeminiKey: false,
        hasDatabaseUrl: false,
        message: 'Setup check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
