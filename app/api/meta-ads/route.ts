import { NextRequest, NextResponse } from 'next/server';
import { metaAdsService } from '../../../lib/metaAdsService';

// Demo data for Meta Ads when API is not configured
const generateDemoMetaData = () => {
  return {
    demo: true,
    campaigns: [
      {
        campaignId: 'demo_meta_1',
        campaignName: 'Pizza Palace - Local Awareness',
        campaignObjective: 'REACH',
        status: 'ACTIVE',
        impressions: 15420,
        clicks: 342,
        spend: 245.67,
        conversions: 18,
        costPerResult: 13.65,
        ctr: 2.22,
        cpc: 0.72,
        frequency: 2.1,
        reach: 7350,
        socialSpend: 45.23,
        videoViews: 892
      },
      {
        campaignId: 'demo_meta_2',
        campaignName: 'Pizza Palace - Weekend Special',
        campaignObjective: 'CONVERSIONS',
        status: 'ACTIVE',
        impressions: 8965,
        clicks: 256,
        spend: 189.34,
        conversions: 24,
        costPerResult: 7.89,
        ctr: 2.86,
        cpc: 0.74,
        frequency: 1.8,
        reach: 4980,
        socialSpend: 32.15,
        videoViews: 0
      },
      {
        campaignId: 'demo_meta_3',
        campaignName: 'Pizza Palace - Happy Hour',
        campaignObjective: 'TRAFFIC',
        status: 'ACTIVE',
        impressions: 12340,
        clicks: 198,
        spend: 156.78,
        conversions: 12,
        costPerResult: 13.06,
        ctr: 1.60,
        cpc: 0.79,
        frequency: 2.5,
        reach: 4936,
        socialSpend: 28.90,
        videoViews: 445
      }
    ],
    adSets: [
      {
        adSetId: 'demo_adset_1',
        adSetName: 'Local Food Lovers',
        campaignName: 'Pizza Palace - Local Awareness',
        targeting: 'Ages 25-45 | Gender: All | Cities: 3 locations',
        impressions: 8200,
        clicks: 185,
        spend: 134.50,
        conversions: 9,
        ctr: 2.26,
        cpc: 0.73,
        frequency: 2.0,
        reach: 4100
      },
      {
        adSetId: 'demo_adset_2',
        adSetName: 'Weekend Diners',
        campaignName: 'Pizza Palace - Weekend Special',
        targeting: 'Ages 28-55 | Gender: All | Cities: 2 locations',
        impressions: 5640,
        clicks: 145,
        spend: 112.25,
        conversions: 15,
        ctr: 2.57,
        cpc: 0.77,
        frequency: 1.7,
        reach: 3318
      }
    ],
    insights: {
      totalSpend: 591.79,
      totalConversions: 54,
      averageCostPerResult: 10.96,
      reachVsFrequency: { reach: 17266, frequency: 2.1 },
      topPerformingCampaigns: [
        {
          campaignId: 'demo_meta_2',
          campaignName: 'Pizza Palace - Weekend Special',
          campaignObjective: 'CONVERSIONS',
          status: 'ACTIVE',
          impressions: 8965,
          clicks: 256,
          spend: 189.34,
          conversions: 24,
          costPerResult: 7.89,
          ctr: 2.86,
          cpc: 0.74,
          frequency: 1.8,
          reach: 4980,
          socialSpend: 32.15,
          videoViews: 0
        }
      ],
      audienceInsights: {
        demographics: {
          age: [
            { ageRange: '25-34', percentage: 38 },
            { ageRange: '35-44', percentage: 31 },
            { ageRange: '45-54', percentage: 20 },
            { ageRange: '18-24', percentage: 11 }
          ],
          gender: [
            { gender: 'Female', percentage: 56 },
            { gender: 'Male', percentage: 44 }
          ]
        },
        interests: [
          { interest: 'Food & Dining', affinity: 2.3 },
          { interest: 'Local Events', affinity: 1.9 },
          { interest: 'Family Activities', affinity: 1.7 },
          { interest: 'Pizza', affinity: 2.8 }
        ],
        placements: [
          { placement: 'Facebook Feed', impressions: 18500, spend: 345.67 },
          { placement: 'Instagram Feed', impressions: 12200, spend: 198.45 },
          { placement: 'Instagram Stories', impressions: 6025, spend: 47.67 }
        ],
        locations: [
          { location: 'Downtown', impressions: 15400, spend: 289.34 },
          { location: 'Suburbs', impressions: 12850, spend: 201.12 },
          { location: 'University Area', impressions: 8475, spend: 101.33 }
        ]
      },
      platformBreakdown: {
        facebook: { spend: 355.07, conversions: 32 },
        instagram: { spend: 207.54, conversions: 19 },
        messenger: { spend: 17.75, conversions: 2 },
        audienceNetwork: { spend: 11.43, conversions: 1 }
      },
      bestPerformingContent: [
        {
          adId: 'demo_ad_1',
          adName: 'Weekend Pizza Special - Video',
          engagement: 245,
          conversions: 15,
          spend: 89.45
        },
        {
          adId: 'demo_ad_2',  
          adName: 'Happy Hour Deal - Image',
          engagement: 189,
          conversions: 12,
          spend: 67.30
        }
      ],
      seasonalTrends: generateDemoTimeSeriesData()
    }
  };
};

// Generate demo time series data for the last 30 days
const generateDemoTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic restaurant data with weekend peaks
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseImpressions = isWeekend ? 800 + Math.random() * 400 : 400 + Math.random() * 300;
    const clicks = Math.floor(baseImpressions * (0.02 + Math.random() * 0.02));
    const spend = clicks * (0.60 + Math.random() * 0.40);
    const conversions = Math.floor(clicks * (0.08 + Math.random() * 0.12));
    
    data.push({
      date: date.toISOString().split('T')[0],
      impressions: Math.floor(baseImpressions),
      clicks,
      spend: parseFloat(spend.toFixed(2)),
      conversions
    });
  }
  
  return data;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const since = searchParams.get('since') || '2024-01-01';
    const until = searchParams.get('until') || new Date().toISOString().split('T')[0];
    const accountId = searchParams.get('accountId');

    console.log('Meta Ads API called with:', { since, until, accountId });

    // Check if Meta service is configured
    if (!metaAdsService.isConfigured()) {
      console.log('Using Meta demo mode - credentials not available');
      return NextResponse.json({
        demo: true,
        message: 'Meta Ads credentials not configured',
        platformBreakdown: {
          facebook: { spend: 355.07, conversions: 32 },
          instagram: { spend: 207.54, conversions: 19 },
          messenger: { spend: 17.75, conversions: 2 },
          audienceNetwork: { spend: 11.43, conversions: 1 }
        }
      });
    }

    // If no account ID provided, return demo
    if (!accountId || accountId === 'demo') {
      console.log('Using Meta demo mode - credentials or account ID not available');
      return NextResponse.json({
        demo: true,
        message: 'Real Meta account ID required',
        platformBreakdown: {
          facebook: { spend: 355.07, conversions: 32 },
          instagram: { spend: 207.54, conversions: 19 },
          messenger: { spend: 17.75, conversions: 2 },
          audienceNetwork: { spend: 11.43, conversions: 1 }
        }
      });
    }

    try {
      // Test access to the specific account first
      console.log(`Testing Meta account access for: ${accountId}`);
      const accountInfo = await metaAdsService.getAccountInfo(accountId);
      console.log('Meta account access successful:', accountInfo.account.name);

      // Get restaurant insights
      const insights = await metaAdsService.getRestaurantInsights(accountId, { since, until });
      
      return NextResponse.json({
        demo: false,
        message: 'Real Meta data',
        ...insights
      });

    } catch (error: any) {
      console.error('Meta API Error:', error);
      
      // Handle specific permission errors
      if (error.message?.includes('ads_management') || error.message?.includes('ads_read')) {
        return NextResponse.json({
          demo: true,
          error: 'PERMISSION_ERROR',
          message: 'Meta access token missing required permissions (ads_read, ads_management)',
          details: error.message,
          solution: 'Regenerate access token with ads_read and ads_management permissions',
          platformBreakdown: {
            facebook: { spend: 355.07, conversions: 32 },
            instagram: { spend: 207.54, conversions: 19 },
            messenger: { spend: 17.75, conversions: 2 },
            audienceNetwork: { spend: 11.43, conversions: 1 }
          }
        });
      }

      // Handle OAuth/token errors
      if (error.message?.includes('OAuthException') || error.message?.includes('validating application')) {
        return NextResponse.json({
          demo: true,
          error: 'TOKEN_ERROR', 
          message: 'Meta access token invalid or expired',
          details: error.message,
          solution: 'Generate new User Access Token from Graph API Explorer',
          platformBreakdown: {
            facebook: { spend: 355.07, conversions: 32 },
            instagram: { spend: 207.54, conversions: 19 },
            messenger: { spend: 17.75, conversions: 2 },
            audienceNetwork: { spend: 11.43, conversions: 1 }
          }
        });
      }

      // Fallback to demo mode for any other errors
      return NextResponse.json({
        demo: true,
        error: 'API_ERROR',
        message: 'Meta API error occurred',
        details: error.message,
        platformBreakdown: {
          facebook: { spend: 355.07, conversions: 32 },
          instagram: { spend: 207.54, conversions: 19 },
          messenger: { spend: 17.75, conversions: 2 },
          audienceNetwork: { spend: 11.43, conversions: 1 }
        }
      });
    }

  } catch (error) {
    console.error('Error in Meta Ads API route:', error);
    return NextResponse.json({
      demo: true,
      error: 'SERVER_ERROR',
      message: 'Internal server error',
      platformBreakdown: {
        facebook: { spend: 355.07, conversions: 32 },
        instagram: { spend: 207.54, conversions: 19 },
        messenger: { spend: 17.75, conversions: 2 },
        audienceNetwork: { spend: 11.43, conversions: 1 }
      }
    }, { status: 500 });
  }
} 