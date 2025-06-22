import { NextRequest, NextResponse } from 'next/server';
import { GoogleSearchConsoleService } from '../../../lib/googleSearchConsoleService';

// Demo data for when API is not configured
const generateDemoSearchConsoleData = () => {
  return {
    demo: true,
    insights: {
      totalImpressions: 45280,
      totalClicks: 2890,
      averageCTR: 6.4,
      averagePosition: 12.8,
      
      restaurantNameQueries: [
        { query: 'toboggan brewing company', impressions: 3420, clicks: 890, ctr: 26.0, position: 2.1 },
        { query: 'toboggan brewery', impressions: 1850, clicks: 420, ctr: 22.7, position: 3.2 },
        { query: 'toboggan restaurant', impressions: 980, clicks: 180, ctr: 18.4, position: 4.8 }
      ],
      
      locationQueries: [
        { query: 'brewery near me', impressions: 8920, clicks: 320, ctr: 3.6, position: 18.5 },
        { query: 'restaurants near me', impressions: 6750, clicks: 245, ctr: 3.6, position: 22.3 },
        { query: 'toboggan brewing location', impressions: 1420, clicks: 185, ctr: 13.0, position: 5.2 },
        { query: 'brewery downtown', impressions: 2340, clicks: 98, ctr: 4.2, position: 15.7 }
      ],
      
      menuQueries: [
        { query: 'toboggan brewing menu', impressions: 2150, clicks: 285, ctr: 13.3, position: 4.1 },
        { query: 'brewery food menu', impressions: 1890, clicks: 68, ctr: 3.6, position: 19.8 },
        { query: 'craft beer food pairing', impressions: 980, clicks: 42, ctr: 4.3, position: 16.2 },
        { query: 'brewery appetizers', impressions: 1250, clicks: 35, ctr: 2.8, position: 24.1 }
      ],
      
      cuisineQueries: [
        { query: 'american brewery food', impressions: 3420, clicks: 89, ctr: 2.6, position: 28.5 },
        { query: 'craft beer restaurant', impressions: 2890, clicks: 78, ctr: 2.7, position: 26.8 },
        { query: 'pub food', impressions: 4250, clicks: 125, ctr: 2.9, position: 25.3 }
      ],
      
      reservationQueries: [
        { query: 'toboggan brewing reservations', impressions: 890, clicks: 142, ctr: 16.0, position: 3.8 },
        { query: 'brewery table booking', impressions: 650, clicks: 28, ctr: 4.3, position: 18.9 },
        { query: 'restaurant reservations', impressions: 1420, clicks: 45, ctr: 3.2, position: 21.5 }
      ],
      
      topPages: [
        { page: 'https://tobogganbrew.com/', impressions: 12450, clicks: 890, ctr: 7.1, position: 8.5 },
        { page: 'https://tobogganbrew.com/menu', impressions: 8920, clicks: 680, ctr: 7.6, position: 6.2 },
        { page: 'https://tobogganbrew.com/location', impressions: 4250, clicks: 320, ctr: 7.5, position: 7.8 },
        { page: 'https://tobogganbrew.com/events', impressions: 3180, clicks: 185, ctr: 5.8, position: 12.3 },
        { page: 'https://tobogganbrew.com/about', impressions: 2890, clicks: 142, ctr: 4.9, position: 15.7 }
      ],
      
      menuPages: [
        { page: 'https://tobogganbrew.com/menu', impressions: 8920, clicks: 680, ctr: 7.6, position: 6.2 },
        { page: 'https://tobogganbrew.com/menu/appetizers', impressions: 1850, clicks: 98, ctr: 5.3, position: 11.8 },
        { page: 'https://tobogganbrew.com/menu/entrees', impressions: 1420, clicks: 78, ctr: 5.5, position: 10.9 }
      ],
      
      locationPages: [
        { page: 'https://tobogganbrew.com/location', impressions: 4250, clicks: 320, ctr: 7.5, position: 7.8 },
        { page: 'https://tobogganbrew.com/contact', impressions: 1890, clicks: 125, ctr: 6.6, position: 9.2 }
      ],
      
      topCountries: [
        { country: 'usa', impressions: 38920, clicks: 2450, ctr: 6.3, position: 12.1 },
        { country: 'can', impressions: 4250, clicks: 285, ctr: 6.7, position: 11.8 },
        { country: 'gbr', impressions: 1890, clicks: 125, ctr: 6.6, position: 13.5 },
        { country: 'aus', impressions: 220, clicks: 30, ctr: 13.6, position: 8.9 }
      ],
      
      localSearchPerformance: {
        impressions: 18920,
        clicks: 1285,
        ctr: 6.8,
        position: 8.9
      },
      
      deviceBreakdown: [
        { device: 'mobile', impressions: 28450, clicks: 1890, ctr: 6.6, position: 13.2 },
        { device: 'desktop', impressions: 14250, clicks: 850, ctr: 6.0, position: 11.8 },
        { device: 'tablet', impressions: 2580, clicks: 150, ctr: 5.8, position: 14.5 }
      ],
      
      searchAppearanceData: [],
      trendingQueries: [],
      
      indexingStatus: {
        indexedPages: 45,
        blockedPages: 2,
        errorPages: 1
      },
      
      localBusinessQueries: [
        { query: 'toboggan brewing hours', impressions: 1420, clicks: 185, ctr: 13.0, position: 4.2 },
        { query: 'brewery phone number', impressions: 890, clicks: 98, ctr: 11.0, position: 5.8 },
        { query: 'toboggan brewing reviews', impressions: 1250, clicks: 78, ctr: 6.2, position: 8.9 }
      ],
      
      directionsQueries: [
        { query: 'toboggan brewing directions', impressions: 980, clicks: 142, ctr: 14.5, position: 3.8 },
        { query: 'how to get to toboggan brewery', impressions: 420, clicks: 35, ctr: 8.3, position: 7.2 }
      ],
      
      hoursQueries: [
        { query: 'toboggan brewing hours', impressions: 1420, clicks: 185, ctr: 13.0, position: 4.2 },
        { query: 'brewery open hours', impressions: 650, clicks: 45, ctr: 6.9, position: 9.8 }
      ],
      
      phoneQueries: [
        { query: 'toboggan brewing phone', impressions: 520, clicks: 68, ctr: 13.1, position: 4.5 },
        { query: 'brewery contact number', impressions: 380, clicks: 28, ctr: 7.4, position: 8.2 }
      ]
    }
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const dateRange = searchParams.get('dateRange') || '30';
    const siteUrl = searchParams.get('siteUrl');

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    // Initialize Google Search Console service
    const searchConsoleService = new GoogleSearchConsoleService();

    // Check if service is configured
    if (!searchConsoleService.isConfigured()) {
      console.log('Google Search Console API not configured, returning demo data');
      return NextResponse.json(generateDemoSearchConsoleData());
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(dateRange));

    const dateRangeObj = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    // Use provided site URL or try to determine from client data
    let searchConsoleSiteUrl = siteUrl;
    
    if (!searchConsoleSiteUrl) {
      // Try to get site URL from environment or client configuration
      searchConsoleSiteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || null;
    }

    if (!searchConsoleSiteUrl) {
      console.log('No Search Console site URL configured, returning demo data');
      return NextResponse.json(generateDemoSearchConsoleData());
    }

    try {
      // Fetch real Search Console data
      const insights = await searchConsoleService.getRestaurantSearchInsights(
        searchConsoleSiteUrl,
        dateRangeObj
      );

      return NextResponse.json({
        demo: false,
        insights,
        dateRange: dateRangeObj,
        siteUrl: searchConsoleSiteUrl,
      });

    } catch (apiError) {
      console.error('Google Search Console API error:', apiError);
      
      // Return demo data if API fails
      return NextResponse.json({
        ...generateDemoSearchConsoleData(),
        error: 'API temporarily unavailable, showing demo data',
      });
    }

  } catch (error) {
    console.error('Error in Google Search Console API route:', error);
    
    return NextResponse.json({
      ...generateDemoSearchConsoleData(),
      error: 'Service temporarily unavailable, showing demo data',
    });
  }
} 