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
          await prisma.client.upsert({
            where: { id: client.id },
            update: {
              // Minimal update - only name to avoid TypeScript issues
              name: client.name,
            },
            create: {
              id: client.id,
              name: client.name,
              type: 'quick-service',
              location: { city: '', state: '', country: '' },
              accountManager: '',
              fulfillmentManager: '',
              onboardingDate: new Date().toISOString(),
              currentPhase: 'onboarding',
              dreamCaseStudyGoal: '',
              targetAudience: '',
              topCompetitors: [],
            }
          });
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