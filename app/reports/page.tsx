'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calendar,
  MapPin,
  Clock,
  Search,
  Eye,
  MousePointer,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Client } from '../../components/Settings/ClientManagement';

// Types for API responses
interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  campaignType: string;
  status: string;
  startDate: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionValue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

// Meta Ads types
interface MetaCampaignPerformance {
  campaignId: string;
  campaignName: string;
  campaignObjective: string;
  status: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  costPerResult: number;
  ctr: number;
  cpc: number;
  frequency: number;
  reach: number;
  socialSpend: number;
  videoViews?: number;
}

interface MetaAdSetPerformance {
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

interface MetaRestaurantInsights {
  totalSpend: number;
  totalConversions: number;
  averageCostPerResult: number;
  reachVsFrequency: { reach: number; frequency: number };
  topPerformingCampaigns: MetaCampaignPerformance[];
  audienceInsights: {
    demographics: {
      age: Array<{ ageRange: string; percentage: number }>;
      gender: Array<{ gender: string; percentage: number }>;
    };
    interests: Array<{ interest: string; affinity: number }>;
    placements: Array<{ placement: string; impressions: number; spend: number }>;
    locations: Array<{ location: string; impressions: number; spend: number }>;
  };
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

interface MetaAdsData {
  demo: boolean;
  campaigns: MetaCampaignPerformance[];
  adSets: MetaAdSetPerformance[];
  insights: MetaRestaurantInsights;
}

interface KeywordPerformance {
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

interface GeographicPerformance {
  locationName: string;
  locationType: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

interface TimeSeriesData {
  date: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  conversionValue: number;
}

interface RestaurantInsights {
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

interface GoogleAdsData {
  demo: boolean;
  campaigns: CampaignPerformance[];
  keywords: KeywordPerformance[];
  geographic: GeographicPerformance[];
  timeSeries: TimeSeriesData[];
  conversionActions?: any[];
  callInteractions?: any[];
  insights: RestaurantInsights;
}

// Utility functions
const formatCost = (costMicros: number, currencyCode: string = 'USD'): string => {
  const cost = costMicros / 1000000;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cost);
};

// Format Meta Ads cost (already in dollars)
const formatMetaCost = (cost: number, currencyCode: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cost);
};

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

// Helper function to map Google Ads campaign status codes to readable strings
const getCampaignStatusText = (statusCode: number | string): { text: string; emoji: string } => {
  const status = typeof statusCode === 'string' ? statusCode : statusCode.toString();
  
  switch (status) {
    case '2':
    case 'ENABLED':
      return { text: 'Active', emoji: '▶️' };
    case '3': 
    case 'PAUSED':
      return { text: 'Paused', emoji: '⏸️' };
    case '4':
    case 'REMOVED':
      return { text: 'Removed', emoji: '🗑️' };
    case '5':
    case 'ENDED':
      return { text: 'Ended', emoji: '🏁' };
    default:
      return { text: 'Unknown', emoji: '⏹️' };
  }
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

// Utility function to get start date based on date range
const getDateRangeStart = (dateRange: string): string => {
  const now = new Date();
  let startDate: string;

  switch (dateRange) {
    case 'today':
      startDate = now.toISOString().split('T')[0];
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case '14d':
      startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case 'this_month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      break;
    case 'last_month':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate = lastMonth.toISOString().split('T')[0];
      break;
    case 'this_quarter':
      const currentQuarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), currentQuarter * 3, 1).toISOString().split('T')[0];
      break;
    case 'last_quarter':
      const lastQuarterMonth = now.getMonth() - 3;
      const lastQuarterYear = lastQuarterMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const adjustedMonth = lastQuarterMonth < 0 ? lastQuarterMonth + 12 : lastQuarterMonth;
      const lastQuarterStart = Math.floor(adjustedMonth / 3) * 3;
      startDate = new Date(lastQuarterYear, lastQuarterStart, 1).toISOString().split('T')[0];
      break;
    case 'this_year':
      startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      break;
    case 'custom':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
  
  return startDate;
};

export default function ReportsPage() {
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'keywords' | 'meta' | 'actions' | 'trends'>('overview');
  const [dateRange, setDateRange] = useState<'today' | '7d' | '14d' | '30d' | '90d' | 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'this_year' | 'custom'>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GoogleAdsData | null>(null);
  const [metaData, setMetaData] = useState<MetaAdsData | null>(null);

  // Load current client
  useEffect(() => {
    const loadCurrentClient = () => {
      const savedCurrentClientId = localStorage.getItem('growth-os-current-client');
      const savedClients = localStorage.getItem('growth-os-clients');
      
      if (savedCurrentClientId && savedClients) {
        const clients: Client[] = JSON.parse(savedClients);
        const client = clients.find(c => c.id === savedCurrentClientId);
        if (client) {
          setCurrentClient(client);
        }
      }
    };

    loadCurrentClient();

    // Listen for storage changes to update when client is switched
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'growth-os-current-client') {
        loadCurrentClient();
      }
    };

    // Listen for custom client change events for immediate updates
    const handleClientChange = (e: CustomEvent) => {
      if (e.detail.client) {
        setCurrentClient(e.detail.client);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('clientChanged', handleClientChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('clientChanged', handleClientChange as EventListener);
    };
  }, []);

  // Fetch data when component loads or when client/date range changes
  useEffect(() => {
    if (currentClient) {
      fetchGoogleAdsData();
      fetchMetaAdsData();
    }
  }, [currentClient, dateRange]);

  const fetchGoogleAdsData = async () => {
    if (!currentClient) return;

    try {
      setLoading(true);
      setError(null);

      const startDate = getDateRangeStart(dateRange);
      const endDate = new Date().toISOString().split('T')[0];
      
      const customerId = currentClient.googleAdsCustomerId || 'demo';
      
      const response = await fetch(`/api/google-ads?startDate=${startDate}&endDate=${endDate}&customerId=${customerId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: GoogleAdsData = await response.json();
      setData(result);
      
    } catch (error) {
      console.error('Error fetching Google Ads data:', error);
      setError('Failed to load Google Ads data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetaAdsData = async () => {
    if (!currentClient) return;

    try {
      const startDate = getDateRangeStart(dateRange);
      const endDate = new Date().toISOString().split('T')[0];
      
      const accountId = currentClient.metaAdsAccountId || 'demo';
      
      const response = await fetch(`/api/meta-ads?since=${startDate}&until=${endDate}&accountId=${accountId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: MetaAdsData = await response.json();
      setMetaData(result);
      
    } catch (error) {
      console.error('Error fetching Meta Ads data:', error);
      // Don't set error state here since Google Ads might still work
      console.log('Meta Ads data fetch failed, using demo data');
    }
  };

  // Export functionality
  const exportData = (format: 'csv' | 'pdf') => {
    if (!data) return;

    if (format === 'csv') {
      const csvData = [];
      
      // Add header
      csvData.push(['Report Type', 'Campaign', 'Impressions', 'Clicks', 'Cost', 'Conversions', 'ROAS']);
      
      // Add campaign data
      data.campaigns.forEach(campaign => {
        csvData.push([
          'Campaign',
          campaign.campaignName,
          campaign.impressions.toString(),
          campaign.clicks.toString(),
          (campaign.cost / 1000000).toFixed(2), // Convert from micros
          campaign.conversions.toString(),
          campaign.roas.toFixed(2)
        ]);
      });
      
      // Add keyword data
      data.keywords.forEach(keyword => {
        csvData.push([
          'Keyword',
          keyword.keywordText,
          keyword.impressions.toString(),
          keyword.clicks.toString(),
          (keyword.cost / 1000000).toFixed(2),
          keyword.conversions.toString(),
          ''
        ]);
      });
      
      // Convert to CSV string
      const csvString = csvData.map(row => row.join(',')).join('\n');
      
      // Download
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentClient?.name || 'Restaurant'}_Google_Ads_Report_${dateRange}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading Google Ads data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <Target size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Unable to Load Reports
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button
            onClick={fetchGoogleAdsData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">No data available</p>
        </div>
      </div>
    );
  }

  const { campaigns, keywords, geographic, timeSeries, conversionActions, callInteractions, insights, demo } = data;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'campaigns', name: 'Campaigns', icon: Target },
    { id: 'keywords', name: 'Keywords', icon: Search },
    { id: 'meta', name: 'Meta', icon: MapPin },
    { id: 'actions', name: 'Actions', icon: MousePointer },
    { id: 'trends', name: 'Trends', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Reports & Insights Generator
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {currentClient?.name} - Google Ads Performance Dashboard
                {demo && <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Demo Mode</span>}
              </p>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-slate-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="today">Today</option>
                <option value="7d">Last 7 days</option>
                <option value="14d">Last 14 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
                <option value="this_quarter">This quarter</option>
                <option value="last_quarter">Last quarter</option>
                <option value="this_year">This year</option>
                <option value="custom">Custom range</option>
              </select>
              <button
                onClick={() => exportData('csv')}
                className="flex items-center gap-2 p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                title="Export as CSV"
              >
                <Download size={16} />
              </button>
              <button
                onClick={fetchGoogleAdsData}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            campaigns={campaigns}
            keywords={keywords}
            insights={insights}
            demo={demo}
          />
        )}
        
        {activeTab === 'campaigns' && (
          <CampaignsTab campaigns={campaigns} demo={demo} />
        )}
        
        {activeTab === 'keywords' && (
          <KeywordsTab keywords={keywords} demo={demo} />
        )}
        
        {activeTab === 'meta' && (
          <MetaTab metaData={metaData} />
        )}
        
        {activeTab === 'actions' && (
          <ActionsTab conversionActions={conversionActions || []} callInteractions={callInteractions || []} demo={demo} />
        )}
        
        {activeTab === 'trends' && (
          <TrendsTab timeSeries={timeSeries} demo={demo} />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ campaigns, keywords, insights, demo }: { campaigns: CampaignPerformance[]; keywords: KeywordPerformance[]; insights: RestaurantInsights; demo: boolean }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Ad Spend"
          value={`$${insights.totalSpend.toFixed(2)}`}
          icon={<DollarSign size={24} />}
        />
        <MetricCard
          title="Phone Calls"
          value={formatNumber(insights.phoneCallConversions || 0)}
          icon={<Target size={24} />}
        />
        <MetricCard
          title="Website Actions"
          value={formatNumber(insights.websiteConversions || 0)}
          icon={<MousePointer size={24} />}
        />
        <MetricCard
          title="Cost Per Conversion"
          value={`$${insights.costPerConversion.toFixed(2)}`}
          icon={<Target size={24} />}
        />
      </div>

      {/* Conversion Actions Breakdown */}
      {insights.conversionActions && insights.conversionActions.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Conversion Actions Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.conversionActions.map((action, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                      {action.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {action.type === 11 ? '📞 Phone Call' : 
                       action.type === 3 ? '🌐 Website' : 
                       action.type === 18 ? '👆 Click Action' :
                       action.type === 2 ? '📧 Email' : '🎯 Conversion'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{action.conversions}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Peak Days Analysis */}
      {insights.peakDays && insights.peakDays.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Peak Performance Days
          </h3>
          
          {/* Improved Visual Display */}
          <div className="grid grid-cols-7 gap-3 mb-6">
            {insights.peakDays.map((day, index) => {
              const maxConversions = Math.max(...insights.peakDays.map(d => d.conversions));
              const heightPercentage = (day.conversions / maxConversions) * 100;
              const isWeekend = day.day === 'Saturday' || day.day === 'Sunday';
              
              return (
                <div key={day.day} className="text-center">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                    {day.day}
                  </div>
                  <div 
                    className={`rounded-lg flex flex-col justify-end items-center text-xs font-medium text-white p-2 transition-all hover:scale-105 ${
                      isWeekend ? 'bg-gradient-to-t from-green-500 to-green-400' : 'bg-gradient-to-t from-blue-500 to-blue-400'
                    }`}
                    style={{ 
                      minHeight: '4rem',
                      height: `${Math.max(heightPercentage, 20)}%`
                    }}
                  >
                    <div className="font-bold text-sm">{Math.round(day.conversions)}</div>
                    <div className="text-xs opacity-90">conversions</div>
                    <div className="text-xs opacity-75 mt-1">${day.spend.toFixed(0)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Summary */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {(() => {
                const weekendDays = insights.peakDays.filter(d => d.day === 'Saturday' || d.day === 'Sunday');
                const weekdayDays = insights.peakDays.filter(d => d.day !== 'Saturday' && d.day !== 'Sunday');
                const weekendConversions = weekendDays.reduce((sum, d) => sum + d.conversions, 0);
                const weekdayConversions = weekdayDays.reduce((sum, d) => sum + d.conversions, 0);
                const bestDay = insights.peakDays.reduce((prev, curr) => prev.conversions > curr.conversions ? prev : curr);
                const totalConversions = insights.peakDays.reduce((sum, d) => sum + d.conversions, 0);
                
                return (
                  <>
                    <div>
                      <div className="text-lg font-bold text-green-600">{Math.round(weekendConversions)}</div>
                      <div className="text-xs text-slate-500">Weekend Conversions</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{Math.round(weekdayConversions)}</div>
                      <div className="text-xs text-slate-500">Weekday Conversions</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{bestDay.day}</div>
                      <div className="text-xs text-slate-500">Best Day</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{Math.round((weekendConversions / totalConversions) * 100)}%</div>
                      <div className="text-xs text-slate-500">Weekend Share</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights & Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-slate-600">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            AI-Powered Insights & Recommendations
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Analysis */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
              📊 Performance Analysis
            </h4>
            
            {(() => {
              const weekendDays = insights.peakDays?.filter(d => d.day === 'Saturday' || d.day === 'Sunday') || [];
              const weekendConversions = weekendDays.reduce((sum, d) => sum + d.conversions, 0);
              const totalConversions = insights.peakDays?.reduce((sum, d) => sum + d.conversions, 0) || 1;
              const weekendPercentage = Math.round((weekendConversions / totalConversions) * 100);
              const costPerConversion = insights.costPerConversion;
              const totalSpend = insights.totalSpend;
              
              return (
                <div className="space-y-3 text-sm">
                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-green-600">Weekend Performance:</span> {weekendPercentage}% of conversions happen on weekends, indicating strong leisure/dining out behavior.
                    </p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-blue-600">Cost Efficiency:</span> ${costPerConversion.toFixed(2)} per conversion is {costPerConversion < 15 ? 'excellent' : costPerConversion < 25 ? 'good' : 'above average'} for restaurant marketing.
                    </p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-purple-600">Investment ROI:</span> ${totalSpend.toFixed(0)} generated {insights.totalConversions} customer actions, delivering measurable business impact.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
              🎯 Actionable Recommendations
            </h4>
            
            {(() => {
              const bestDay = insights.peakDays?.reduce((prev, curr) => prev.conversions > curr.conversions ? prev : curr);
              const isWeekendBest = bestDay?.day === 'Saturday' || bestDay?.day === 'Sunday';
              
              return (
                <div className="space-y-3 text-sm">
                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-green-600">📈 Budget Optimization:</span> Increase {isWeekendBest ? 'weekend' : 'weekday'} ad spend by 20-30% to capture peak demand periods.
                    </p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-blue-600">🕒 Timing Strategy:</span> Run special promotions Thursday-Friday to drive weekend traffic and reservations.
                    </p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-purple-600">📱 Campaign Focus:</span> {insights.phoneCallConversions > insights.websiteConversions ? 'Phone call campaigns are working well - consider expanding call-only ads' : 'Website actions are strong - focus on driving online reservations'}.
                    </p>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-orange-600">🎯 Next Steps:</span> Test geo-targeted campaigns for local events and consider retargeting website visitors who didn't convert.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ROI Summary */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
            💰 Investment Value Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-600">${insights.totalSpend.toFixed(0)}</div>
              <div className="text-xs text-slate-500">Total Investment</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">{insights.totalConversions}</div>
              <div className="text-xs text-slate-500">Customer Actions Generated</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">${insights.costPerConversion.toFixed(2)}</div>
              <div className="text-xs text-slate-500">Cost Per Customer Action</div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              💡 <span className="font-medium">Bottom Line:</span> Your Google Ads are delivering consistent customer acquisition at a {insights.costPerConversion < 20 ? 'highly competitive' : 'reasonable'} cost, with clear opportunities for optimization.
            </p>
          </div>
        </div>
      </div>

      {/* Campaign Status & Top Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Status Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Campaign Status Overview
          </h3>
          {insights.topPerformingCampaigns && insights.topPerformingCampaigns.length > 0 ? (
            <div className="space-y-3">
              {insights.topPerformingCampaigns.slice(0, 3).map((campaign, index) => {
                const statusInfo = getCampaignStatusText(campaign.status);
                const statusStr = campaign.status.toString();
                const isActive = statusStr === '2' || campaign.status === 'ENABLED';
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                        {campaign.campaignName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          isActive 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        }`}>
                          {statusInfo.emoji} {statusInfo.text}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">{campaign.conversions}</p>
                      <p className="text-xs text-slate-500">conversions</p>
                    </div>
                  </div>
                );
              })}
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                💡 Consider reactivating paused campaigns to increase reach
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-500 dark:text-slate-400">No campaign data available</p>
            </div>
          )}
        </div>

        {/* Top Keywords */}
        {insights.topKeywords && insights.topKeywords.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Top Spending Keywords
            </h3>
            <div className="space-y-3">
              {insights.topKeywords.slice(0, 5).map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                      {keyword.keyword}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ${keyword.cost.toFixed(2)} spent
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{keyword.conversions || 0}</p>
                    <p className="text-xs text-slate-500">conversions</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
              💡 Focus budget on keywords with higher conversion rates
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Campaigns Tab Component
function CampaignsTab({ campaigns, demo }: { campaigns: CampaignPerformance[]; demo: boolean }) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Campaign Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Campaign</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Impressions</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Clicks</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Cost</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Conversions</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr key={campaign.campaignId} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-100">{campaign.campaignName}</div>
                      <div className="text-sm text-slate-500">{campaign.campaignType}</div>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                    {formatNumber(campaign.impressions)}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                    {formatNumber(campaign.clicks)}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                    {formatCost(campaign.cost)}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                    {formatNumber(campaign.conversions)}
                  </td>
                  <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                    {campaign.roas.toFixed(1)}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Keywords Tab Component
function KeywordsTab({ keywords, demo }: { keywords: KeywordPerformance[]; demo: boolean }) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Top Keywords
        </h3>
        
        {keywords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Keyword</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Match Type</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Impressions</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Clicks</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">CTR</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">CPC</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((keyword, index) => (
                  <tr key={keyword.keywordId} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-100">{keyword.keywordText}</div>
                      <div className="text-sm text-slate-500">{keyword.campaignName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 uppercase text-xs">
                      {keyword.matchType}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatNumber(keyword.impressions)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatNumber(keyword.clicks)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatPercentage(keyword.ctr)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatCost(keyword.cpc)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // No keywords available - likely Performance Max or AI-driven campaigns
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">
                AI-Powered Campaign Targeting
              </h4>
              <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-md mx-auto">
                Your campaigns are using AI-driven targeting (like Performance Max) that doesn't rely on traditional keywords.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 max-w-2xl mx-auto">
              <h5 className="font-medium text-slate-700 dark:text-slate-200 mb-3">
                How AI Targeting Works:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-slate-600 dark:text-slate-300">Google's AI finds customers likely to convert</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-slate-600 dark:text-slate-300">Automatically optimizes across Search, Display, YouTube, Gmail</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">🎯</span>
                    <span className="text-slate-600 dark:text-slate-300">Uses your business goals and conversion data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">📊</span>
                    <span className="text-slate-600 dark:text-slate-300">Continuously learns and improves performance</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  💡 <strong>Performance Note:</strong> AI campaigns often outperform keyword-based campaigns for local businesses, 
                  as they can discover new customer segments and opportunities that manual keyword targeting might miss.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Meta Tab Component
function MetaTab({ metaData }: { metaData: MetaAdsData | null }) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Meta Advertising Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Platform</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Spend</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {metaData && (
                <>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-100">Facebook</div>
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatMetaCost(metaData.insights.platformBreakdown.facebook.spend)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatNumber(metaData.insights.platformBreakdown.facebook.conversions)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-100">Instagram</div>
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatMetaCost(metaData.insights.platformBreakdown.instagram.spend)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatNumber(metaData.insights.platformBreakdown.instagram.conversions)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-100">Messenger</div>
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatMetaCost(metaData.insights.platformBreakdown.messenger.spend)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatNumber(metaData.insights.platformBreakdown.messenger.conversions)}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-100">Audience Network</div>
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatMetaCost(metaData.insights.platformBreakdown.audienceNetwork.spend)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatNumber(metaData.insights.platformBreakdown.audienceNetwork.conversions)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Actions Tab Component
function ActionsTab({ conversionActions, callInteractions, demo }: { conversionActions: any[]; callInteractions: any[]; demo: boolean }) {
  return (
    <div className="space-y-6">
      {/* Conversion Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Conversion Actions
        </h3>
        <div className="grid gap-4">
          {conversionActions.length > 0 ? (
            conversionActions.map((action, index) => (
              <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-100">{action.name}</h4>
                    <p className="text-sm text-slate-500">
                      Type: {action.type} • Category: {action.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{action.conversions}</div>
                    <div className="text-sm text-slate-500">conversions</div>
                  </div>
                </div>
                {action.viewThroughConversions > 0 && (
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    View-through conversions: {action.viewThroughConversions}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-8">No conversion actions found for this period</p>
          )}
        </div>
      </div>

      {/* Call Interactions */}
      {callInteractions.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Call Interactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Campaign</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Phone Calls</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Phone Impressions</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Call Through Rate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Call Type</th>
                </tr>
              </thead>
              <tbody>
                {callInteractions.map((call, index) => (
                  <tr key={index} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-100">{call.campaignName}</div>
                      <div className="text-sm text-slate-500">{call.adGroupName}</div>
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatNumber(call.phoneCalls)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatNumber(call.phoneImpressions)}
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">
                      {formatPercentage(call.phoneThroughRate)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {call.callType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Trends Tab Component
function TrendsTab({ timeSeries, demo }: { timeSeries: TimeSeriesData[]; demo: boolean }) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Performance Trends
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timeSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: 'none', 
                borderRadius: '8px', 
                color: '#f1f5f9' 
              }} 
            />
            <Line type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="conversions" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="text-slate-500 dark:text-slate-400">
          {icon}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {value}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
} 