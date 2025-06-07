import { NextRequest, NextResponse } from 'next/server';
import { GoogleAdsService } from '../../../lib/googleAdsService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate') || '2025-03-01';
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const customerId = searchParams.get('customerId') || 'demo';
    const debug = searchParams.get('debug') === 'true';
    
    // Check if we have all required environment variables
    const hasAllCredentials = process.env.GOOGLE_ADS_CLIENT_ID && 
                              process.env.GOOGLE_ADS_CLIENT_SECRET && 
                              process.env.GOOGLE_ADS_REFRESH_TOKEN && 
                              process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    
    // Use demo mode if missing credentials OR if customerId is 'demo' OR if customerId is empty
    const shouldUseDemoMode = !hasAllCredentials || 
                              customerId === 'demo' || 
                              !customerId || 
                              customerId.trim() === '';
    
    if (shouldUseDemoMode) {
      console.log('Using demo mode - credentials or customer ID not available');
      
      return NextResponse.json({
        demo: true,
        campaigns: [
          {
            campaignId: 'demo-1',
            campaignName: 'Local Restaurant Ads',
            campaignType: 'SEARCH',
            status: 'ENABLED',
            startDate: '2024-01-01',
            impressions: 45230,
            clicks: 2156,
            cost: 324580000, // $324.58 in micros
            conversions: 89,
            conversionValue: 2670000000, // $2,670 in micros
            ctr: 4.77,
            cpc: 150570000, // $1.51 in micros
            cpa: 3650000000, // $36.50 in micros
            roas: 8.22
          },
          {
            campaignId: 'demo-2',
            campaignName: 'Delivery & Takeout',
            campaignType: 'SEARCH',
            status: 'ENABLED',
            startDate: '2024-01-01',
            impressions: 32145,
            clicks: 1532,
            cost: 245120000, // $245.12 in micros
            conversions: 67,
            conversionValue: 2010000000, // $2,010 in micros
            ctr: 4.77,
            cpc: 160000000, // $1.60 in micros
            cpa: 3660000000, // $36.60 in micros
            roas: 8.20
          },
          {
            campaignId: 'demo-3',
            campaignName: 'Weekend Specials',
            campaignType: 'SEARCH',
            status: 'ENABLED',
            startDate: '2024-02-01',
            impressions: 18765,
            clicks: 876,
            cost: 132450000, // $132.45 in micros
            conversions: 34,
            conversionValue: 1020000000, // $1,020 in micros
            ctr: 4.67,
            cpc: 151200000, // $1.51 in micros
            cpa: 3895000000, // $38.95 in micros
            roas: 7.70
          }
        ],
        keywords: [
          {
            keywordId: 'demo-kw-1',
            keywordText: 'pizza delivery near me',
            matchType: 'BROAD',
            campaignName: 'Local Restaurant Ads',
            adGroupName: 'Pizza Keywords',
            impressions: 12500,
            clicks: 625,
            cost: 93750000, // $93.75 in micros
            conversions: 23,
            ctr: 5.0,
            cpc: 150000000, // $1.50 in micros
            qualityScore: 8
          },
          {
            keywordId: 'demo-kw-2',
            keywordText: 'italian restaurant',
            matchType: 'PHRASE',
            campaignName: 'Local Restaurant Ads',
            adGroupName: 'Restaurant Keywords',
            impressions: 8900,
            clicks: 356,
            cost: 53400000, // $53.40 in micros
            conversions: 15,
            ctr: 4.0,
            cpc: 150000000, // $1.50 in micros
            qualityScore: 7
          }
        ],
        geographic: [
          {
            locationName: 'Downtown Area',
            locationType: 'City',
            impressions: 25000,
            clicks: 1250,
            cost: 187500000, // $187.50 in micros
            conversions: 45,
            ctr: 5.0,
            cpc: 150000000 // $1.50 in micros
          },
          {
            locationName: 'Suburban District',
            locationType: 'City',
            impressions: 18000,
            clicks: 720,
            cost: 108000000, // $108.00 in micros
            conversions: 28,
            ctr: 4.0,
            cpc: 150000000 // $1.50 in micros
          }
        ],
        timeSeries: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          impressions: Math.floor(Math.random() * 2000) + 1000,
          clicks: Math.floor(Math.random() * 100) + 50,
          cost: Math.floor(Math.random() * 15000000) + 5000000, // $5-20 in micros
          conversions: Math.floor(Math.random() * 10) + 2,
          conversionValue: Math.floor(Math.random() * 300000000) + 100000000 // $100-400 in micros
        })),
        insights: {
          totalSpend: 324.58,
          totalConversions: 89,
          averageOrderValue: 30.0,
          phoneCallConversions: 25,
          websiteConversions: 45,
          directionsConversions: 19,
          costPerConversion: 18.50,
          conversionActions: [
            {
              name: "Phone Calls from Ads",
              type: 11,
              category: 11,
              conversions: 15,
              conversionValue: 0
            },
            {
              name: "Thank You Page",
              type: 3,
              category: 3,
              conversions: 30,
              conversionValue: 0
            },
            {
              name: "Phone Calls from Website",
              type: 11,
              category: 11,
              conversions: 10,
              conversionValue: 0
            },
            {
              name: "Directions Requests",
              type: 18,
              category: 18,
              conversions: 19,
              conversionValue: 0
            },
            {
              name: "Email Contact",
              type: 2,
              category: 2,
              conversions: 15,
              conversionValue: 0
            }
          ],
          peakHours: [
            { hour: 12, orderCount: 45 },
            { hour: 18, orderCount: 67 }
          ],
          topPerformingCampaigns: [],
          geographicHotspots: [],
          seasonalTrends: [],
          competitorAnalysis: {
            impressionShare: 0,
            positionAboveRate: 0,
            searchImpressionShare: 0
          }
        }
      });
    } else {
      // Use real Google Ads data
      console.log('Using real Google Ads data for customer:', customerId);
      
      try {
        const googleAdsService = new GoogleAdsService();
        
        if (!googleAdsService.isConfigured()) {
          throw new Error('Google Ads service is not properly configured');
        }


        const dateRangeObj = { startDate, endDate };
        
        // If debug mode, return account info instead
        if (debug) {
          console.log('Debug mode: fetching account info for customer:', customerId);
          const accountInfo = await googleAdsService.getAccountInfo(customerId);
          
          // Also try to get location criteria
          let locationCriteria: any[] = [];
          try {
            locationCriteria = await googleAdsService.getLocationCriteria(customerId);
            console.log('Location criteria found:', locationCriteria.length);
          } catch (error) {
            console.error('Error fetching location criteria:', error);
          }
          
          return NextResponse.json({
            debug: true,
            customerId,
            accountInfo,
            locationCriteria,
            dateRange: dateRangeObj
          });
        }
        
        // Fetch real data from Google Ads API with individual error handling
        let campaigns: any[] = [];
        let keywords: any[] = [];
        let geographic: any[] = [];
        let timeSeries: any[] = [];
        let insights: any = {};
        
        try {
          console.log('Fetching campaigns...');
          campaigns = await googleAdsService.getCampaignPerformance(customerId, dateRangeObj);
          console.log(`Found ${campaigns.length} campaigns`);
        } catch (error) {
          console.error('Error fetching campaigns:', error);
        }
        
        try {
          console.log('Fetching keywords...');
          keywords = await googleAdsService.getKeywordPerformance(customerId, dateRangeObj);
          console.log(`Found ${keywords.length} keywords`);
        } catch (error) {
          console.error('Error fetching keywords:', error);
        }
        
        try {
          console.log('Fetching geographic data...');
          geographic = await googleAdsService.getGeographicPerformance(customerId, dateRangeObj);
          console.log(`Found ${geographic.length} geographic locations`);
        } catch (error) {
          console.error('Error fetching geographic performance:', error);
        }
        
        try {
          console.log('Fetching time series...');
          timeSeries = await googleAdsService.getTimeSeriesData(customerId, dateRangeObj);
          console.log(`Found ${timeSeries.length} time series data points`);
        } catch (error) {
          console.error('Error fetching time series:', error);
        }
        
        // Fetch additional interaction data
        let conversionActions: any[] = [];
        let callInteractions: any[] = [];
        
        try {
          console.log('Fetching conversion actions...');
          conversionActions = await googleAdsService.getConversionActions(customerId, dateRangeObj);
          console.log(`Found ${conversionActions.length} conversion actions`);
        } catch (error) {
          console.error('Error fetching conversion actions:', error);
        }
        
        try {
          console.log('Fetching call interactions...');
          callInteractions = await googleAdsService.getCallInteractions(customerId, dateRangeObj);
          console.log(`Found ${callInteractions.length} call interactions`);
        } catch (error) {
          console.error('Error fetching call interactions:', error);
        }
        
        try {
          console.log('Generating insights...');
          insights = await googleAdsService.getRestaurantInsights(customerId, dateRangeObj);
          console.log('Insights generated successfully');
        } catch (error) {
          console.error('Error generating restaurant insights:', error);
          // Fallback insights calculation
          const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.cost, 0) / 1000000;
          const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
          const totalConversionValue = campaigns.reduce((sum, campaign) => sum + campaign.conversionValue, 0);
          
          insights = {
            totalSpend,
            totalConversions,
            averageOrderValue: totalConversions > 0 ? totalConversionValue / totalConversions : 0,
            phoneCallConversions: 0,
            websiteConversions: 0,
            directionsConversions: 0,
            costPerConversion: totalConversions > 0 ? totalSpend / totalConversions : 0,
            conversionActions: [],
            peakHours: [],
            topPerformingCampaigns: campaigns.filter(c => c.conversions > 0).sort((a, b) => b.roas - a.roas).slice(0, 5),
            geographicHotspots: geographic.filter(g => g.conversions > 0).sort((a, b) => b.conversions - a.conversions).slice(0, 10),
            seasonalTrends: timeSeries,
          };
        }

        const googleAdsData = {
          demo: false,
          campaigns,
          keywords,
          geographic,
          timeSeries,
          conversionActions,
          callInteractions,
          insights
        };

        return NextResponse.json(googleAdsData);
      } catch (error) {
        console.error('Error fetching real Google Ads data:', error);
        console.log('Falling back to demo data due to error:', error instanceof Error ? error.message : 'Unknown error');
        
        // Fall back to demo data if real data fails
        return NextResponse.json({
          demo: true,
          error: `Real data fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}. Showing demo data instead.`,
          campaigns: [
            {
              campaignId: 'demo-1',
              campaignName: 'Local Restaurant Ads (Demo - Real Data Failed)',
              campaignType: 'SEARCH',
              status: 'ENABLED',
              startDate: '2024-01-01',
              impressions: 45230,
              clicks: 2156,
              cost: 324580000,
              conversions: 89,
              conversionValue: 2670000000,
              ctr: 4.77,
              cpc: 150570000,
              cpa: 3650000000,
              roas: 8.22
            }
          ],
          keywords: [],
          geographic: [],
          timeSeries: [],
          insights: {
            totalSpend: 324.58,
            totalConversions: 89,
            averageOrderValue: 30.0,
            phoneCallConversions: 25,
            websiteConversions: 45,
            directionsConversions: 19,
            costPerConversion: 18.50,
            conversionActions: [
              {
                name: "Phone Calls from Ads",
                type: 11,
                category: 11,
                conversions: 15,
                conversionValue: 0
              },
              {
                name: "Thank You Page",
                type: 3,
                category: 3,
                conversions: 30,
                conversionValue: 0
              },
              {
                name: "Phone Calls from Website",
                type: 11,
                category: 11,
                conversions: 10,
                conversionValue: 0
              },
              {
                name: "Directions Requests",
                type: 18,
                category: 18,
                conversions: 19,
                conversionValue: 0
              },
              {
                name: "Email Contact",
                type: 2,
                category: 2,
                conversions: 15,
                conversionValue: 0
              }
            ],
            peakHours: [
              { hour: 12, orderCount: 45 },
              { hour: 18, orderCount: 67 }
            ],
            topPerformingCampaigns: [],
            geographicHotspots: [],
            seasonalTrends: [],
            competitorAnalysis: {
              impressionShare: 0,
              positionAboveRate: 0,
              searchImpressionShare: 0
            }
          }
        });
      }
    }

  } catch (error) {
    console.error('Google Ads API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Google Ads data', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 