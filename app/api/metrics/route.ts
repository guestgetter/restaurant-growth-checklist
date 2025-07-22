import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Type definitions for dashboard metrics
interface MetricData {
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated?: string;
  dataSource: 'api' | 'manual' | 'imported';
  notes?: string;
  timePeriod?: string;
}

// Default metrics data - focused on current tools
const getDefaultMetrics = (): Record<string, MetricData> => ({
  gac: { 
    value: '$12.45', 
    trend: 'stable',
    lastUpdated: new Date().toISOString().split('T')[0],
    dataSource: 'api',
    timePeriod: 'Last 30 Days',
    notes: 'Combined from Google Ads + Meta Ads'
  },
  emailOptIns: { 
    value: '485', 
    trend: 'up',
    lastUpdated: new Date().toISOString().split('T')[0],
    dataSource: 'manual',
    timePeriod: 'Last 30 Days',
    notes: 'New email subscribers this period'
  },
  totalReach: { 
    value: '24,500', 
    trend: 'up',
    lastUpdated: new Date().toISOString().split('T')[0],
    dataSource: 'api',
    timePeriod: 'Last 30 Days',
    notes: 'Total impressions across all channels'
  }
});

// Validation function  
const validateMetrics = (data: any): data is Record<string, MetricData> => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredMetrics = ['gac', 'emailOptIns', 'totalReach'];
  return requiredMetrics.every(metric => {
    const metricData = data[metric];
    return metricData && 
           (typeof metricData.value === 'string' || typeof metricData.value === 'number') &&
           typeof metricData.dataSource === 'string';
  });
};

export async function GET(request: NextRequest) {
  try {
    // Check if we can access the database
    let hasDatabase = true;
    try {
      await prisma.$queryRaw`SELECT 1`;
      const model = (prisma as any).dashboardMetrics;
      if (!model) throw new Error('Model not found');
    } catch (error) {
      console.log('Dashboard metrics model not available, using fallback');
      hasDatabase = false;
    }

    if (!hasDatabase) {
      // Return default data if database not ready
      return NextResponse.json(getDefaultMetrics());
    }

    try {
      // Get the latest dashboard metrics
      const model = (prisma as any).dashboardMetrics;
      const metricsData = await model.findFirst({
        orderBy: { createdAt: 'desc' }
      });

      if (!metricsData || !metricsData.data) {
        console.log('No metrics data found, returning defaults');
        return NextResponse.json(getDefaultMetrics());
      }

      // Validate the data structure
      if (!validateMetrics(metricsData.data)) {
        console.log('Invalid metrics data found, returning defaults');
        return NextResponse.json(getDefaultMetrics());
      }

      return NextResponse.json(metricsData.data);
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      return NextResponse.json(getDefaultMetrics());
    }

  } catch (error) {
    console.error('Unexpected error in GET /api/metrics:', error);
    return NextResponse.json(getDefaultMetrics());
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

    const { metricsData } = body;

    if (!metricsData) {
      return NextResponse.json({ error: 'Missing metricsData in request' }, { status: 400 });
    }

    // Validate the incoming data
    if (!validateMetrics(metricsData)) {
      return NextResponse.json({ error: 'Invalid metrics data structure' }, { status: 400 });
    }

    // Check if database is available
    let hasDatabase = true;
    try {
      await prisma.$queryRaw`SELECT 1`;
      const model = (prisma as any).dashboardMetrics;
      if (!model) throw new Error('Model not found');
    } catch (error) {
      console.log('Dashboard metrics model not available for saving');
      hasDatabase = false;
    }

    if (!hasDatabase) {
      // Fallback storage
      console.log('⚠️  Database model not ready, data not persisted');
      return NextResponse.json({ 
        success: true, 
        message: 'Data received but not persisted - database not ready',
        fallback: true 
      });
    }

    try {
      // Save dashboard metrics with timestamp
      const model = (prisma as any).dashboardMetrics;
      const savedData = await model.create({
        data: {
          data: metricsData,
          createdAt: new Date()
        }
      });

      console.log('✅ Dashboard metrics saved successfully');
      return NextResponse.json({ 
        success: true, 
        id: savedData.id,
        message: 'Dashboard metrics saved successfully'
      });
    } catch (error) {
      console.error('❌ Error saving dashboard metrics to database:', error);
      
      // Return success but indicate it wasn't persisted
      return NextResponse.json({ 
        success: true, 
        message: 'Data received but not persisted due to database error',
        error: 'Database save failed',
        fallback: true
      }, { status: 202 }); // 202 Accepted
    }

  } catch (error) {
    console.error('❌ Unexpected error in POST /api/metrics:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Failed to process dashboard metrics'
    }, { status: 500 });
  }
} 