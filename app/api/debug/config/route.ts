import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const config = {
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      googleClientIdPreview: process.env.GOOGLE_CLIENT_ID?.substring(0, 12) + '...' || 'MISSING',
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasGoogleRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 