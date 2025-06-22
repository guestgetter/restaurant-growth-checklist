import { google } from 'googleapis';

// Types for Google Business Profile API responses
interface BusinessAccount {
  name: string;
  accountName: string;
  type: string;
  role: string;
}

interface BusinessLocation {
  name: string;
  languageCode: string;
  storeCode: string;
  locationName: string;
  primaryPhone: string;
  additionalPhones: string[];
  address: {
    regionCode: string;
    languageCode: string;
    postalCode: string;
    sortingCode: string;
    administrativeArea: string;
    locality: string;
    addressLines: string[];
  };
  primaryCategory: {
    categoryId: string;
    displayName: string;
  };
  websiteUri: string;
  regularHours: {
    periods: Array<{
      openDay: string;
      openTime: string;
      closeDay: string;
      closeTime: string;
    }>;
  };
  specialHours: any;
  serviceArea: any;
  labels: string[];
  adWordsLocationExtensions: any;
}

interface DailyMetrics {
  date: {
    year: number;
    month: number;
    day: number;
  };
  businessViews: {
    viewsOnGoogle: number;
    viewsOnGoogleMaps: number;
    viewsOnSearch: number;
    actionsPhone: number;
    actionsWebsite: number;
    actionsDirections: number;
  };
  businessImpressions: {
    totalImpressions: number;
    impressionsFromDirectSearch: number;
    impressionsFromDiscoverySearch: number;
    impressionsFromBrandedSearch: number;
  };
  businessConversions: {
    actionsPhone: number;
    actionsWebsite: number;
    actionsDirections: number;
    actionsMenuViews?: number;
    actionsReservations?: number;
    actionsOrderOnline?: number;
  };
}

interface Review {
  name: string;
  reviewId: string;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
    isAnonymous: boolean;
  };
  starRating: number;
  comment: string;
  createTime: string;
  updateTime: string;
  reviewReply?: {
    comment: string;
    updateTime: string;
  };
}

interface SearchKeywordImpressions {
  searchKeyword: string;
  impressionsCount: number;
}

class GoogleBusinessProfileService {
  private oauth2Client: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_ID,
      process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET,
      process.env.GOOGLE_BUSINESS_PROFILE_REDIRECT_URI
    );
  }

  /**
   * Set OAuth credentials
   */
  setCredentials(accessToken: string, refreshToken?: string) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }

  /**
   * Get all business accounts for the authenticated user
   * NOTE: Google Business Profile APIs require special approval and are not available in standard googleapis
   */
  async getAccounts(): Promise<BusinessAccount[]> {
    throw new Error('Google Business Profile API access requires special approval. Please see GOOGLE_BUSINESS_PROFILE_SETUP.md for setup instructions.');
  }

  /**
   * Get all locations for a specific account
   */
  async getLocations(accountName: string): Promise<BusinessLocation[]> {
    throw new Error('Google Business Profile API access requires special approval. Please see GOOGLE_BUSINESS_PROFILE_SETUP.md for setup instructions.');
  }

  /**
   * Get daily metrics for a location (up to 18 months historical data)
   */
  async getDailyMetrics(
    locationName: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<DailyMetrics[]> {
    throw new Error('Google Business Profile API access requires special approval. Please see GOOGLE_BUSINESS_PROFILE_SETUP.md for setup instructions.');
  }

  /**
   * Get multiple daily metrics in a single request (new API method)
   */
  async getMultipleDailyMetrics(
    locationNames: string[],
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    throw new Error('Google Business Profile API access requires special approval. Please see GOOGLE_BUSINESS_PROFILE_SETUP.md for setup instructions.');
  }

  /**
   * Get reviews for a location
   */
  async getReviews(locationName: string): Promise<Review[]> {
    throw new Error('Google Business Profile API access requires special approval. Please see GOOGLE_BUSINESS_PROFILE_SETUP.md for setup instructions.');
  }

  /**
   * Get search keyword impressions
   */
  async getSearchKeywordImpressions(
    locationName: string,
    monthYear: { year: number; month: number }
  ): Promise<SearchKeywordImpressions[]> {
    throw new Error('Google Business Profile API access requires special approval. Please see GOOGLE_BUSINESS_PROFILE_SETUP.md for setup instructions.');
  }

  /**
   * Update business information
   */
  async updateLocation(locationName: string, locationData: Partial<BusinessLocation>): Promise<BusinessLocation> {
    throw new Error('Google Business Profile API access requires special approval. Please see GOOGLE_BUSINESS_PROFILE_SETUP.md for setup instructions.');
  }

  /**
   * Reply to a review
   */
  async replyToReview(reviewName: string, replyText: string): Promise<any> {
    throw new Error('Google Business Profile API access requires special approval. Please see GOOGLE_BUSINESS_PROFILE_SETUP.md for setup instructions.');
  }

  /**
   * Process and format metrics for restaurant-specific insights
   */
  processRestaurantMetrics(metrics: DailyMetrics[]): any {
    const totalViews = metrics.reduce((sum, day) => 
      sum + (day.businessViews?.viewsOnGoogle || 0), 0);
    
    const totalDirections = metrics.reduce((sum, day) => 
      sum + (day.businessConversions?.actionsDirections || 0), 0);
    
    const totalWebsiteClicks = metrics.reduce((sum, day) => 
      sum + (day.businessConversions?.actionsWebsite || 0), 0);
    
    const totalPhoneCalls = metrics.reduce((sum, day) => 
      sum + (day.businessConversions?.actionsPhone || 0), 0);

    const avgDailyViews = totalViews / metrics.length;
    const conversionRate = totalViews > 0 ? 
      ((totalDirections + totalWebsiteClicks + totalPhoneCalls) / totalViews) * 100 : 0;

    return {
      summary: {
        totalViews,
        totalDirections,
        totalWebsiteClicks,
        totalPhoneCalls,
        avgDailyViews: Math.round(avgDailyViews),
        conversionRate: Math.round(conversionRate * 100) / 100
      },
      dailyData: metrics,
      restaurantInsights: {
        peakDays: this.findPeakDays(metrics),
        searchVsMaps: this.calculateSearchVsMapsRatio(metrics),
        customerActions: {
          directions: totalDirections,
          website: totalWebsiteClicks,
          phone: totalPhoneCalls
        }
      }
    };
  }

  private findPeakDays(metrics: DailyMetrics[]): string[] {
    // Find days with highest views
    const sorted = metrics
      .map(day => ({
        date: `${day.date.year}-${day.date.month}-${day.date.day}`,
        views: day.businessViews?.viewsOnGoogle || 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
    
    return sorted.map(d => d.date);
  }

  private calculateSearchVsMapsRatio(metrics: DailyMetrics[]): { search: number; maps: number } {
    const totalSearch = metrics.reduce((sum, day) => 
      sum + (day.businessViews?.viewsOnSearch || 0), 0);
    
    const totalMaps = metrics.reduce((sum, day) => 
      sum + (day.businessViews?.viewsOnGoogleMaps || 0), 0);
    
    const total = totalSearch + totalMaps;
    
    return {
      search: total > 0 ? Math.round((totalSearch / total) * 100) : 0,
      maps: total > 0 ? Math.round((totalMaps / total) * 100) : 0
    };
  }
}

export default GoogleBusinessProfileService; 