import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';

// Google Analytics Configuration
interface GoogleAnalyticsConfig {
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

export interface AnalyticsPropertyData {
  propertyId: string;
  displayName: string;
  websiteUrl: string;
  timeZone: string;
  currencyCode: string;
  isActive: boolean;
}

export interface TrafficSourceData {
  source: string;
  medium: string;
  sessions: number;
  users: number;
  newUsers: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

export interface PagePerformanceData {
  pagePath: string;
  pageTitle: string;
  pageViews: number;
  uniquePageViews: number;
  avgTimeOnPage: number;
  entrances: number;
  bounceRate: number;
  exitRate: number;
  conversions: number;
  conversionValue: number;
}

export interface AudienceData {
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  sessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  pageViewsPerSession: number;
  demographics: {
    age: Array<{ ageRange: string; users: number; percentage: number }>;
    gender: Array<{ gender: string; users: number; percentage: number }>;
  };
  interests: Array<{ category: string; users: number; affinity: number }>;
  locations: Array<{ 
    country: string; 
    city: string; 
    users: number; 
    sessions: number; 
    conversionRate: number;
  }>;
  devices: Array<{
    deviceCategory: string;
    users: number;
    sessions: number;
    bounceRate: number;
    conversionRate: number;
  }>;
}

export interface ConversionData {
  conversionName: string;
  conversions: number;
  conversionRate: number;
  conversionValue: number;
  costPerConversion?: number;
}

export interface RestaurantAnalyticsInsights {
  // Core Metrics
  totalSessions: number;
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  totalRevenue: number;
  
  // Restaurant-Specific Insights
  menuPageViews: number;
  locationPageViews: number;
  reservationConversions: number;
  orderOnlineConversions: number;
  phoneCallConversions: number;
  directionsRequests: number;
  
  // Peak Performance Analysis
  peakTrafficHours: Array<{ hour: number; sessions: number; conversions: number }>;
  peakTrafficDays: Array<{ day: string; sessions: number; conversions: number }>;
  seasonalTrends: Array<{ date: string; sessions: number; users: number; conversions: number; revenue: number }>;
  
  // Traffic Sources
  topTrafficSources: TrafficSourceData[];
  organicSearchPerformance: {
    sessions: number;
    users: number;
    conversions: number;
    conversionRate: number;
    avgSessionDuration: number;
  };
  paidSearchPerformance: {
    sessions: number;
    users: number;
    conversions: number;
    conversionRate: number;
    avgSessionDuration: number;
    cost?: number;
  };
  socialMediaPerformance: {
    sessions: number;
    users: number;
    conversions: number;
    topPlatforms: Array<{ platform: string; sessions: number; conversions: number }>;
  };
  
  // Page Performance
  topPerformingPages: PagePerformanceData[];
  menuPerformance: PagePerformanceData[];
  locationPerformance: PagePerformanceData[];
  
  // Audience Insights
  audienceOverview: AudienceData;
  localVsNonLocal: {
    local: { users: number; sessions: number; conversions: number; conversionRate: number };
    nonLocal: { users: number; sessions: number; conversions: number; conversionRate: number };
  };
  
  // Conversion Analysis
  conversionFunnel: Array<{
    step: string;
    users: number;
    dropoffRate: number;
    conversionRate: number;
  }>;
  goalCompletions: ConversionData[];
  ecommerceMetrics?: {
    transactions: number;
    revenue: number;
    avgOrderValue: number;
    revenuePerUser: number;
  };
}

export class GoogleAnalyticsService {
  private analyticsDataClient: BetaAnalyticsDataClient | null = null;
  private auth: any = null;
  private config: GoogleAnalyticsConfig | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    try {
      const config = {
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN || '',
      };

      console.log('Google Analytics config check:', {
        hasClientId: !!config.client_id,
        hasClientSecret: !!config.client_secret,
        hasRefreshToken: !!config.refresh_token,
        clientIdLength: config.client_id.length,
        clientSecretLength: config.client_secret.length,
        refreshTokenLength: config.refresh_token.length,
        clientIdPreview: config.client_id ? config.client_id.substring(0, 20) + '...' : 'MISSING',
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
      });

      if (this.isConfigValid(config)) {
        this.config = config;
        
        console.log('Initializing Google OAuth2 client...');
        // Initialize OAuth2 client
        this.auth = new google.auth.OAuth2(
          config.client_id,
          config.client_secret,
          'https://restaurant-growth-checklist.vercel.app/api/auth/callback/google'
        );
        
        console.log('Setting OAuth2 credentials...');
        this.auth.setCredentials({
          refresh_token: config.refresh_token,
        });

        console.log('Initializing Analytics Data API client...');
        // Initialize Analytics Data API client
        this.analyticsDataClient = new BetaAnalyticsDataClient({
          auth: this.auth,
        });
        
        console.log('Google Analytics client initialized successfully');
      } else {
        console.log('Google Analytics configuration invalid - missing required environment variables');
        console.log('Missing variables:', {
          client_id: !config.client_id,
          client_secret: !config.client_secret,
          refresh_token: !config.refresh_token,
        });
      }
    } catch (error) {
      console.error('Failed to initialize Google Analytics client:', error);
    }
  }

  private isConfigValid(config: GoogleAnalyticsConfig): boolean {
    return !!(
      config.client_id &&
      config.client_secret &&
      config.refresh_token
    );
  }

  public isConfigured(): boolean {
    return !!(this.analyticsDataClient && this.config);
  }

  // Get Analytics properties accessible to the user
  async getAnalyticsProperties(): Promise<AnalyticsPropertyData[]> {
    if (!this.auth) {
      throw new Error('Google Analytics client not configured');
    }

    try {
      const analyticsAdmin = google.analyticsadmin({ version: 'v1beta', auth: this.auth });
      
      const response = await analyticsAdmin.accounts.list();
      const properties: AnalyticsPropertyData[] = [];
      
      for (const account of response.data.accounts || []) {
        const propertiesResponse = await analyticsAdmin.properties.list({
          filter: `parent:${account.name}`,
        });
        
        for (const property of propertiesResponse.data.properties || []) {
          properties.push({
            propertyId: property.name?.split('/')[1] || '',
            displayName: property.displayName || '',
            websiteUrl: '', // Not available in this API response
            timeZone: property.timeZone || '',
            currencyCode: property.currencyCode || 'USD',
            isActive: true,
          });
        }
      }
      
      return properties;
    } catch (error) {
      console.error('Error fetching Analytics properties:', error);
      throw error;
    }
  }

  // Get traffic source data
  async getTrafficSources(
    propertyId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<TrafficSourceData[]> {
    if (!this.analyticsDataClient) {
      throw new Error('Analytics client not configured');
    }

    try {
      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [
          { name: 'sessionDefaultChannelGrouping' },
          { name: 'sessionSource' },
          { name: 'sessionMedium' },
        ],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'conversions' },
          { name: 'totalRevenue' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 20,
      });

      return (response.rows || []).map(row => {
        const sessions = parseInt(row.metricValues?.[0]?.value || '0');
        const conversions = parseInt(row.metricValues?.[5]?.value || '0');
        
        return {
          source: row.dimensionValues?.[1]?.value || 'Unknown',
          medium: row.dimensionValues?.[2]?.value || 'Unknown',
          sessions,
          users: parseInt(row.metricValues?.[1]?.value || '0'),
          newUsers: parseInt(row.metricValues?.[2]?.value || '0'),
          bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
          avgSessionDuration: parseFloat(row.metricValues?.[4]?.value || '0'),
          conversions,
          conversionRate: sessions > 0 ? (conversions / sessions) * 100 : 0,
          revenue: parseFloat(row.metricValues?.[6]?.value || '0'),
        };
      });
    } catch (error) {
      console.error('Error fetching traffic sources:', error);
      throw error;
    }
  }

  // Get page performance data
  async getPagePerformance(
    propertyId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<PagePerformanceData[]> {
    if (!this.analyticsDataClient) {
      throw new Error('Analytics client not configured');
    }

    try {
      const [response] = await this.analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [
          { name: 'pagePath' },
          { name: 'pageTitle' },
        ],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'averageTimeOnPage' },
          { name: 'entrances' },
          { name: 'bounceRate' },
          { name: 'exitRate' },
          { name: 'conversions' },
          { name: 'totalRevenue' },
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 50,
      });

      return (response.rows || []).map(row => ({
        pagePath: row.dimensionValues?.[0]?.value || '',
        pageTitle: row.dimensionValues?.[1]?.value || '',
        pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
        uniquePageViews: parseInt(row.metricValues?.[0]?.value || '0'), // Approximate
        avgTimeOnPage: parseFloat(row.metricValues?.[1]?.value || '0'),
        entrances: parseInt(row.metricValues?.[2]?.value || '0'),
        bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
        exitRate: parseFloat(row.metricValues?.[4]?.value || '0'),
        conversions: parseInt(row.metricValues?.[5]?.value || '0'),
        conversionValue: parseFloat(row.metricValues?.[6]?.value || '0'),
      }));
    } catch (error) {
      console.error('Error fetching page performance:', error);
      throw error;
    }
  }

  // Get audience data
  async getAudienceData(
    propertyId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<AudienceData> {
    if (!this.analyticsDataClient) {
      throw new Error('Analytics client not configured');
    }

    try {
      // Get basic audience metrics
      const [basicResponse] = await this.analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        metrics: [
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'screenPageViewsPerSession' },
        ],
      });

      // Get demographic data
      const [demographicsResponse] = await this.analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [
          { name: 'userAgeBracket' },
          { name: 'userGender' },
        ],
        metrics: [{ name: 'activeUsers' }],
      });

      // Get location data
      const [locationResponse] = await this.analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [
          { name: 'country' },
          { name: 'city' },
        ],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'conversions' },
        ],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 20,
      });

      // Get device data
      const [deviceResponse] = await this.analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [dateRange],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'bounceRate' },
          { name: 'conversions' },
        ],
      });

      const basicMetrics = basicResponse.rows?.[0]?.metricValues || [];
      const totalUsers = parseInt(basicMetrics[0]?.value || '0');
      const newUsers = parseInt(basicMetrics[1]?.value || '0');
      const sessions = parseInt(basicMetrics[2]?.value || '0');

      return {
        totalUsers,
        newUsers,
        returningUsers: totalUsers - newUsers,
        sessions,
        avgSessionDuration: parseFloat(basicMetrics[3]?.value || '0'),
        bounceRate: parseFloat(basicMetrics[4]?.value || '0'),
        pageViewsPerSession: parseFloat(basicMetrics[5]?.value || '0'),
        demographics: {
          age: this.processDemographicData(demographicsResponse.rows || [], 'age'),
          gender: this.processDemographicData(demographicsResponse.rows || [], 'gender'),
        },
        interests: [], // Would need additional API calls for interests
        locations: (locationResponse.rows || []).map(row => {
          const users = parseInt(row.metricValues?.[0]?.value || '0');
          const sessions = parseInt(row.metricValues?.[1]?.value || '0');
          const conversions = parseInt(row.metricValues?.[2]?.value || '0');
          
          return {
            country: row.dimensionValues?.[0]?.value || '',
            city: row.dimensionValues?.[1]?.value || '',
            users,
            sessions,
            conversionRate: sessions > 0 ? (conversions / sessions) * 100 : 0,
          };
        }),
        devices: (deviceResponse.rows || []).map(row => {
          const users = parseInt(row.metricValues?.[0]?.value || '0');
          const sessions = parseInt(row.metricValues?.[1]?.value || '0');
          const conversions = parseInt(row.metricValues?.[3]?.value || '0');
          
          return {
            deviceCategory: row.dimensionValues?.[0]?.value || '',
            users,
            sessions,
            bounceRate: parseFloat(row.metricValues?.[2]?.value || '0'),
            conversionRate: sessions > 0 ? (conversions / sessions) * 100 : 0,
          };
        }),
      };
    } catch (error) {
      console.error('Error fetching audience data:', error);
      throw error;
    }
  }

  // Get comprehensive restaurant analytics insights
  async getRestaurantAnalyticsInsights(
    propertyId: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<RestaurantAnalyticsInsights> {
    try {
      const [trafficSources, pagePerformance, audienceData] = await Promise.all([
        this.getTrafficSources(propertyId, dateRange),
        this.getPagePerformance(propertyId, dateRange),
        this.getAudienceData(propertyId, dateRange),
      ]);

      // Filter restaurant-specific pages
      const menuPages = pagePerformance.filter(page => 
        page.pagePath.toLowerCase().includes('menu') || 
        page.pageTitle.toLowerCase().includes('menu')
      );
      
      const locationPages = pagePerformance.filter(page => 
        page.pagePath.toLowerCase().includes('location') || 
        page.pagePath.toLowerCase().includes('contact') ||
        page.pageTitle.toLowerCase().includes('location')
      );

      // Calculate restaurant-specific metrics
      const totalSessions = trafficSources.reduce((sum, source) => sum + source.sessions, 0);
      const totalConversions = trafficSources.reduce((sum, source) => sum + source.conversions, 0);
      const totalRevenue = trafficSources.reduce((sum, source) => sum + source.revenue, 0);

      const organicSearch = trafficSources.find(source => 
        source.medium.toLowerCase().includes('organic') || 
        source.source.toLowerCase().includes('google')
      );
      
      const paidSearch = trafficSources.find(source => 
        source.medium.toLowerCase().includes('cpc') || 
        source.medium.toLowerCase().includes('paid')
      );

      const socialSources = trafficSources.filter(source => 
        ['facebook', 'instagram', 'twitter', 'tiktok', 'youtube'].some(platform => 
          source.source.toLowerCase().includes(platform)
        )
      );

      return {
        // Core Metrics
        totalSessions,
        totalUsers: audienceData.totalUsers,
        newUsers: audienceData.newUsers,
        returningUsers: audienceData.returningUsers,
        avgSessionDuration: audienceData.avgSessionDuration,
        bounceRate: audienceData.bounceRate,
        conversionRate: totalSessions > 0 ? (totalConversions / totalSessions) * 100 : 0,
        totalRevenue,

        // Restaurant-Specific Insights
        menuPageViews: menuPages.reduce((sum, page) => sum + page.pageViews, 0),
        locationPageViews: locationPages.reduce((sum, page) => sum + page.pageViews, 0),
        reservationConversions: 0, // Would need custom event tracking
        orderOnlineConversions: 0, // Would need custom event tracking
        phoneCallConversions: 0, // Would need call tracking
        directionsRequests: 0, // Would need custom event tracking

        // Peak Performance Analysis (placeholder - would need hourly data)
        peakTrafficHours: [],
        peakTrafficDays: [],
        seasonalTrends: [],

        // Traffic Sources
        topTrafficSources: trafficSources.slice(0, 10),
        organicSearchPerformance: {
          sessions: organicSearch?.sessions || 0,
          users: organicSearch?.users || 0,
          conversions: organicSearch?.conversions || 0,
          conversionRate: organicSearch?.conversionRate || 0,
          avgSessionDuration: organicSearch?.avgSessionDuration || 0,
        },
        paidSearchPerformance: {
          sessions: paidSearch?.sessions || 0,
          users: paidSearch?.users || 0,
          conversions: paidSearch?.conversions || 0,
          conversionRate: paidSearch?.conversionRate || 0,
          avgSessionDuration: paidSearch?.avgSessionDuration || 0,
        },
        socialMediaPerformance: {
          sessions: socialSources.reduce((sum, source) => sum + source.sessions, 0),
          users: socialSources.reduce((sum, source) => sum + source.users, 0),
          conversions: socialSources.reduce((sum, source) => sum + source.conversions, 0),
          topPlatforms: socialSources.map(source => ({
            platform: source.source,
            sessions: source.sessions,
            conversions: source.conversions,
          })),
        },

        // Page Performance
        topPerformingPages: pagePerformance.slice(0, 10),
        menuPerformance: menuPages,
        locationPerformance: locationPages,

        // Audience Insights
        audienceOverview: audienceData,
        localVsNonLocal: {
          local: { users: 0, sessions: 0, conversions: 0, conversionRate: 0 },
          nonLocal: { users: 0, sessions: 0, conversions: 0, conversionRate: 0 },
        },

        // Conversion Analysis
        conversionFunnel: [],
        goalCompletions: [],
        ecommerceMetrics: totalRevenue > 0 ? {
          transactions: totalConversions,
          revenue: totalRevenue,
          avgOrderValue: totalConversions > 0 ? totalRevenue / totalConversions : 0,
          revenuePerUser: audienceData.totalUsers > 0 ? totalRevenue / audienceData.totalUsers : 0,
        } : undefined,
      };
    } catch (error) {
      console.error('Error fetching restaurant analytics insights:', error);
      throw error;
    }
  }

  private processDemographicData(rows: any[], type: 'age' | 'gender'): any[] {
    const dimensionIndex = type === 'age' ? 0 : 1;
    const relevantRows = rows.filter(row => 
      row.dimensionValues?.[dimensionIndex]?.value && 
      row.dimensionValues?.[dimensionIndex]?.value !== '(not set)'
    );
    
    const totalUsers = relevantRows.reduce((sum, row) => 
      sum + parseInt(row.metricValues?.[0]?.value || '0'), 0
    );

    return relevantRows.map(row => {
      const users = parseInt(row.metricValues?.[0]?.value || '0');
      return {
        [type === 'age' ? 'ageRange' : 'gender']: row.dimensionValues?.[dimensionIndex]?.value || '',
        users,
        percentage: totalUsers > 0 ? (users / totalUsers) * 100 : 0,
      };
    });
  }

  static formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  static formatCurrency(value: number, currencyCode: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  }
} 