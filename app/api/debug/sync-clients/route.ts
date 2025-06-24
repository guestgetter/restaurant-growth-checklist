import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clients } = body;
    
    if (!clients || !Array.isArray(clients)) {
      return NextResponse.json({ error: 'Clients array required' }, { status: 400 });
    }

    console.log('🔄 Syncing clients to database:', clients.map(c => ({ id: c.id, name: c.name })));

    const results = [];
    
    for (const client of clients) {
      try {
        // Upsert client to database
        const upsertedClient = await prisma.client.upsert({
          where: { id: client.id },
          update: {
            name: client.name,
            type: client.industry || 'restaurant',
            accountManager: 'Kyle Guilfoyle',
            fulfillmentManager: 'GuestGetter Team',
            onboardingDate: new Date().toISOString().split('T')[0],
            currentPhase: 'onboarding',
            dreamCaseStudyGoal: 'Increase revenue and customer engagement',
            targetAudience: 'Local food enthusiasts',
            topCompetitors: [],
            location: { city: 'Unknown', state: 'Unknown', country: 'USA' },
            branding: client.branding || {},
            contact: client.contact || {},
            googleAdsCustomerId: client.googleAdsCustomerId,
            metaAdsAccountId: client.metaAdsAccountId,
            googleAnalyticsPropertyId: client.googleAnalyticsPropertyId,
            status: client.status || 'active'
          },
          create: {
            id: client.id,
            name: client.name,
            type: client.industry || 'restaurant',
            accountManager: 'Kyle Guilfoyle',
            fulfillmentManager: 'GuestGetter Team',
            onboardingDate: new Date().toISOString().split('T')[0],
            currentPhase: 'onboarding',
            dreamCaseStudyGoal: 'Increase revenue and customer engagement',
            targetAudience: 'Local food enthusiasts',
            topCompetitors: [],
            location: { city: 'Unknown', state: 'Unknown', country: 'USA' },
            branding: client.branding || {},
            contact: client.contact || {},
            googleAdsCustomerId: client.googleAdsCustomerId,
            metaAdsAccountId: client.metaAdsAccountId,
            googleAnalyticsPropertyId: client.googleAnalyticsPropertyId,
            status: client.status || 'active'
          }
        });

        results.push({
          id: client.id,
          name: client.name,
          status: 'synced',
          analyticsPropertyId: client.googleAnalyticsPropertyId
        });
        
        console.log(`✅ Synced client: ${client.name} (${client.id}) with Analytics Property ID: ${client.googleAnalyticsPropertyId}`);
      } catch (clientError) {
        console.error(`❌ Error syncing client ${client.name}:`, clientError);
        results.push({
          id: client.id,
          name: client.name,
          status: 'error',
          error: clientError instanceof Error ? clientError.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      message: 'Client sync completed',
      results,
      syncedCount: results.filter(r => r.status === 'synced').length,
      errorCount: results.filter(r => r.status === 'error').length
    });

  } catch (error) {
    console.error('❌ Error syncing clients:', error);
    return NextResponse.json({
      error: 'Failed to sync clients',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 