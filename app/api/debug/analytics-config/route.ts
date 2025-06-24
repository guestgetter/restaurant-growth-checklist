import { NextRequest, NextResponse } from 'next/server';
import { GoogleAnalyticsService } from '../../../../lib/googleAnalyticsService';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || '1';

    // Check environment variables
    const envStatus = {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
      clientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
      clientIdPreview: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...' || 'MISSING',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    };

    // Check Google Analytics service
    console.log('Initializing Google Analytics service for debug...');
    const analyticsService = new GoogleAnalyticsService();
    const isConfigured = analyticsService.isConfigured();

    // Get client data
    let clientData = null;
    try {
      clientData = await prisma.client.findUnique({
        where: { id: clientId },
        select: { 
          id: true,
          name: true, 
          googleAnalyticsPropertyId: true,
          googleAdsCustomerId: true,
          metaAdsAccountId: true
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    // Get all clients for comparison
    let allClients = null;
    try {
      allClients = await prisma.client.findMany({
        select: { 
          id: true,
          name: true, 
          googleAnalyticsPropertyId: true
        }
      });
    } catch (dbError) {
      console.error('Database error getting all clients:', dbError);
    }

    return NextResponse.json({
      environment: envStatus,
      analyticsServiceConfigured: isConfigured,
      requestedClientId: clientId,
      clientData,
      allClients,
      debug: {
        timestamp: new Date().toISOString(),
        hasValidConfig: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN),
        propertyIdConfigured: !!clientData?.googleAnalyticsPropertyId,
      }
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 