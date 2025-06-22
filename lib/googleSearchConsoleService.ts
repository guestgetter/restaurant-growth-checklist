import { google } from 'googleapis';

// Google Search Console Configuration
interface GoogleSearchConsoleConfig {
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

export interface SearchConsoleProperty {
  siteUrl: string;
  permissionLevel: string;
}

export interface SearchQueryData {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface SearchPageData {
  page: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface SearchCountryData {
  country: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface SearchDeviceData {
  device: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface RestaurantSearchInsights {
  // Core Search Metrics
  totalImpressions: number;
  totalClicks: number;
  averageCTR: number;
  averagePosition: number;
  
  // Restaurant-Specific Search Performance
  restaurantNameQueries: SearchQueryData[];
  locationQueries: SearchQueryData[];
  menuQueries: SearchQueryData[];
  cuisineQueries: SearchQueryData[];
  reservationQueries: SearchQueryData[];
  
  // Top Performing Content
  topPages: SearchPageData[];
  menuPages: SearchPageData[];
  locationPages: SearchPageData[];
  
  // Geographic Performance
  topCountries: SearchCountryData[];
  localSearchPerformance: {
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  };
  
  // Device Performance
  deviceBreakdown: SearchDeviceData[];
  
  // Search Appearance
  searchAppearanceData: Array<{
    feature: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }>;
  
  // Trending Queries
  trendingQueries: Array<{
    query: string;
    impressions: number;
    clicks: number;
    changeType: 'rising' | 'falling' | 'stable';
    changePercentage: number;
  }>;
  
  // Technical SEO Issues
  indexingStatus: {
    indexedPages: number;
    blockedPages: number;
    errorPages: number;
  };
  
  // Local SEO Performance
  localBusinessQueries: SearchQueryData[];
  directionsQueries: SearchQueryData[];
  hoursQueries: SearchQueryData[];
  phoneQueries: SearchQueryData[];
}

export class GoogleSearchConsoleService {
  private searchConsole: any = null;
  private auth: any = null;
  private config: GoogleSearchConsoleConfig | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    try {
      const config = {
        client_id: process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_ID || process.env.GOOGLE_ADS_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET || process.env.GOOGLE_ADS_CLIENT_SECRET || '',
        refresh_token: process.env.GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN || process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
      };

      if (this.isConfigValid(config)) {
        this.config = config;
        
        // Initialize OAuth2 client
        this.auth = new google.auth.OAuth2(
          config.client_id,
          config.client_secret,
          'http://localhost:3000'
        );
        
        this.auth.setCredentials({
          refresh_token: config.refresh_token,
        });

        // Initialize Search Console API client
        this.searchConsole = google.searchconsole({ version: 'v1', auth: this.auth });
      }
    } catch (error) {
      console.error('Failed to initialize Google Search Console client:', error);
    }
  }

  private isConfigValid(config: GoogleSearchConsoleConfig): boolean {
    return !!(
      config.client_id &&
      config.client_secret &&
      config.refresh_token
    );
  }

  public isConfigured(): boolean {
    return !!(this.searchConsole && this.config);
  }

  // Get Search Console properties
  async getSearchConsoleProperties(): Promise<SearchConsoleProperty[]> {
    if (!this.searchConsole) {
      throw new Error('Search Console client not configured');
    }

    try {
      const response = await this.searchConsole.sites.list();
      
      return (response.data.siteEntry || []).map((site: any) => ({
        siteUrl: site.siteUrl,
        permissionLevel: site.permissionLevel,
      }));
    } catch (error) {
      console.error('Error fetching Search Console properties:', error);
      throw error;
    }
  }

  // Get search query performance
  async getSearchQueries(
    siteUrl: string,
    dateRange: { startDate: string; endDate: string },
    limit: number = 100
  ): Promise<SearchQueryData[]> {
    if (!this.searchConsole) {
      throw new Error('Search Console client not configured');
    }

    try {
      const response = await this.searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          dimensions: ['query'],
          rowLimit: limit,
          startRow: 0,
        },
      });

      return (response.data.rows || []).map((row: any) => ({
        query: row.keys[0],
        impressions: row.impressions || 0,
        clicks: row.clicks || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      }));
    } catch (error) {
      console.error('Error fetching search queries:', error);
      throw error;
    }
  }

  // Get page performance
  async getPagePerformance(
    siteUrl: string,
    dateRange: { startDate: string; endDate: string },
    limit: number = 100
  ): Promise<SearchPageData[]> {
    if (!this.searchConsole) {
      throw new Error('Search Console client not configured');
    }

    try {
      const response = await this.searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          dimensions: ['page'],
          rowLimit: limit,
          startRow: 0,
        },
      });

      return (response.data.rows || []).map((row: any) => ({
        page: row.keys[0],
        impressions: row.impressions || 0,
        clicks: row.clicks || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      }));
    } catch (error) {
      console.error('Error fetching page performance:', error);
      throw error;
    }
  }

  // Get country performance
  async getCountryPerformance(
    siteUrl: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<SearchCountryData[]> {
    if (!this.searchConsole) {
      throw new Error('Search Console client not configured');
    }

    try {
      const response = await this.searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          dimensions: ['country'],
          rowLimit: 50,
          startRow: 0,
        },
      });

      return (response.data.rows || []).map((row: any) => ({
        country: row.keys[0],
        impressions: row.impressions || 0,
        clicks: row.clicks || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      }));
    } catch (error) {
      console.error('Error fetching country performance:', error);
      throw error;
    }
  }

  // Get device performance
  async getDevicePerformance(
    siteUrl: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<SearchDeviceData[]> {
    if (!this.searchConsole) {
      throw new Error('Search Console client not configured');
    }

    try {
      const response = await this.searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          dimensions: ['device'],
          rowLimit: 10,
          startRow: 0,
        },
      });

      return (response.data.rows || []).map((row: any) => ({
        device: row.keys[0],
        impressions: row.impressions || 0,
        clicks: row.clicks || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      }));
    } catch (error) {
      console.error('Error fetching device performance:', error);
      throw error;
    }
  }

  // Get comprehensive restaurant search insights
  async getRestaurantSearchInsights(
    siteUrl: string,
    dateRange: { startDate: string; endDate: string }
  ): Promise<RestaurantSearchInsights> {
    try {
      const [
        allQueries,
        pagePerformance,
        countryPerformance,
        devicePerformance
      ] = await Promise.all([
        this.getSearchQueries(siteUrl, dateRange, 500),
        this.getPagePerformance(siteUrl, dateRange, 100),
        this.getCountryPerformance(siteUrl, dateRange),
        this.getDevicePerformance(siteUrl, dateRange),
      ]);

      // Calculate core metrics
      const totalImpressions = allQueries.reduce((sum, query) => sum + query.impressions, 0);
      const totalClicks = allQueries.reduce((sum, query) => sum + query.clicks, 0);
      const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const averagePosition = allQueries.reduce((sum, query) => sum + query.position, 0) / allQueries.length;

      // Categorize queries by restaurant-specific terms
      const restaurantNameQueries = allQueries.filter(query => 
        this.isRestaurantNameQuery(query.query)
      );

      const locationQueries = allQueries.filter(query => 
        this.isLocationQuery(query.query)
      );

      const menuQueries = allQueries.filter(query => 
        this.isMenuQuery(query.query)
      );

      const cuisineQueries = allQueries.filter(query => 
        this.isCuisineQuery(query.query)
      );

      const reservationQueries = allQueries.filter(query => 
        this.isReservationQuery(query.query)
      );

      const localBusinessQueries = allQueries.filter(query => 
        this.isLocalBusinessQuery(query.query)
      );

      // Categorize pages
      const menuPages = pagePerformance.filter(page => 
        page.page.toLowerCase().includes('menu')
      );

      const locationPages = pagePerformance.filter(page => 
        page.page.toLowerCase().includes('location') || 
        page.page.toLowerCase().includes('contact')
      );

      return {
        // Core Search Metrics
        totalImpressions,
        totalClicks,
        averageCTR,
        averagePosition,

        // Restaurant-Specific Search Performance
        restaurantNameQueries: restaurantNameQueries.slice(0, 20),
        locationQueries: locationQueries.slice(0, 20),
        menuQueries: menuQueries.slice(0, 20),
        cuisineQueries: cuisineQueries.slice(0, 20),
        reservationQueries: reservationQueries.slice(0, 20),

        // Top Performing Content
        topPages: pagePerformance.slice(0, 20),
        menuPages,
        locationPages,

        // Geographic Performance
        topCountries: countryPerformance.slice(0, 10),
        localSearchPerformance: {
          impressions: locationQueries.reduce((sum, query) => sum + query.impressions, 0),
          clicks: locationQueries.reduce((sum, query) => sum + query.clicks, 0),
          ctr: locationQueries.length > 0 
            ? locationQueries.reduce((sum, query) => sum + query.ctr, 0) / locationQueries.length 
            : 0,
          position: locationQueries.length > 0 
            ? locationQueries.reduce((sum, query) => sum + query.position, 0) / locationQueries.length 
            : 0,
        },

        // Device Performance
        deviceBreakdown: devicePerformance,

        // Search Appearance (placeholder - would need additional API calls)
        searchAppearanceData: [],

        // Trending Queries (placeholder - would need historical comparison)
        trendingQueries: [],

        // Technical SEO Issues (placeholder - would need additional API calls)
        indexingStatus: {
          indexedPages: 0,
          blockedPages: 0,
          errorPages: 0,
        },

        // Local SEO Performance
        localBusinessQueries: localBusinessQueries.slice(0, 20),
        directionsQueries: allQueries.filter(query => 
          query.query.toLowerCase().includes('directions') ||
          query.query.toLowerCase().includes('address')
        ).slice(0, 10),
        hoursQueries: allQueries.filter(query => 
          query.query.toLowerCase().includes('hours') ||
          query.query.toLowerCase().includes('open')
        ).slice(0, 10),
        phoneQueries: allQueries.filter(query => 
          query.query.toLowerCase().includes('phone') ||
          query.query.toLowerCase().includes('number')
        ).slice(0, 10),
      };
    } catch (error) {
      console.error('Error fetching restaurant search insights:', error);
      throw error;
    }
  }

  // Helper methods to categorize queries
  private isRestaurantNameQuery(query: string): boolean {
    // This would be customized based on the actual restaurant name
    return query.toLowerCase().includes('restaurant') || 
           query.toLowerCase().includes('bistro') ||
           query.toLowerCase().includes('cafe') ||
           query.toLowerCase().includes('bar') ||
           query.toLowerCase().includes('grill');
  }

  private isLocationQuery(query: string): boolean {
    const locationKeywords = [
      'near me', 'location', 'address', 'directions', 'map',
      'where', 'find', 'nearby', 'close', 'local'
    ];
    return locationKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  private isMenuQuery(query: string): boolean {
    const menuKeywords = [
      'menu', 'food', 'dish', 'meal', 'price', 'cost',
      'order', 'delivery', 'takeout', 'specials'
    ];
    return menuKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  private isCuisineQuery(query: string): boolean {
    const cuisineKeywords = [
      'italian', 'mexican', 'chinese', 'japanese', 'indian',
      'american', 'french', 'thai', 'mediterranean', 'pizza',
      'burger', 'sushi', 'seafood', 'steakhouse', 'bbq'
    ];
    return cuisineKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  private isReservationQuery(query: string): boolean {
    const reservationKeywords = [
      'reservation', 'book', 'table', 'booking', 'reserve',
      'availability', 'open table', 'party'
    ];
    return reservationKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  private isLocalBusinessQuery(query: string): boolean {
    const localKeywords = [
      'hours', 'open', 'closed', 'phone', 'number', 'contact',
      'reviews', 'rating', 'yelp', 'google reviews'
    ];
    return localKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  static formatCTR(ctr: number): string {
    return `${(ctr * 100).toFixed(1)}%`;
  }

  static formatPosition(position: number): string {
    return position.toFixed(1);
  }

  static formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
} 