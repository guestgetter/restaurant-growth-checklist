import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isHistorical = searchParams.get('history') === 'true';
    const days = parseInt(searchParams.get('days') || '30');

    if (isHistorical) {
      // Return historical data for trends
      const historicalData = await prisma.funnelData.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      return NextResponse.json(historicalData);
    }

    // Get the latest funnel data
    const funnelData = await prisma.funnelData.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!funnelData) {
      // Return default data if none exists
      return NextResponse.json({
        attention: { value: 24500, lastUpdated: new Date().toISOString().split('T')[0], dataSource: 'manual' },
        interest: { value: 1210, lastUpdated: new Date().toISOString().split('T')[0], dataSource: 'manual' },
        desire: { value: 485, lastUpdated: new Date().toISOString().split('T')[0], dataSource: 'manual' },
        action: { value: 89, lastUpdated: new Date().toISOString().split('T')[0], dataSource: 'manual' }
      });
    }

    return NextResponse.json(funnelData.data);
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    return NextResponse.json({ error: 'Failed to fetch funnel data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { funnelData } = body;

    // Save funnel data with timestamp for historical tracking
    const savedData = await prisma.funnelData.create({
      data: {
        data: funnelData,
        createdAt: new Date()
      }
    });

    console.log('✅ Funnel data saved successfully');
    return NextResponse.json({ success: true, id: savedData.id });
  } catch (error) {
    console.error('❌ Error saving funnel data:', error);
    return NextResponse.json({ error: 'Failed to save funnel data' }, { status: 500 });
  }
}

// Note: Historical data can be fetched via GET with ?history=true query param 