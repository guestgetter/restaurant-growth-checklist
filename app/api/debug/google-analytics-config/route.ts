import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const config = {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
      clientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
      clientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
      refreshTokenLength: process.env.GOOGLE_REFRESH_TOKEN?.length || 0,
      clientIdPreview: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...',
      nextAuthUrl: process.env.NEXTAUTH_URL,
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error checking Google Analytics config:', error);
    return NextResponse.json({ error: 'Failed to check config' }, { status: 500 });
  }
} 