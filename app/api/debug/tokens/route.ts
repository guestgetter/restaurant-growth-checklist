import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get token information from session
    const tokenInfo = {
      hasAccessToken: !!(session as any).accessToken,
      accessTokenPreview: (session as any).accessToken ? 
        `${(session as any).accessToken.substring(0, 20)}...` : null,
      refreshToken: null, // We'll get this from the JWT token
      user: {
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
      },
      provider: session.user?.image ? 'google' : 'credentials'
    };

    // Try to get the refresh token from the raw JWT
    try {
      const jwt = require('jsonwebtoken');
      const token = request.cookies.get('next-auth.session-token')?.value || 
                   request.cookies.get('__Secure-next-auth.session-token')?.value;
      
      if (token) {
        // Decode without verification to peek at the token
        const decoded = jwt.decode(token) as any;
        if (decoded?.refreshToken) {
          tokenInfo.refreshToken = decoded.refreshToken;
        }
      }
    } catch (error) {
      console.log('Could not decode JWT token:', error);
    }

    return NextResponse.json(tokenInfo);
  } catch (error) {
    console.error('Error getting token info:', error);
    return NextResponse.json(
      { error: 'Failed to get token information' },
      { status: 500 }
    );
  }
} 