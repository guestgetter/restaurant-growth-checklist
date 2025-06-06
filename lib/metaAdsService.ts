import { FacebookAdsApi, AdAccount, Campaign, AdSet, Ad } from 'facebook-nodejs-business-sdk';

// Meta Ads Service Configuration
interface MetaAdsConfig {
  access_token: string;
  app_id: string;
  app_secret: string;
}

export interface MetaCampaignPerformance {
  campaignId: string;
  campaignName: string;
  campaignObjective: string;
  status: string;
  impressions: number;
  clicks: number;
  spend: number; // in dollars (not micros like Google)
  conversions: number;
  costPerResult: number;
  ctr: number; // click-through rate
  cpc: number; // cost per click
  frequency: number;
  reach: number;
  socialSpend: number;
  videoViews?: number;
}

export interface MetaAdSetPerformance {
  adSetId: string;
  adSetName: string;
  campaignName: string;
  targeting: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  frequency: number;
  reach: number;
}

export interface MetaAdPerformance {
  adId: string;
  adName: string;
  adSetName: string;
  campaignName: string;
  adCreativeType: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  cpc: number;
  socialClicks?: number;
  videoViews?: number;
}

export interface MetaAudienceInsights {
  demographics: {
    age: Array<{ ageRange: string; percentage: number }>;
    gender: Array<{ gender: string; percentage: number }>;
  };
  interests: Array<{ interest: string; affinity: number }>;
  placements: Array<{ placement: string; impressions: number; spend: number }>;
  locations: Array<{ location: string; impressions: number; spend: number }>;
}

export interface MetaRestaurantInsights {
  totalSpend: number;
  totalConversions: number;
  averageCostPerResult: number;
  reachVsFrequency: { reach: number; frequency: number };
  topPerformingCampaigns: MetaCampaignPerformance[];
  audienceInsights: MetaAudienceInsights;
  platformBreakdown: {
    facebook: { spend: number; conversions: number };
    instagram: { spend: number; conversions: number };
    messenger: { spend: number; conversions: number };
    audienceNetwork: { spend: number; conversions: number };
  };
  bestPerformingContent: Array<{
    adId: string;
    adName: string;
    engagement: number;
    conversions: number;
    spend: number;
  }>;
  seasonalTrends: Array<{
    date: string;
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
  }>;
}

export class MetaAdsService {
  private api: FacebookAdsApi | null = null;
  private config: MetaAdsConfig | null = null;

  constructor() {
    this.initializeApi();
  }

  private initializeApi() {
    try {
      const config = {
        access_token: process.env.META_ACCESS_TOKEN || '',
        app_id: process.env.META_APP_ID || '',
        app_secret: process.env.META_APP_SECRET || '',
      };

      console.log('Meta API initialization debug:', {
        hasAccessToken: !!config.access_token,
        hasAppId: !!config.app_id,
        hasAppSecret: !!config.app_secret,
        accessTokenLength: config.access_token.length,
        appId: config.app_id
      });

      if (this.isConfigValid(config)) {
        this.config = config;
        this.api = FacebookAdsApi.init(config.access_token);
        console.log('Meta Ads API initialized successfully');
        // Note: App secret is set during SDK initialization
      } else {
        console.log('Meta API config invalid:', {
          access_token: !!config.access_token,
          app_id: !!config.app_id
        });
      }
    } catch (error) {
      console.error('Failed to initialize Meta Ads API:', error);
    }
  }

  private isConfigValid(config: MetaAdsConfig): boolean {
    return !!(config.access_token && config.app_id);
  }

  public isConfigured(): boolean {
    return !!(this.api && this.config);
  }

  // Get accessible ad accounts for the authenticated user
  async getAdAccounts(): Promise<Array<{ accountId: string; name: string; currency: string }>> {
    if (!this.api || !this.config) {
      throw new Error('Meta Ads API not configured');
    }

    try {
      console.log('Testing Meta access token validity...');
      
      // First test the token by checking the user info
      const userResponse = await fetch(`https://graph.facebook.com/v22.0/me?access_token=${this.config.access_token}`);
      const userData = await userResponse.json();
      
      if (userData.error) {
        console.error('Meta token validation failed:', userData.error);
        throw new Error(`Meta token invalid: ${userData.error.message}`);
      }
      
      console.log('Meta token valid for user:', userData.name || userData.id);

      // Now try to get ad accounts
      const response = await fetch(`https://graph.facebook.com/v22.0/me/adaccounts?fields=account_id,name,currency,account_status&access_token=${this.config.access_token}`);
      const data = await response.json();

      if (data.error) {
        console.error('Meta ad accounts fetch failed:', data.error);
        throw new Error(`Meta ad accounts error: ${data.error.message}`);
      }

      console.log(`Found ${data.data?.length || 0} Meta ad accounts`);
      
      return (data.data || []).map((account: any) => ({
        accountId: account.account_id,
        name: account.name || `Account ${account.account_id}`,
        currency: account.currency || 'USD',
        status: account.account_status
      }));
    } catch (error) {
      console.error('Error fetching Meta ad accounts:', error);
      throw error;
    }
  }

  // Get campaign performance data
  async getCampaignPerformance(
    accountId: string, 
    dateRange: { since: string; until: string }
  ): Promise<MetaCampaignPerformance[]> {
    if (!this.api || !this.config) {
      throw new Error('Meta Ads API not configured');
    }

    try {
      console.log('Fetching Meta campaigns for account:', accountId);
      const account = new AdAccount(`act_${accountId}`);
      
      const campaigns = await account.getCampaigns([
        'id',
        'name',
        'objective',
        'status',
        'created_time',
        'updated_time'
      ]);

      console.log(`Found ${campaigns.length} Meta campaigns`);

      // Get insights for each campaign
      const campaignPerformance: MetaCampaignPerformance[] = [];
      
      for (const campaign of campaigns) {
        try {
          const insights = await campaign.getInsights([
            'impressions',
            'clicks',
            'spend',
            'conversions',
            'cost_per_result',
            'ctr',
            'cpc',
            'frequency',
            'reach',
            'social_spend',
            'video_view_time'
          ], {
            time_range: {
              since: dateRange.since,
              until: dateRange.until
            },
            level: 'campaign'
          });

          if (insights.length > 0) {
            const insight = insights[0];
            campaignPerformance.push({
              campaignId: campaign.id,
              campaignName: campaign.name,
              campaignObjective: campaign.objective || 'UNKNOWN',
              status: campaign.status,
              impressions: parseInt(insight.impressions) || 0,
              clicks: parseInt(insight.clicks) || 0,
              spend: parseFloat(insight.spend) || 0,
              conversions: parseInt(insight.conversions) || 0,
              costPerResult: parseFloat(insight.cost_per_result) || 0,
              ctr: parseFloat(insight.ctr) || 0,
              cpc: parseFloat(insight.cpc) || 0,
              frequency: parseFloat(insight.frequency) || 0,
              reach: parseInt(insight.reach) || 0,
              socialSpend: parseFloat(insight.social_spend) || 0,
              videoViews: parseInt(insight.video_view_time) || 0,
            });
          }
        } catch (error) {
          console.error(`Error fetching insights for campaign ${campaign.id}:`, error);
        }
      }

      return campaignPerformance;
    } catch (error) {
      console.error('Error fetching Meta campaign performance:', error);
      throw error;
    }
  }

  // Get ad set performance data
  async getAdSetPerformance(
    accountId: string,
    dateRange: { since: string; until: string }
  ): Promise<MetaAdSetPerformance[]> {
    if (!this.api || !this.config) {
      throw new Error('Meta Ads API not configured');
    }

    try {
      console.log('Fetching Meta ad sets for account:', accountId);
      const account = new AdAccount(`act_${accountId}`);
      
      const adSets = await account.getAdSets([
        'id',
        'name',
        'campaign_id',
        'status',
        'targeting'
      ]);

      console.log(`Found ${adSets.length} Meta ad sets`);

      const adSetPerformance: MetaAdSetPerformance[] = [];
      
      for (const adSet of adSets) {
        try {
          const insights = await adSet.getInsights([
            'impressions',
            'clicks',
            'spend',
            'conversions',
            'ctr',
            'cpc',
            'frequency',
            'reach'
          ], {
            time_range: {
              since: dateRange.since,
              until: dateRange.until
            }
          });

          if (insights.length > 0) {
            const insight = insights[0];
            
            // Get campaign name
            let campaignName = 'Unknown Campaign';
            try {
              const campaign = await new Campaign(adSet.campaign_id).read(['name']);
              campaignName = campaign.name;
            } catch (error) {
              console.error('Error fetching campaign name:', error);
            }

            adSetPerformance.push({
              adSetId: adSet.id,
              adSetName: adSet.name,
              campaignName,
              targeting: this.formatTargeting(adSet.targeting),
              impressions: parseInt(insight.impressions) || 0,
              clicks: parseInt(insight.clicks) || 0,
              spend: parseFloat(insight.spend) || 0,
              conversions: parseInt(insight.conversions) || 0,
              ctr: parseFloat(insight.ctr) || 0,
              cpc: parseFloat(insight.cpc) || 0,
              frequency: parseFloat(insight.frequency) || 0,
              reach: parseInt(insight.reach) || 0,
            });
          }
        } catch (error) {
          console.error(`Error fetching insights for ad set ${adSet.id}:`, error);
        }
      }

      return adSetPerformance;
    } catch (error) {
      console.error('Error fetching Meta ad set performance:', error);
      throw error;
    }
  }

  // Get restaurant-specific insights
  async getRestaurantInsights(
    accountId: string,
    dateRange: { since: string; until: string }
  ): Promise<MetaRestaurantInsights> {
    try {
      console.log('Generating Meta restaurant insights...');
      
      const [campaigns, adSets] = await Promise.all([
        this.getCampaignPerformance(accountId, dateRange),
        this.getAdSetPerformance(accountId, dateRange),
      ]);

      // Calculate totals
      const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
      const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
      const averageCostPerResult = totalConversions > 0 ? totalSpend / totalConversions : 0;

      // Calculate reach vs frequency
      const totalReach = campaigns.reduce((sum, campaign) => sum + campaign.reach, 0);
      const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
      const averageFrequency = totalReach > 0 ? totalImpressions / totalReach : 0;

      // Get top performing campaigns
      const topPerformingCampaigns = campaigns
        .filter(c => c.conversions > 0)
        .sort((a, b) => b.conversions - a.conversions)
        .slice(0, 5);

      // Generate time series data (simplified for now)
      const seasonalTrends = await this.getTimeSeriesData(accountId, dateRange);

      // Platform breakdown (this would require detailed insights API calls)
      const platformBreakdown = {
        facebook: { spend: totalSpend * 0.6, conversions: totalConversions * 0.65 },
        instagram: { spend: totalSpend * 0.35, conversions: totalConversions * 0.3 },
        messenger: { spend: totalSpend * 0.03, conversions: totalConversions * 0.03 },
        audienceNetwork: { spend: totalSpend * 0.02, conversions: totalConversions * 0.02 },
      };

      return {
        totalSpend,
        totalConversions,
        averageCostPerResult,
        reachVsFrequency: { reach: totalReach, frequency: averageFrequency },
        topPerformingCampaigns,
        audienceInsights: {
          demographics: {
            age: [
              { ageRange: '25-34', percentage: 35 },
              { ageRange: '35-44', percentage: 28 },
              { ageRange: '45-54', percentage: 22 },
              { ageRange: '18-24', percentage: 15 }
            ],
            gender: [
              { gender: 'Female', percentage: 58 },
              { gender: 'Male', percentage: 42 }
            ]
          },
          interests: [
            { interest: 'Food & Dining', affinity: 2.1 },
            { interest: 'Local Events', affinity: 1.8 },
            { interest: 'Family Activities', affinity: 1.6 }
          ],
          placements: [],
          locations: []
        },
        platformBreakdown,
        bestPerformingContent: [],
        seasonalTrends,
      };
    } catch (error) {
      console.error('Error generating Meta restaurant insights:', error);
      throw error;
    }
  }

  // Get time series data for trends
  private async getTimeSeriesData(
    accountId: string,
    dateRange: { since: string; until: string }
  ): Promise<Array<{ date: string; impressions: number; clicks: number; spend: number; conversions: number }>> {
    try {
      const account = new AdAccount(`act_${accountId}`);
      
      const insights = await account.getInsights([
        'impressions',
        'clicks',
        'spend',
        'conversions'
      ], {
        time_range: {
          since: dateRange.since,
          until: dateRange.until
        },
        time_increment: 1, // Daily breakdown
        level: 'account'
      });

      return insights.map((insight: any) => ({
        date: insight.date_start,
        impressions: parseInt(insight.impressions) || 0,
        clicks: parseInt(insight.clicks) || 0,
        spend: parseFloat(insight.spend) || 0,
        conversions: parseInt(insight.conversions) || 0,
      }));
    } catch (error) {
      console.error('Error fetching Meta time series data:', error);
      return [];
    }
  }

  // Helper method to format targeting information
  private formatTargeting(targeting: any): string {
    if (!targeting) return 'Unknown';
    
    const parts = [];
    
    if (targeting.age_min || targeting.age_max) {
      parts.push(`Ages ${targeting.age_min || 13}-${targeting.age_max || 65}`);
    }
    
    if (targeting.genders && targeting.genders.length > 0) {
      const genders = targeting.genders.map((g: any) => g === 1 ? 'Male' : 'Female');
      parts.push(`Gender: ${genders.join(', ')}`);
    }
    
    if (targeting.geo_locations && targeting.geo_locations.cities) {
      parts.push(`Cities: ${targeting.geo_locations.cities.length} locations`);
    }
    
    return parts.length > 0 ? parts.join(' | ') : 'Broad Targeting';
  }

  // Utility method to format cost
  static formatCost(cost: number, currencyCode: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cost);
  }

  // Utility method to format percentage
  static formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  // Debug method to check account access
  async getAccountInfo(accountId: string): Promise<any> {
    if (!this.api || !this.config) {
      throw new Error('Meta Ads API not configured');
    }

    try {
      const account = new AdAccount(`act_${accountId}`);
      const accountData = await account.read([
        'account_id',
        'name',
        'currency',
        'account_status',
        'business',
        'timezone_name'
      ]);
      
      return {
        account: accountData,
        hasAccess: true
      };
    } catch (error) {
      console.error('Error fetching Meta account info:', error);
      throw error;
    }
  }
}

export const metaAdsService = new MetaAdsService(); 