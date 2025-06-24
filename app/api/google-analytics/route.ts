import { NextRequest, NextResponse } from 'next/server';
import { GoogleAnalyticsService } from '../../../lib/googleAnalyticsService';
import { prisma } from '../../../lib/prisma';

// Demo data for when API is not configured
const generateDemoAnalyticsData = () => {
  return {
    demo: true,
    insights: {
      totalSessions: 15420,
      totalUsers: 12340,
      newUsers: 8920,
      returningUsers: 3420,
      avgSessionDuration: 142.5,
      bounceRate: 45.2,
      conversionRate: 3.8,
      totalRevenue: 28450.75,
      
      menuPageViews: 4820,
      locationPageViews: 2150,
      reservationConversions: 285,
      orderOnlineConversions: 420,
      phoneCallConversions: 180,
      directionsRequests: 890,
      
      topTrafficSources: [
        {
          source: 'google',
          medium: 'organic',
          sessions: 6850,
          users: 5420,
          newUsers: 3890,
          bounceRate: 42.1,
          avgSessionDuration: 156.3,
          conversions: 195,
          conversionRate: 2.8,
          revenue: 12450.25
        },
        {
          source: 'facebook',
          medium: 'social',
          sessions: 2340,
          users: 1980,
          newUsers: 1650,
          bounceRate: 52.8,
          avgSessionDuration: 98.7,
          conversions: 78,
          conversionRate: 3.3,
          revenue: 4850.50
        },
        {
          source: 'google',
          medium: 'cpc',
          sessions: 1850,
          users: 1620,
          newUsers: 1420,
          bounceRate: 38.5,
          avgSessionDuration: 178.2,
          conversions: 89,
          conversionRate: 4.8,
          revenue: 6720.75
        },
        {
          source: 'direct',
          medium: '(none)',
          sessions: 3200,
          users: 2180,
          newUsers: 890,
          bounceRate: 35.2,
          avgSessionDuration: 198.4,
          conversions: 142,
          conversionRate: 4.4,
          revenue: 8950.25
        },
        {
          source: 'instagram',
          medium: 'social',
          sessions: 1180,
          users: 980,
          newUsers: 820,
          bounceRate: 58.3,
          avgSessionDuration: 85.6,
          conversions: 32,
          conversionRate: 2.7,
          revenue: 1890.75
        }
      ],
      
      organicSearchPerformance: {
        sessions: 6850,
        users: 5420,
        conversions: 195,
        conversionRate: 2.8,
        avgSessionDuration: 156.3
      },
      
      paidSearchPerformance: {
        sessions: 1850,
        users: 1620,
        conversions: 89,
        conversionRate: 4.8,
        avgSessionDuration: 178.2,
        cost: 2450.50
      },
      
      socialMediaPerformance: {
        sessions: 3520,
        users: 2960,
        conversions: 110,
        topPlatforms: [
          { platform: 'facebook', sessions: 2340, conversions: 78 },
          { platform: 'instagram', sessions: 1180, conversions: 32 }
        ]
      },
      
      topPerformingPages: [
        {
          pagePath: '/',
          pageTitle: 'Home - Toboggan Brewing Company',
          pageViews: 8920,
          uniquePageViews: 7450,
          avgTimeOnPage: 145.2,
          entrances: 6850,
          bounceRate: 42.1,
          exitRate: 28.5,
          conversions: 185,
          conversionValue: 8950.25
        },
        {
          pagePath: '/menu',
          pageTitle: 'Menu - Toboggan Brewing Company',
          pageViews: 4820,
          uniquePageViews: 3890,
          avgTimeOnPage: 198.7,
          entrances: 1250,
          bounceRate: 35.8,
          exitRate: 22.4,
          conversions: 142,
          conversionValue: 6720.50
        },
        {
          pagePath: '/location',
          pageTitle: 'Location & Hours - Toboggan Brewing Company',
          pageViews: 2150,
          uniquePageViews: 1890,
          avgTimeOnPage: 89.4,
          entrances: 890,
          bounceRate: 48.2,
          exitRate: 35.7,
          conversions: 68,
          conversionValue: 2450.75
        },
        {
          pagePath: '/events',
          pageTitle: 'Events - Toboggan Brewing Company',
          pageViews: 1820,
          uniquePageViews: 1520,
          avgTimeOnPage: 156.8,
          entrances: 420,
          bounceRate: 52.3,
          exitRate: 28.9,
          conversions: 45,
          conversionValue: 1890.25
        }
      ],
      
      menuPerformance: [
        {
          pagePath: '/menu',
          pageTitle: 'Menu - Toboggan Brewing Company',
          pageViews: 4820,
          uniquePageViews: 3890,
          avgTimeOnPage: 198.7,
          entrances: 1250,
          bounceRate: 35.8,
          exitRate: 22.4,
          conversions: 142,
          conversionValue: 6720.50
        },
        {
          pagePath: '/menu/appetizers',
          pageTitle: 'Appetizers - Toboggan Brewing Company',
          pageViews: 1420,
          uniquePageViews: 1180,
          avgTimeOnPage: 125.4,
          entrances: 280,
          bounceRate: 41.2,
          exitRate: 18.5,
          conversions: 52,
          conversionValue: 1950.25
        }
      ],
      
      locationPerformance: [
        {
          pagePath: '/location',
          pageTitle: 'Location & Hours - Toboggan Brewing Company',
          pageViews: 2150,
          uniquePageViews: 1890,
          avgTimeOnPage: 89.4,
          entrances: 890,
          bounceRate: 48.2,
          exitRate: 35.7,
          conversions: 68,
          conversionValue: 2450.75
        },
        {
          pagePath: '/contact',
          pageTitle: 'Contact Us - Toboggan Brewing Company',
          pageViews: 980,
          uniquePageViews: 820,
          avgTimeOnPage: 78.2,
          entrances: 350,
          bounceRate: 55.8,
          exitRate: 42.1,
          conversions: 28,
          conversionValue: 890.50
        }
      ]
    }
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const dateRange = searchParams.get('dateRange') || '30';
    const propertyId = searchParams.get('propertyId');

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    // Debug environment variables
    console.log('🔍 Google Analytics API Debug:');
    console.log('- Environment:', process.env.NODE_ENV);
    console.log('- Vercel Environment:', process.env.VERCEL_ENV);
    console.log('- GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('- GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
    console.log('- GOOGLE_REFRESH_TOKEN exists:', !!process.env.GOOGLE_REFRESH_TOKEN);
    console.log('- GOOGLE_CLIENT_ID preview:', process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'MISSING');
    console.log('- GOOGLE_REFRESH_TOKEN preview:', process.env.GOOGLE_REFRESH_TOKEN ? process.env.GOOGLE_REFRESH_TOKEN.substring(0, 20) + '...' : 'MISSING');
    console.log('- Client ID requested:', clientId);
    console.log('- Property ID from query:', propertyId);

    // Initialize Google Analytics service
    console.log('Initializing Google Analytics service...');
    const analyticsService = new GoogleAnalyticsService();

    // Check if service is configured
    const isConfigured = analyticsService.isConfigured();
    console.log('Google Analytics service configured:', isConfigured);
    
    if (!isConfigured) {
      console.log('❌ Google Analytics API not configured - missing environment variables');
      const demoData = generateDemoAnalyticsData();
      return NextResponse.json({
        ...demoData,
        configurationStatus: {
          issue: 'Google Analytics API credentials not configured properly',
          hasEnvironmentVariables: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN),
          debugInfo: {
            clientIdExists: !!process.env.GOOGLE_CLIENT_ID,
            clientSecretExists: !!process.env.GOOGLE_CLIENT_SECRET,
            refreshTokenExists: !!process.env.GOOGLE_REFRESH_TOKEN,
            environment: process.env.NODE_ENV,
            vercelEnv: process.env.VERCEL_ENV
          },
          message: 'Contact system administrator to configure Google Analytics API credentials'
        }
      });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(dateRange));

    const dateRangeObj = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    // Get Analytics Property ID - either from query param or client database
    let analyticsPropertyId = propertyId;
    let clientData = null;
    
    if (!analyticsPropertyId && clientId !== 'demo') {
      try {
        console.log('🔍 Fetching client data from database for clientId:', clientId);
        
        // Fetch client data to get Google Analytics Property ID
        clientData = await prisma.client.findUnique({
          where: { id: clientId },
          select: { 
            id: true,
            name: true, 
            googleAnalyticsPropertyId: true,
            googleAdsCustomerId: true 
          }
        });
        
        console.log('📊 Client data from database:', {
          id: clientData?.id,
          name: clientData?.name,
          hasAnalyticsPropertyId: !!clientData?.googleAnalyticsPropertyId,
          analyticsPropertyId: clientData?.googleAnalyticsPropertyId,
          googleAdsCustomerId: clientData?.googleAdsCustomerId,
          fullClientData: clientData
        });
        
        if (clientData?.googleAnalyticsPropertyId) {
          analyticsPropertyId = clientData.googleAnalyticsPropertyId;
          console.log(`✅ Using Analytics Property ID ${analyticsPropertyId} for client: ${clientData.name}`);
        } else {
          console.log(`❌ No Analytics Property ID configured for client: ${clientData?.name || clientId}`);
          console.log('📝 Client has googleAdsCustomerId:', clientData?.googleAdsCustomerId);
        }
      } catch (dbError) {
        console.error('❌ Error fetching client Analytics Property ID:', dbError);
      }
    }

    if (!analyticsPropertyId) {
      console.log('❌ No Analytics Property ID available - returning demo data');
      const demoData = generateDemoAnalyticsData();
      return NextResponse.json({
        ...demoData,
        configurationStatus: {
          issue: 'Google Analytics Property ID not configured for this client',
          clientName: clientData?.name || `Client ${clientId}`,
          clientData: clientData,
          message: 'Go to Settings → Client Management and add a Google Analytics Property ID for this client',
          suggestedPropertyId: '392071184 (Chef On Call)',
          hasApiCredentials: true
        }
      });
    }

    try {
      console.log(`🚀 Fetching real Google Analytics data for property ${analyticsPropertyId}...`);
      console.log('📊 Using date range:', dateRangeObj);
      
      // Fetch real Analytics data
      const insights = await analyticsService.getRestaurantAnalyticsInsights(
        analyticsPropertyId,
        dateRangeObj
      );

      console.log('✅ Successfully fetched real Google Analytics data!');
      console.log('📈 Data summary:', {
        totalSessions: insights.totalSessions,
        totalUsers: insights.totalUsers,
        totalRevenue: insights.totalRevenue
      });

      return NextResponse.json({
        demo: false,
        insights,
        dateRange: dateRangeObj,
        propertyId: analyticsPropertyId,
        clientName: clientData?.name,
        dataSource: 'Real Google Analytics API'
      });

    } catch (apiError) {
      console.error('❌ Google Analytics API error:', apiError);
      console.error('❌ Full error details:', {
        message: apiError instanceof Error ? apiError.message : 'Unknown API error',
        stack: apiError instanceof Error ? apiError.stack : 'No stack trace',
        propertyId: analyticsPropertyId
      });
      
      // Return demo data if API fails with helpful error message
      const demoData = generateDemoAnalyticsData();
      return NextResponse.json({
        ...demoData,
        configurationStatus: {
          issue: 'Google Analytics API call failed',
          propertyId: analyticsPropertyId,
          error: apiError instanceof Error ? apiError.message : 'Unknown API error',
          fullError: apiError instanceof Error ? apiError.stack : 'No error details',
          message: 'Returning demo data due to API error'
        }
      });
    }

  } catch (error) {
    console.error('❌ Error in Google Analytics API route:', error);
    
    return NextResponse.json({
      ...generateDemoAnalyticsData(),
      configurationStatus: {
        issue: 'Service temporarily unavailable',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Returning demo data due to service error'
      }
    });
  }
} 