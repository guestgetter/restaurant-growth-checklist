import { NextRequest, NextResponse } from 'next/server';

// Demo data for Google Business Profile
const DEMO_BUSINESS_PROFILE_DATA = {
  location: {
    name: 'Toboggan Brewing Company',
    locationId: 'locations/demo-toboggan-brewing',
    address: '125 N Larch St, Sisters, OR 97759',
    category: 'Brewery Restaurant',
    phoneNumber: '(541) 549-8321',
    website: 'https://tobogganbrew.com',
    verified: true
  },
  metrics: {
    totalViews: 2847,
    searchViews: 1698,
    mapsViews: 1149,
    mobileViews: 1992,
    desktopViews: 855,
    websiteClicks: 234,
    phoneClicks: 156,
    directionRequests: 189,
    totalSearches: 2847,
    directSearches: 854,
    discoverySearches: 1139,
    brandedSearches: 854,
    totalReviews: 127,
    averageRating: 4.6,
    newReviews: 8,
    menuViews: 456,
    reservationClicks: 67,
    orderClicks: 89,
    photosViewed: 1234,
    date: new Date().toISOString().split('T')[0],
    period: 'monthly' as const
  },
  searchKeywords: [
    { keyword: 'toboggan brewing sisters', impressions: 234, category: 'restaurant_name', trend: 'up' },
    { keyword: 'brewery sisters oregon', impressions: 189, category: 'location', trend: 'stable' },
    { keyword: 'craft beer sisters', impressions: 167, category: 'cuisine_type', trend: 'up' },
    { keyword: 'restaurant sisters oregon', impressions: 145, category: 'location', trend: 'stable' },
    { keyword: 'toboggan menu', impressions: 123, category: 'menu_items', trend: 'up' },
    { keyword: 'brewery food near me', impressions: 98, category: 'general', trend: 'down' },
    { keyword: 'sisters dining', impressions: 87, category: 'location', trend: 'stable' },
    { keyword: 'craft brewery central oregon', impressions: 76, category: 'cuisine_type', trend: 'up' },
    { keyword: 'local brewery', impressions: 65, category: 'general', trend: 'stable' },
    { keyword: 'toboggan beer', impressions: 54, category: 'restaurant_name', trend: 'up' }
  ],
  reviews: {
    recentReviews: [
      {
        id: '1',
        author: 'Sarah M.',
        rating: 5,
        text: 'Amazing craft beer selection and the food was outstanding! The atmosphere is perfect for a night out.',
        date: '2024-06-15',
        response: 'Thank you Sarah! We\'re thrilled you enjoyed your experience with us.'
      },
      {
        id: '2',
        author: 'Mike R.',
        rating: 4,
        text: 'Great local brewery with excellent service. The burger was delicious and beer was fresh.',
        date: '2024-06-12',
        response: null
      },
      {
        id: '3',
        author: 'Jennifer L.',
        rating: 5,
        text: 'Perfect spot for lunch! The staff was friendly and the outdoor seating area is beautiful.',
        date: '2024-06-10',
        response: 'Thanks Jennifer! We love our outdoor space too!'
      }
    ],
    reviewSummary: {
      totalReviews: 127,
      averageRating: 4.6,
      ratingDistribution: {
        5: 78,
        4: 32,
        3: 12,
        2: 3,
        1: 2
      },
      responseRate: 0.85,
      averageResponseTime: '2 days'
    }
  },
  competitorComparison: {
    averageViews: 2156,
    averageRating: 4.3,
    industryBenchmark: 'Above Average',
    marketPosition: 'Top 15%',
    localRanking: 2
  },
  insights: {
    peakHours: [
      { hour: '12:00', day: 'Saturday', views: 45 },
      { hour: '18:00', day: 'Friday', views: 42 },
      { hour: '13:00', day: 'Sunday', views: 38 },
      { hour: '19:00', day: 'Saturday', views: 36 }
    ],
    topPhotos: [
      { type: 'Food', views: 456, engagement: 'High' },
      { type: 'Interior', views: 342, engagement: 'Medium' },
      { type: 'Exterior', views: 298, engagement: 'Medium' },
      { type: 'Beer Selection', views: 234, engagement: 'High' }
    ],
    seasonalTrends: {
      currentMonth: 'June',
      monthlyGrowth: '+12%',
      yearOverYear: '+28%',
      peakSeason: 'Summer (June-August)'
    }
  },
  recommendations: [
    'Your mobile traffic is 70% of total views - ensure your mobile profile is fully optimized',
    'Strong branded search performance - continue building brand awareness',
    'Menu-related searches are trending up - consider adding more menu photos and posts',
    'Direction requests are healthy - your location visibility is strong',
    'Phone clicks suggest customers prefer calling - ensure your phone number is prominent',
    'Consider responding to more reviews to improve engagement (current response rate: 85%)',
    'Peak hours show strong weekend traffic - consider weekend promotions',
    'Food photos generate highest engagement - add more menu item photos'
  ],
  lastUpdated: new Date().toISOString(),
  demoMode: true
};

// Historical data for trends (last 6 months)
const DEMO_HISTORICAL_DATA = {
  monthlyMetrics: [
    { month: 'January', views: 2156, actions: 432, rating: 4.5 },
    { month: 'February', views: 2298, actions: 456, rating: 4.5 },
    { month: 'March', views: 2445, actions: 489, rating: 4.6 },
    { month: 'April', views: 2567, actions: 513, rating: 4.6 },
    { month: 'May', views: 2698, actions: 539, rating: 4.6 },
    { month: 'June', views: 2847, actions: 579, rating: 4.6 }
  ],
  keywordTrends: [
    { keyword: 'toboggan brewing', jan: 180, feb: 195, mar: 210, apr: 225, may: 230, jun: 234 },
    { keyword: 'brewery sisters', jan: 145, feb: 158, mar: 167, apr: 175, may: 182, jun: 189 },
    { keyword: 'craft beer sisters', jan: 120, feb: 135, mar: 145, apr: 155, may: 162, jun: 167 }
  ]
};

function getDateRangeData(dateRange: string) {
  const baseData = { ...DEMO_BUSINESS_PROFILE_DATA };
  
  // Adjust metrics based on date range
  switch (dateRange) {
    case '7d':
      baseData.metrics.totalViews = Math.floor(baseData.metrics.totalViews * 0.25);
      baseData.metrics.searchViews = Math.floor(baseData.metrics.searchViews * 0.25);
      baseData.metrics.mapsViews = Math.floor(baseData.metrics.mapsViews * 0.25);
      break;
    case '30d':
      // Use base data as is
      break;
    case '90d':
      baseData.metrics.totalViews = Math.floor(baseData.metrics.totalViews * 3);
      baseData.metrics.searchViews = Math.floor(baseData.metrics.searchViews * 3);
      baseData.metrics.mapsViews = Math.floor(baseData.metrics.mapsViews * 3);
      break;
    case '6m':
      baseData.metrics.totalViews = Math.floor(baseData.metrics.totalViews * 6);
      baseData.metrics.searchViews = Math.floor(baseData.metrics.searchViews * 6);
      baseData.metrics.mapsViews = Math.floor(baseData.metrics.mapsViews * 6);
      break;
    case '12m':
      baseData.metrics.totalViews = Math.floor(baseData.metrics.totalViews * 12);
      baseData.metrics.searchViews = Math.floor(baseData.metrics.searchViews * 12);
      baseData.metrics.mapsViews = Math.floor(baseData.metrics.mapsViews * 12);
      break;
    case '18m':
      baseData.metrics.totalViews = Math.floor(baseData.metrics.totalViews * 18);
      baseData.metrics.searchViews = Math.floor(baseData.metrics.searchViews * 18);
      baseData.metrics.mapsViews = Math.floor(baseData.metrics.mapsViews * 18);
      break;
  }
  
  // Recalculate dependent metrics
  baseData.metrics.websiteClicks = Math.floor(baseData.metrics.totalViews * 0.082);
  baseData.metrics.phoneClicks = Math.floor(baseData.metrics.totalViews * 0.055);
  baseData.metrics.directionRequests = Math.floor(baseData.metrics.totalViews * 0.066);
  
  return baseData;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || 'toboggan-brewing';
    const dateRange = searchParams.get('dateRange') || '30d';
    const includeHistorical = searchParams.get('includeHistorical') === 'true';

    console.log('Google Business Profile API not configured, returning demo data');

    // Get data adjusted for date range
    const businessProfileData = getDateRangeData(dateRange);
    
    // Add historical data if requested
    if (includeHistorical) {
      (businessProfileData as any).historicalData = DEMO_HISTORICAL_DATA;
    }

    // Add metadata about the API response
    const responseData = {
      ...businessProfileData,
      metadata: {
        clientId,
        dateRange,
        dataSource: 'demo',
        apiVersion: 'v1',
        lastRefresh: new Date().toISOString(),
        dataRetention: '18 months available via API (vs 6 months in dashboard)',
        capabilities: [
          'Historical data up to 18 months',
          'Daily metrics aggregation',
          'Search keyword analysis',
          'Customer action tracking',
          'Review monitoring',
          'Competitor benchmarking',
          'Mobile vs desktop breakdown',
          'Maps vs search performance'
        ]
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Google Business Profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business profile data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, locationId, data } = body;

    // Handle different actions (for future real API integration)
    switch (action) {
      case 'updateProfile':
        return NextResponse.json({ 
          success: true, 
          message: 'Profile updated successfully (demo mode)',
          updatedFields: Object.keys(data || {})
        });
      
      case 'respondToReview':
        return NextResponse.json({ 
          success: true, 
          message: 'Review response posted successfully (demo mode)',
          reviewId: data?.reviewId
        });
      
      case 'createPost':
        return NextResponse.json({ 
          success: true, 
          message: 'Post created successfully (demo mode)',
          postId: `post_${Date.now()}`
        });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Google Business Profile API POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 