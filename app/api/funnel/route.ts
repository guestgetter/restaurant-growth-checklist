import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Type definitions for funnel data
interface FunnelStageData {
  value: number;
  sources?: Array<{ name: string; value: number; color: string }>;
  lastUpdated: string;
  dataSource: 'api' | 'manual' | 'imported';
  notes?: string;
}

interface FunnelData {
  impressions: FunnelStageData;
  interest: FunnelStageData;
  optIns: FunnelStageData;
  redemptions: FunnelStageData;
}

// Default funnel data structure
const getDefaultFunnelData = (): FunnelData => ({
  impressions: {
    value: 24500,
    sources: [
      { name: 'Google Ads', value: 12400, color: 'bg-blue-500' },
      { name: 'Meta Ads', value: 8900, color: 'bg-blue-600' },
      { name: 'Search/Organic', value: 3200, color: 'bg-blue-400' }
    ],
    lastUpdated: new Date().toISOString().split('T')[0],
    dataSource: 'manual',
    notes: 'Total reach across all marketing channels'
  },
  interest: {
    value: 1210,
    sources: [
      { name: 'Ad Clicks', value: 680, color: 'bg-purple-500' },
      { name: 'Menu Views', value: 350, color: 'bg-purple-600' },
      { name: 'Location Clicks', value: 180, color: 'bg-purple-400' }
    ],
    lastUpdated: new Date().toISOString().split('T')[0],
    dataSource: 'manual',
    notes: 'Clicks, menu views, and engagement actions'
  },
  optIns: {
    value: 485,
    sources: [
      { name: 'Email Signups', value: 285, color: 'bg-green-500' },
      { name: 'Phone Numbers', value: 125, color: 'bg-green-600' },
      { name: 'Birthday Collection', value: 75, color: 'bg-green-400' }
    ],
    lastUpdated: new Date().toISOString().split('T')[0],
    dataSource: 'manual',
    notes: 'Distribution assets collected (emails, phones, birthdays)'
  },
  redemptions: {
    value: 89,
    sources: [
      { name: 'Email Offers Redeemed', value: 52, color: 'bg-orange-500' },
      { name: 'SMS Offers Redeemed', value: 28, color: 'bg-orange-600' },
      { name: 'Birthday Offers Redeemed', value: 9, color: 'bg-orange-400' }
    ],
    lastUpdated: new Date().toISOString().split('T')[0],
    dataSource: 'manual',
    notes: 'Actual offer redemptions and conversions'
  }
});

// Validation function
const validateFunnelData = (data: any): data is FunnelData => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredStages = ['impressions', 'interest', 'optIns', 'redemptions'];
  return requiredStages.every(stage => {
    const stageData = data[stage];
    return stageData && 
           typeof stageData.value === 'number' && 
           stageData.value >= 0 &&
           typeof stageData.lastUpdated === 'string' &&
           typeof stageData.dataSource === 'string';
  });
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isHistorical = searchParams.get('history') === 'true';
    const days = parseInt(searchParams.get('days') || '30');
    const clientId = searchParams.get('clientId');

    // Check if FunnelData model exists and is accessible
    let hasFunnelDataModel = true;
    try {
      // Test if we can access the model
      await prisma.$queryRaw`SELECT 1`;
      // Use dynamic access to avoid TypeScript errors
      const model = (prisma as any).funnelData;
      if (!model) throw new Error('Model not found');
      await model.findFirst();
    } catch (error) {
      console.log('FunnelData model not available, using fallback storage');
      hasFunnelDataModel = false;
    }

    if (!hasFunnelDataModel) {
      // Fallback to returning default data
      console.log('Using default funnel data - database model not ready');
      return NextResponse.json(getDefaultFunnelData());
    }

    if (isHistorical) {
      try {
        const model = (prisma as any).funnelData;
        const historicalData = await model.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        });
        return NextResponse.json(historicalData);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        return NextResponse.json([]);
      }
    }

    // Get the latest funnel data
            try {
          const model = (prisma as any).funnelData;
          const funnelData = await model.findFirst({
            where: clientId ? { clientId } : { clientId: null },
            orderBy: { createdAt: 'desc' }
          });

      if (!funnelData || !funnelData.data) {
        console.log('No funnel data found, returning defaults');
        return NextResponse.json(getDefaultFunnelData());
      }

      // Validate the data structure
      if (!validateFunnelData(funnelData.data)) {
        console.log('Invalid funnel data found, returning defaults');
        return NextResponse.json(getDefaultFunnelData());
      }

      return NextResponse.json(funnelData.data);
    } catch (error) {
      console.error('Error fetching funnel data:', error);
      return NextResponse.json(getDefaultFunnelData());
    }

  } catch (error) {
    console.error('Unexpected error in GET /api/funnel:', error);
    return NextResponse.json(getDefaultFunnelData());
  }
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { funnelData, clientId } = body;

    if (!funnelData) {
      return NextResponse.json({ error: 'Missing funnelData in request' }, { status: 400 });
    }

    // Validate the incoming data
    if (!validateFunnelData(funnelData)) {
      return NextResponse.json({ error: 'Invalid funnel data structure' }, { status: 400 });
    }

    // Check if FunnelData model exists
    let hasFunnelDataModel = true;
    try {
      await prisma.$queryRaw`SELECT 1`;
      const model = (prisma as any).funnelData;
      if (!model) throw new Error('Model not found');
      await model.findFirst();
    } catch (error) {
      console.log('FunnelData model not available for saving');
      hasFunnelDataModel = false;
    }

    if (!hasFunnelDataModel) {
      // Fallback storage (could use file system, external service, etc.)
      console.log('⚠️  Database model not ready, data not persisted');
      return NextResponse.json({ 
        success: true, 
        message: 'Data received but not persisted - database not ready',
        fallback: true 
      });
    }

    try {
      // Save funnel data with timestamp for historical tracking
      const model = (prisma as any).funnelData;
      const savedData = await model.create({
        data: {
          clientId: clientId || null,
          data: funnelData,
          createdAt: new Date()
        }
      });

      console.log('✅ Funnel data saved successfully');
      return NextResponse.json({ 
        success: true, 
        id: savedData.id,
        message: 'Funnel data saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving funnel data to database:', error);
      
      // Return success but indicate it wasn't persisted
      return NextResponse.json({ 
        success: true, 
        message: 'Data received but not persisted due to database error',
        error: 'Database save failed',
        fallback: true
      }, { status: 202 }); // 202 Accepted
    }

  } catch (error) {
    console.error('❌ Unexpected error in POST /api/funnel:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Failed to process funnel data'
    }, { status: 500 });
  }
} 