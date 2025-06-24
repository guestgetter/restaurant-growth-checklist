import { NextRequest, NextResponse } from 'next/server';
import { GoogleAnalyticsService } from '../../../../lib/googleAnalyticsService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId') || '392071184';

    console.log('Testing Google Analytics with property ID:', propertyId);

    // Initialize Google Analytics service
    const analyticsService = new GoogleAnalyticsService();

    // Check if service is configured
    const isConfigured = analyticsService.isConfigured();
    console.log('Analytics service configured:', isConfigured);

    if (!isConfigured) {
      return NextResponse.json({
        error: 'Google Analytics service not configured',
        configured: false,
        propertyId,
      });
    }

    // Try to get properties first
    try {
      console.log('Attempting to fetch Analytics properties...');
      const properties = await analyticsService.getAnalyticsProperties();
      console.log('Found properties:', properties);

      return NextResponse.json({
        success: true,
        configured: true,
        propertyId,
        properties,
        message: 'Successfully fetched Analytics properties',
      });
    } catch (propertiesError) {
      console.error('Error fetching properties:', propertiesError);

      // Try to make a simple API call to the specific property
      try {
        console.log('Attempting direct API call to property:', propertyId);
        
        const dateRange = {
          startDate: '2024-06-01',
          endDate: '2024-06-22',
        };

        const trafficSources = await analyticsService.getTrafficSources(propertyId, dateRange);
        
        return NextResponse.json({
          success: true,
          configured: true,
          propertyId,
          trafficSources,
          message: 'Successfully fetched traffic sources data',
        });
      } catch (apiError) {
        console.error('Error with direct API call:', apiError);
        
        return NextResponse.json({
          error: 'API call failed',
          configured: true,
          propertyId,
          propertiesError: propertiesError instanceof Error ? propertiesError.message : String(propertiesError),
          apiError: apiError instanceof Error ? apiError.message : String(apiError),
        }, { status: 500 });
      }
    }

  } catch (error) {
    console.error('Error in Google Analytics test:', error);
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 