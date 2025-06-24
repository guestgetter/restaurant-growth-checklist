import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching all clients from database...');
    
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        name: true,
        googleAnalyticsPropertyId: true,
        googleAdsCustomerId: true,
        metaAdsAccountId: true,
        status: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Found ${clients.length} clients in database:`, clients);

    return NextResponse.json({
      totalClients: clients.length,
      clients: clients,
      summary: {
        hasGoogleAnalytics: clients.filter(c => c.googleAnalyticsPropertyId).length,
        hasGoogleAds: clients.filter(c => c.googleAdsCustomerId).length,
        hasMetaAds: clients.filter(c => c.metaAdsAccountId).length,
        active: clients.filter(c => c.status === 'active').length
      }
    });
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    return NextResponse.json({
      error: 'Failed to fetch clients',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 