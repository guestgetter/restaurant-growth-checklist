import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../lib/db/database-service';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get localStorage data
    const body = await request.json();
    const { clients, progressData } = body;

    console.log('Received migration request with:', {
      clientCount: clients?.length || 0,
      progressKeys: Object.keys(progressData || {}).length
    });

    // Test database connection first
    await prisma.$connect();

    let migratedClients = 0;
    let migratedProgress = 0;
    const errors: string[] = [];

    // Migrate clients
    if (clients && Array.isArray(clients)) {
      for (const client of clients) {
        try {
          const existingClient = await prisma.client.findUnique({
            where: { id: client.id },
          });

          if (existingClient) {
            // If client exists, just update the name to be safe
            await prisma.client.update({
              where: { id: client.id },
              data: { name: client.name },
            });
          } else {
            // If client does not exist, create it
            await prisma.client.create({
              data: {
                id: client.id,
                name: client.name,
                type: client.type || 'quick-service',
                industry: client.industry || null,
                logo: client.logo || null,
                location: client.location || { city: '', state: '', country: '' },
                accountManager: client.accountManager || '',
                fulfillmentManager: client.fulfillmentManager || '',
                onboardingDate: client.onboardingDate || new Date().toISOString(),
                currentPhase: client.currentPhase || 'onboarding',
                googleAdsCustomerId: client.googleAdsCustomerId || null,
                metaAdsAccountId: client.metaAdsAccountId || null,
                dreamCaseStudyGoal: client.dreamCaseStudyGoal || '',
                targetAudience: client.targetAudience || '',
                topCompetitors: client.topCompetitors || [],
                monthlyRevenue: client.monthlyRevenue || null,
                averageOrderValue: client.averageOrderValue || null,
                branding: client.branding || { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', fontFamily: 'Inter' },
                contact: client.contact || { email: '', phone: '', address: '' },
                status: 'active',
              }
            });
          }
          migratedClients++;
        } catch (error) {
          errors.push(`Failed to migrate client ${client.name}: ${error}`);
        }
      }
    }

    // Migrate progress data
    if (progressData && typeof progressData === 'object') {
      for (const [clientId, progress] of Object.entries(progressData)) {
        try {
          const progressInfo = progress as { completedItems: string[], completedSubtasks: string[] };
          
          if (progressInfo.completedItems?.length > 0 || progressInfo.completedSubtasks?.length > 0) {
            await prisma.clientProgress.upsert({
              where: { clientId },
              update: {
                completedItems: progressInfo.completedItems || [],
                completedSubtasks: progressInfo.completedSubtasks || [],
              },
              create: {
                clientId,
                completedItems: progressInfo.completedItems || [],
                completedSubtasks: progressInfo.completedSubtasks || [],
              }
            });
            migratedProgress++;
          }
        } catch (error) {
          errors.push(`Failed to migrate progress for client ${clientId}: ${error}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      results: {
        clients: migratedClients,
        progressRecords: migratedProgress,
        errors
      }
    });

  } catch (error) {
    console.error('Migration API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Get current database stats
    const clientCount = await prisma.client.count();
    const progressCount = await prisma.clientProgress.count();
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      connected: true,
      message: 'Database connection successful',
      stats: {
        clients: clientCount,
        progressRecords: progressCount
      }
    });
  } catch (error) {
    await prisma.$disconnect();
    return NextResponse.json({
      success: false,
      connected: false,
      error: error instanceof Error ? error.message : 'Database connection failed'
    }, { status: 500 });
  }
} 