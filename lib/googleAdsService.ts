import { GoogleAdsApi, Customer, enums } from 'google-ads-api';

// Google Ads Service Configuration
interface GoogleAdsConfig {
  client_id: string;
  client_secret: string;
  refresh_token: string;
  developer_token: string;
}

export interface AdAccountData {
  customerId: string;
  name: string;
  currencyCode: string;
  timeZone: string;
  isActive: boolean;
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  campaignType: string;
  status: string;
  startDate: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  cost: number; // in micros
  conversions: number;
  conversionValue: number;
  ctr: number; // click-through rate
  cpc: number; // cost per click
  cpa: number; // cost per acquisition
  roas: number; // return on ad spend
}

export interface KeywordPerformance {
  keywordId: string;
  keywordText: string;
  matchType: string;
  campaignName: string;
  adGroupName: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  cpc: number;
  qualityScore?: number;
}

export interface AdPerformance {
  adId: string;
  adType: string;
  headline1?: string;
  headline2?: string;
  description?: string;
  campaignName: string;
  adGroupName: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

export interface GeographicPerformance {
  locationName: string;
  locationType: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

export interface TimeSeriesData {
  date: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionValue: number;
}

export interface RestaurantInsights {
  totalSpend: number;
  totalConversions: number;
  averageOrderValue: number;
  phoneCallConversions: number;
  websiteConversions: number;
  directionsConversions: number;
  costPerConversion: number;
  conversionActions: any[];
  peakHours: Array<{ hour: number; orderCount: number }>;
  peakDays: Array<{ day: string; conversions: number; spend: number }>;
  averageOrderFrequency: number;
  customerAcquisitionTrend: 'increasing' | 'decreasing' | 'stable';
  localCompetitionShare: number;
  topPerformingCampaigns: CampaignPerformance[];
  geographicHotspots: GeographicPerformance[];
  seasonalTrends: TimeSeriesData[];
  topKeywords: Array<{ keyword: string; conversions: number; cost: number }>;
  competitorAnalysis?: {
    impressionShare: number;
    positionAboveRate: number;
    searchImpressionShare: number;
  };
}

export class GoogleAdsService {
  private client: GoogleAdsApi | null = null;
  private config: GoogleAdsConfig | null = null;
  private managerCustomerId: string | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    try {
      const config = {
        client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
        refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
        developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
      };

      // Get manager customer ID from environment or default
      this.managerCustomerId = process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID || null;

      if (this.isConfigValid(config)) {
        this.config = config;
        this.client = new GoogleAdsApi({
          client_id: config.client_id,
          client_secret: config.client_secret,
          developer_token: config.developer_token,
        });
      }
    } catch (error) {
      console.error('Failed to initialize Google Ads client:', error);
    }
  }

  private isConfigValid(config: GoogleAdsConfig): boolean {
    return !!(
      config.client_id &&
      config.client_secret &&
      config.refresh_token &&
      config.developer_token
    );
  }

  public isConfigured(): boolean {
    return !!(this.client && this.config);
  }

  // Get accessible ad accounts for the authenticated user
  async getAdAccounts(): Promise<AdAccountData[]> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    try {
      const customer = this.client.Customer({
        customer_id: 'YOUR_MCC_CUSTOMER_ID', // This would be configurable
        refresh_token: this.config.refresh_token,
      });

      const query = `
        SELECT 
          customer.id,
          customer.descriptive_name,
          customer.currency_code,
          customer.time_zone,
          customer.status
        FROM customer
        WHERE customer.status = 'ENABLED'
      `;

      const results = await customer.query(query);
      
      return results.map((row: any) => ({
        customerId: row.customer.id,
        name: row.customer.descriptive_name || `Account ${row.customer.id}`,
        currencyCode: row.customer.currency_code,
        timeZone: row.customer.time_zone,
        isActive: row.customer.status === 'ENABLED',
      }));
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      throw error;
    }
  }

  // Get campaign performance data
  async getCampaignPerformance(
    customerId: string, 
    dateRange: { startDate: string; endDate: string }
  ): Promise<CampaignPerformance[]> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    try {
      const customer = this.createCustomer(customerId);

      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.advertising_channel_type,
          campaign.status,
          campaign.start_date,
          campaign.end_date,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.ctr,
          metrics.average_cpc,
          metrics.cost_per_conversion,
          metrics.value_per_conversion
        FROM campaign
        WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
          AND campaign.status IN ('ENABLED', 'PAUSED')
        ORDER BY metrics.cost_micros DESC
      `;

      const results = await customer.query(query);
      
      return results.map((row: any) => ({
        campaignId: row.campaign.id,
        campaignName: row.campaign.name,
        campaignType: row.campaign.advertising_channel_type,
        status: row.campaign.status,
        startDate: row.campaign.start_date,
        endDate: row.campaign.end_date,
        impressions: row.metrics.impressions || 0,
        clicks: row.metrics.clicks || 0,
        cost: row.metrics.cost_micros || 0,
        conversions: row.metrics.conversions || 0,
        conversionValue: row.metrics.conversions_value || 0,
        ctr: row.metrics.ctr || 0,
        cpc: row.metrics.average_cpc || 0,
        cpa: row.metrics.cost_per_conversion || 0,
        roas: row.metrics.value_per_conversion || 0,
      }));
    } catch (error) {
      console.error('Error fetching campaign performance:', error);
      throw error;
    }
  }

  // Get keyword performance data
  async getKeywordPerformance(
    customerId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<KeywordPerformance[]> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    try {
      const customer = this.createCustomer(customerId);

      const query = `
        SELECT 
          ad_group_criterion.criterion_id,
          ad_group_criterion.keyword.text,
          ad_group_criterion.keyword.match_type,
          campaign.name,
          ad_group.name,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.ctr,
          metrics.average_cpc,
          ad_group_criterion.quality_info.quality_score
        FROM keyword_view
        WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
          AND ad_group_criterion.status = 'ENABLED'
          AND ad_group.status = 'ENABLED'
          AND campaign.status IN ('ENABLED', 'PAUSED')
        ORDER BY metrics.cost_micros DESC
        LIMIT 100
      `;

      const results = await customer.query(query);
      
      return results.map((row: any) => ({
        keywordId: row.ad_group_criterion.criterion_id,
        keywordText: row.ad_group_criterion.keyword.text,
        matchType: row.ad_group_criterion.keyword.match_type,
        campaignName: row.campaign.name,
        adGroupName: row.ad_group.name,
        impressions: row.metrics.impressions || 0,
        clicks: row.metrics.clicks || 0,
        cost: row.metrics.cost_micros || 0,
        conversions: row.metrics.conversions || 0,
        ctr: row.metrics.ctr || 0,
        cpc: row.metrics.average_cpc || 0,
        qualityScore: row.ad_group_criterion.quality_info?.quality_score,
      }));
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
  }

  // Get geographic performance data
  async getGeographicPerformance(
    customerId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<GeographicPerformance[]> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    // Temporarily disabled due to API compatibility issues with Performance Max campaigns
    // TODO: Implement compatible geographic queries for modern campaign types
    console.log('Geographic data temporarily disabled due to API compatibility issues');
    return [];
  }

  // Helper method to get location name from geographic view
  private getLocationName(geographicView: any): string {
    if (geographicView.country_criterion_id) {
      return this.getCountryName(geographicView.country_criterion_id);
    }
    return `Location Type: ${geographicView.location_type || 'Unknown'}`;
  }

  // Helper method to get country name from criterion ID
  private getCountryName(countryId: string | number): string {
    const countryMap: { [key: string]: string } = {
      '2840': 'United States',
      '2124': 'Canada',
      '2826': 'United Kingdom',
      '2276': 'Germany',
      '2250': 'France',
      '2380': 'Italy',
      '2724': 'Spain',
      '2036': 'Australia',
      '2392': 'Japan',
      '2156': 'China',
      '2484': 'Mexico',
      '2076': 'Brazil',
      '2356': 'India',
    };
    return countryMap[countryId.toString()] || `Country ID: ${countryId}`;
  }

  // Helper method to get campaign type display name
  private getCampaignTypeDisplayName(channelType: string): string {
    const typeMap: { [key: string]: string } = {
      'SEARCH': 'Search Campaign',
      'DISPLAY': 'Display Campaign', 
      'SHOPPING': 'Shopping Campaign',
      'VIDEO': 'Video Campaign',
      'PERFORMANCE_MAX': 'Performance Max Campaign',
      'LOCAL': 'Local Campaign',
      'SMART': 'Smart Campaign',
      'UNKNOWN': 'Campaign Data'
    };
    return typeMap[channelType] || 'Campaign Data';
  }

  // Helper method to get location type name
  private getLocationTypeName(locationType: number): string {
    const locationTypeMap: { [key: number]: string } = {
      1: 'Country',
      2: 'Region/State', 
      3: 'Province/Territory',
      4: 'City',
      5: 'Metro Area',
      6: 'Postal Code',
      7: 'University',
      8: 'Airport'
    };
    
    return locationTypeMap[locationType] || `Type ${locationType}`;
  }

  // Get time series data for trends
  async getTimeSeriesData(
    customerId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<TimeSeriesData[]> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    try {
      const customer = this.createCustomer(customerId);

      const query = `
        SELECT 
          segments.date,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value
        FROM campaign
        WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
          AND campaign.status IN ('ENABLED', 'PAUSED')
        ORDER BY segments.date ASC
      `;

      const results = await customer.query(query);
      
      // Group by date and sum metrics
      const dateGroups: { [key: string]: TimeSeriesData } = {};
      
      results.forEach((row: any) => {
        const date = row.segments.date;
        if (!dateGroups[date]) {
          dateGroups[date] = {
            date,
            impressions: 0,
            clicks: 0,
            cost: 0,
            conversions: 0,
            conversionValue: 0,
          };
        }
        
        dateGroups[date].impressions += row.metrics.impressions || 0;
        dateGroups[date].clicks += row.metrics.clicks || 0;
        dateGroups[date].cost += row.metrics.cost_micros || 0;
        dateGroups[date].conversions += row.metrics.conversions || 0;
        dateGroups[date].conversionValue += row.metrics.conversions_value || 0;
      });
      
      return Object.values(dateGroups).sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error fetching time series data:', error);
      throw error;
    }
  }

  // Get detailed conversion actions and interaction data
  async getConversionActions(
    customerId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<any[]> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    try {
      const customer = this.createCustomer(customerId);

      const query = `
        SELECT 
          campaign.name,
          metrics.conversions,
          metrics.conversions_value,
          metrics.view_through_conversions,
          segments.conversion_action_name,
          segments.conversion_action_category
        FROM campaign
        WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
          AND campaign.status IN ('ENABLED', 'PAUSED')
          AND metrics.conversions > 0
        ORDER BY metrics.conversions DESC
        LIMIT 20
      `;

      const results = await customer.query(query);
      
      return results.map((row: any) => ({
        name: row.segments?.conversion_action_name || 'Unknown',
        type: row.segments?.conversion_action_category,
        category: row.segments?.conversion_action_category,
        status: 'ENABLED',
        conversions: row.metrics?.conversions || 0,
        conversionValue: row.metrics?.conversions_value || 0,
        viewThroughConversions: row.metrics?.view_through_conversions || 0,
        crossDeviceConversions: 0,
        conversionRate: 0
      }));
    } catch (error) {
      console.error('Error fetching conversion actions:', error);
      return []; // Return empty array to avoid breaking other data
    }
  }

  // Get call interaction data  
  async getCallInteractions(
    customerId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<any[]> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    try {
      const customer = this.client.Customer({
        customer_id: customerId,
        refresh_token: this.config.refresh_token,
      });

      const query = `
        SELECT 
          campaign.name,
          ad_group.name,
          metrics.phone_calls,
          metrics.phone_through_rate,
          metrics.phone_impressions,
          segments.call_type
        FROM call_view
        WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
          AND metrics.phone_calls > 0
        ORDER BY metrics.phone_calls DESC
        LIMIT 20
      `;

      const results = await customer.query(query);
      
      return results.map((row: any) => ({
        campaignName: row.campaign?.name || 'Unknown Campaign',
        adGroupName: row.ad_group?.name || 'Unknown Ad Group', 
        phoneCalls: row.metrics?.phone_calls || 0,
        phoneThroughRate: row.metrics?.phone_through_rate || 0,
        phoneImpressions: row.metrics?.phone_impressions || 0,
        callType: row.segments?.call_type || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching call interactions:', error);
      return []; // Return empty array to avoid breaking other data
    }
  }

  // Generate restaurant-specific insights
  async getRestaurantInsights(
    customerId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<RestaurantInsights> {
    try {
      const [campaigns, keywords, geographic, timeSeries, conversionActions] = await Promise.all([
        this.getCampaignPerformance(customerId, dateRange),
        this.getKeywordPerformance(customerId, dateRange),
        this.getGeographicPerformance(customerId, dateRange),
        this.getTimeSeriesData(customerId, dateRange),
        this.getConversionActions(customerId, dateRange),
      ]);

      // Calculate total spend from campaigns (convert from micros to dollars)
      const totalSpendMicros = campaigns.reduce((sum, campaign) => sum + campaign.cost, 0);
      const totalSpend = totalSpendMicros / 1000000;
      
      // Calculate total conversions from campaigns
      const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
      const totalConversionValue = campaigns.reduce((sum, campaign) => sum + campaign.conversionValue, 0);
      
      // Calculate restaurant-specific metrics from conversion actions
      const phoneCallConversions = conversionActions.filter(action => 
        action.name.toLowerCase().includes('call') || 
        action.type === 11 || // Phone call conversion type
        action.category === 11
      ).reduce((sum, action) => sum + action.conversions, 0);

      const websiteConversions = conversionActions.filter(action => 
        action.name.toLowerCase().includes('page') || 
        action.name.toLowerCase().includes('email') ||
        action.name.toLowerCase().includes('form') ||
        action.type === 3 || // Website conversion type
        action.category === 3
      ).reduce((sum, action) => sum + action.conversions, 0);

      const directionsConversions = conversionActions.filter(action => 
        action.name.toLowerCase().includes('direction') ||
        action.name.toLowerCase().includes('map') ||
        action.name.toLowerCase().includes('location')
      ).reduce((sum, action) => sum + action.conversions, 0);

      // Calculate cost per conversion if we have conversions
      const costPerConversion = totalConversions > 0 ? totalSpend / totalConversions : 0;
      
      // Calculate average order value (use conversion value if available, otherwise estimate)
      const averageOrderValue = totalConversions > 0 ? totalConversionValue / totalConversions : 0;
      
      // Top performing campaigns (by conversions since ROAS may not be available)
      const topPerformingCampaigns = campaigns
        .filter(c => c.conversions > 0)
        .sort((a, b) => b.conversions - a.conversions)
        .slice(0, 5);

      // Geographic hotspots (top performing locations)
      const geographicHotspots = geographic
        .filter(g => g.conversions > 0)
        .sort((a, b) => b.conversions - a.conversions)
        .slice(0, 10);

      // Calculate peak days from time series data
      const dayGroups: { [key: string]: { conversions: number; spend: number } } = {};
      timeSeries.forEach(data => {
        const dayOfWeek = new Date(data.date).toLocaleDateString('en-US', { weekday: 'long' });
        if (!dayGroups[dayOfWeek]) {
          dayGroups[dayOfWeek] = { conversions: 0, spend: 0 };
        }
        dayGroups[dayOfWeek].conversions += data.conversions;
        dayGroups[dayOfWeek].spend += data.cost / 1000000; // Convert from micros
      });
      
      let peakDays = Object.entries(dayGroups)
        .map(([day, data]) => ({ day, ...data }))
        .sort((a, b) => b.conversions - a.conversions);

      // Ensure we always have at least default days if no data exists
      if (peakDays.length === 0) {
        peakDays = [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ].map(day => ({ day, conversions: 0, spend: 0 }));
      }

      // Calculate customer acquisition trend (simplified)
      const recentData = timeSeries.slice(-14); // Last 14 days
      const olderData = timeSeries.slice(-28, -14); // Previous 14 days
      const recentConversions = recentData.reduce((sum, d) => sum + d.conversions, 0);
      const olderConversions = olderData.reduce((sum, d) => sum + d.conversions, 0);
      
      let customerAcquisitionTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (recentConversions > olderConversions * 1.1) {
        customerAcquisitionTrend = 'increasing';
      } else if (recentConversions < olderConversions * 0.9) {
        customerAcquisitionTrend = 'decreasing';
      }

      // Get top keywords (converted keywords ranked by conversions)
      const topKeywords = keywords
        .filter(k => k.conversions > 0)
        .sort((a, b) => b.conversions - a.conversions)
        .slice(0, 10)
        .map(k => ({
          keyword: k.keywordText,
          conversions: k.conversions,
          cost: k.cost / 1000000 // Convert from micros
        }));

      // If no keywords have conversions, get top keywords by cost/performance
      const topKeywordsByPerformance = topKeywords.length > 0 ? topKeywords : 
        keywords
          .filter(k => k.clicks > 0)
          .sort((a, b) => b.cost - a.cost) // Sort by cost (highest spend first)
          .slice(0, 10)
          .map(k => ({
            keyword: k.keywordText,
            conversions: k.conversions,
            cost: k.cost / 1000000,
            clicks: k.clicks,
            ctr: k.ctr
          }));

      return {
        totalSpend,
        totalConversions,
        averageOrderValue,
        phoneCallConversions,
        websiteConversions,
        directionsConversions,
        costPerConversion,
        conversionActions,
        peakHours: [], // This would require hour-of-day data from Google Ads
        peakDays,
        averageOrderFrequency: totalConversions > 0 ? 30 / totalConversions : 0, // Simplified: orders per month
        customerAcquisitionTrend,
        localCompetitionShare: 0, // Would require competitive metrics API access
        topPerformingCampaigns,
        geographicHotspots,
        seasonalTrends: timeSeries,
        topKeywords: topKeywordsByPerformance,
      };
    } catch (error) {
      console.error('Error generating restaurant insights:', error);
      throw error;
    }
  }

  // Utility method to format cost from micros to dollars
  static formatCost(costMicros: number, currencyCode: string = 'USD'): string {
    const cost = costMicros / 1000000;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(cost);
  }

  // Utility method to format percentage
  static formatPercentage(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  }

  // Debug method to check account status and basic info
  async getAccountInfo(customerId: string): Promise<any> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    try {
      const customer = this.createCustomer(customerId);

      // Get basic account info
      const accountQuery = `
        SELECT 
          customer.id,
          customer.descriptive_name,
          customer.currency_code,
          customer.time_zone,
          customer.status
        FROM customer
        LIMIT 1
      `;

      const accountResults = await customer.query(accountQuery);
      
      // Get campaign count
      const campaignQuery = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status
        FROM campaign
        LIMIT 10
      `;

      const campaignResults = await customer.query(campaignQuery);
      
      return {
        account: accountResults[0] || {},
        campaignCount: campaignResults.length,
        sampleCampaigns: campaignResults.map((c: any) => ({
          id: c.campaign.id,
          name: c.campaign.name,
          status: c.campaign.status
        }))
      };
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  // Alternative method to get location criteria for campaigns
  async getLocationCriteria(
    customerId: string
  ): Promise<any[]> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    try {
      const customer = this.client.Customer({
        customer_id: customerId,
        refresh_token: this.config.refresh_token,
      });

      const query = `
        SELECT 
          campaign.name,
          campaign_criterion.campaign,
          campaign_criterion.location.geo_target_constant,
          geo_target_constant.name,
          geo_target_constant.country_code,
          geo_target_constant.target_type,
          geo_target_constant.canonical_name
        FROM campaign_criterion
        WHERE campaign_criterion.type = 'LOCATION'
          AND campaign.status IN ('ENABLED', 'PAUSED')
        LIMIT 50
      `;

      const results = await customer.query(query);
      
      return results.map((row: any) => ({
        campaignName: row.campaign?.name || 'Unknown',
        locationName: row.geo_target_constant?.canonical_name || row.geo_target_constant?.name || 'Unknown Location',
        targetType: row.geo_target_constant?.target_type || 'Unknown',
        countryCode: row.geo_target_constant?.country_code || 'Unknown',
        geoTargetConstant: row.campaign_criterion?.location?.geo_target_constant || 'Unknown'
      }));
    } catch (error) {
      console.error('Error fetching location criteria:', error);
      return [];
    }
  }

  // Get detailed geo target data for user locations
  async getDetailedUserLocations(
    customerId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<GeographicPerformance[]> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    try {
      const customer = this.client.Customer({
        customer_id: customerId,
        refresh_token: this.config.refresh_token,
      });

      // Try to get user location data with geo target details
      const query = `
        SELECT 
          user_location_view.country_criterion_id,
          user_location_view.targeting_location,
          campaign.status,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.ctr
        FROM user_location_view
        WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
          AND campaign.status IN ('ENABLED', 'PAUSED')
          AND metrics.impressions > 0
        ORDER BY metrics.clicks DESC
        LIMIT 100
      `;

      console.log('Trying detailed user locations query...');
      const results = await customer.query(query);
      
      console.log(`Found ${results.length} detailed user location results`);

      // Group by targeting_location and aggregate metrics
      const locationMap = new Map<string, GeographicPerformance>();
      
      results.forEach((row: any) => {
        const locationName = row.user_location_view?.targeting_location || 
                            this.getCountryName(row.user_location_view?.country_criterion_id) || 
                            'Unknown Location';
        
        const existing = locationMap.get(locationName);
        const impressions = row.metrics?.impressions || 0;
        const clicks = row.metrics?.clicks || 0;
        const cost = row.metrics?.cost_micros || 0;
        const conversions = row.metrics?.conversions || 0;
        const ctr = row.metrics?.ctr || 0;
        
        if (existing) {
          existing.impressions += impressions;
          existing.clicks += clicks;
          existing.cost += cost;
          existing.conversions += conversions;
          existing.ctr = existing.impressions > 0 ? (existing.clicks / existing.impressions) * 100 : 0;
          existing.cpc = existing.clicks > 0 ? existing.cost / existing.clicks : 0;
        } else {
          locationMap.set(locationName, {
            locationName,
            locationType: 'User Location',
            impressions,
            clicks,
            cost,
            conversions,
            ctr,
            cpc: clicks > 0 ? cost / clicks : 0,
          });
        }
      });

      return Array.from(locationMap.values())
        .filter(loc => loc.clicks > 0)
        .sort((a, b) => b.clicks - a.clicks);

    } catch (error) {
      console.error('Error fetching detailed user locations:', error);
      return [];
    }
  }

  // Get campaign location targets (more specific than user location data)
  private async getCampaignLocationTargets(
    customerId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<GeographicPerformance[]> {
    try {
      console.log('Fetching campaign location targets...');
      const customer = this.createCustomer(customerId);

      // Get location targets from campaigns with performance data
      const query = `
        SELECT 
          campaign.name,
          campaign_criterion.location.geo_target_constant,
          geo_target_constant.name,
          geo_target_constant.country_code,
          geo_target_constant.target_type,
          geo_target_constant.status,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.ctr
        FROM campaign_criterion
        WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
          AND campaign_criterion.type = 'LOCATION'
          AND campaign.status IN ('ENABLED', 'PAUSED')
          AND metrics.impressions > 0
        ORDER BY metrics.clicks DESC
        LIMIT 50
      `;

      const results = await customer.query(query);
      console.log('Campaign location targets results:', results?.length || 0);

      return results.map((row: any) => ({
        locationName: row.geo_target_constant?.name || 'Unknown Location',
        locationType: this.getLocationTypeFromTargetType(row.geo_target_constant?.target_type),
        impressions: row.metrics?.impressions || 0,
        clicks: row.metrics?.clicks || 0,
        cost: row.metrics?.cost_micros || 0,
        conversions: row.metrics?.conversions || 0,
        ctr: row.metrics?.ctr || 0,
        cpc: row.metrics?.clicks > 0 ? (row.metrics?.cost_micros || 0) / row.metrics.clicks : 0,
        campaignName: row.campaign?.name || ''
      }));

    } catch (error) {
      console.error('Error fetching campaign location targets:', error);
      return [];
    }
  }

  // Helper to map geo target types to readable location types  
  private getLocationTypeFromTargetType(targetType: string): string {
    switch (targetType) {
      case 'COUNTRY': return 'Country';
      case 'REGION': return 'Province/State';  
      case 'CITY': return 'City';
      case 'METRO': return 'Metro Area';
      case 'POSTAL_CODE': return 'Postal Code';
      default: return 'Location Target';
    }
  }

  // Helper method to create customer with proper login customer ID
  private createCustomer(customerId: string) {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not configured');
    }

    const customerConfig: any = {
      customer_id: customerId,
      refresh_token: this.config.refresh_token,
    };

    // Add manager customer ID if available and different from target customer
    if (this.managerCustomerId && this.managerCustomerId !== customerId) {
      customerConfig.login_customer_id = this.managerCustomerId;
      console.log(`Using manager customer ID: ${this.managerCustomerId} for client: ${customerId}`);
    }

    return this.client.Customer(customerConfig);
  }

  // Check if manager account has access to customer ID
  async hasAccessToCustomer(customerId: string): Promise<boolean> {
    if (!this.client || !this.config) {
      return false;
    }

    try {
      const customer = this.createCustomer(customerId);
      
      // Simple test query to check access
      const query = `
        SELECT customer.id 
        FROM customer 
        LIMIT 1
      `;
      
      await customer.query(query);
      console.log(`✅ Manager has access to customer: ${customerId}`);
      return true;
    } catch (error: any) {
      if (error.message && error.message.includes("doesn't have permission")) {
        console.log(`❌ Manager lacks access to customer: ${customerId}`);
        return false;
      }
      console.log(`⚠️ Unknown error checking access to customer ${customerId}:`, error.message);
      return false;
    }
  }
}

export const googleAdsService = new GoogleAdsService(); 