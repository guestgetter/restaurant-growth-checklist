'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Eye, 
  MousePointer, 
  Target,
  Utensils,
  Heart,
  Phone,
  MapPin,
  Star,
  Calendar,
  BarChart3,
  Database,
  Edit3,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface RestaurantMetrics {
  // Core Restaurant KPIs
  monthlyRevenue: number;
  avgOrderValue: number;
  customerLifetimeValue: number;
  customerAcquisitionCost: number;
  repeatCustomerRate: number;
  
  // Marketing Performance
  googleAds: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    cpc: number;
    conversionRate: number;
  };
  
  metaAds: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    cpc: number;
    reach: number;
  };
  
  // Manual Entry Data (until integrations ready)
  couponTools: {
    activeCoupons: number;
    redemptions: number;
    savings: number;
    conversionRate: number;
  };
  
  searchData: {
    avgPosition: number;
    impressions: number;
    clicks: number;
    keywords: number;
  };
}

interface RestaurantClientData {
  id: string;
  name: string;
  type: string;
  metrics: RestaurantMetrics;
  lastUpdated: string;
}

// Sample data for both restaurants
const sampleData: Record<string, RestaurantClientData> = {
  'amano-trattoria': {
    id: 'amano-trattoria',
    name: 'Amano Trattoria',
    type: 'Italian Fine Dining',
    metrics: {
      monthlyRevenue: 125000,
      avgOrderValue: 85,
      customerLifetimeValue: 420,
      customerAcquisitionCost: 18,
      repeatCustomerRate: 45,
      
      googleAds: {
        impressions: 12400,
        clicks: 680,
        conversions: 52,
        spend: 1240,
        ctr: 5.48,
        cpc: 1.82,
        conversionRate: 7.65
      },
      
      metaAds: {
        impressions: 8900,
        clicks: 310,
        conversions: 28,
        spend: 890,
        ctr: 3.48,
        cpc: 2.87,
        reach: 6200
      },
      
      couponTools: {
        activeCoupons: 3,
        redemptions: 127,
        savings: 2540,
        conversionRate: 12.3
      },
      
      searchData: {
        avgPosition: 3.2,
        impressions: 4500,
        clicks: 280,
        keywords: 45
      }
    },
    lastUpdated: new Date().toISOString()
  },
  
  'the-berczy-tavern': {
    id: 'the-berczy-tavern',
    name: 'The Berczy Tavern',
    type: 'Canadian Gastropub',
    metrics: {
      monthlyRevenue: 98000,
      avgOrderValue: 62,
      customerLifetimeValue: 280,
      customerAcquisitionCost: 15,
      repeatCustomerRate: 38,
      
      googleAds: {
        impressions: 15600,
        clicks: 890,
        conversions: 67,
        spend: 1450,
        ctr: 5.71,
        cpc: 1.63,
        conversionRate: 7.53
      },
      
      metaAds: {
        impressions: 11200,
        clicks: 420,
        conversions: 31,
        spend: 1100,
        ctr: 3.75,
        cpc: 2.62,
        reach: 7800
      },
      
      couponTools: {
        activeCoupons: 4,
        redemptions: 156,
        savings: 1870,
        conversionRate: 9.8
      },
      
      searchData: {
        avgPosition: 2.8,
        impressions: 6200,
        clicks: 380,
        keywords: 38
      }
    },
    lastUpdated: new Date().toISOString()
  }
};

const MetricCard = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon, 
  prefix = '', 
  suffix = '',
  dataSource = 'api'
}: {
  title: string;
  value: number | string;
  change?: number;
  isPositive?: boolean;
  icon: any;
  prefix?: string;
  suffix?: string;
  dataSource?: 'api' | 'manual';
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {change !== undefined && (
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          {dataSource === 'api' ? (
            <Database className="h-3 w-3 text-green-600" />
          ) : (
            <Edit3 className="h-3 w-3 text-blue-600" />
          )}
          <span className="text-xs text-gray-500">{dataSource}</span>
        </div>
      </div>
    </div>
  </div>
);

const PlatformSection = ({ 
  title, 
  data, 
  icon: Icon, 
  dataSource = 'api' 
}: { 
  title: string; 
  data: any; 
  icon: any; 
  dataSource?: 'api' | 'manual';
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="flex items-center gap-1">
        {dataSource === 'api' ? (
          <Database className="h-4 w-4 text-green-600" />
        ) : (
          <Edit3 className="h-4 w-4 text-blue-600" />
        )}
        <span className="text-sm text-gray-500">{dataSource === 'api' ? 'Live Data' : 'Manual Entry'}</span>
      </div>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-900">
            {typeof value === 'number' && key.includes('spend') ? `$${value.toLocaleString()}` :
             typeof value === 'number' && (key.includes('rate') || key.includes('ctr')) ? `${value}%` :
             typeof value === 'number' && key.includes('cpc') ? `$${value}` :
             typeof value === 'number' ? value.toLocaleString() : String(value)}
          </p>
          <p className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function RestaurantClientDashboard({ clientId }: { clientId: string }) {
  const [client] = useState<RestaurantClientData>(sampleData[clientId]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('last30days');

  if (!client) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Client Not Found</h2>
        <p className="text-gray-600">Client ID "{clientId}" not found in the system.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-gray-600">{client.type}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Active Client
                </span>
                <span className="text-sm text-gray-500">
                  Last updated: {new Date(client.lastUpdated).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={selectedTimeRange} 
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Core Restaurant KPIs */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Core Restaurant KPIs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Monthly Revenue"
              value={client.metrics.monthlyRevenue}
              change={8.2}
              isPositive={true}
              icon={DollarSign}
              prefix="$"
              dataSource="api"
            />
            <MetricCard
              title="Avg Order Value"
              value={client.metrics.avgOrderValue}
              change={3.1}
              isPositive={true}
              icon={Utensils}
              prefix="$"
              dataSource="api"
            />
            <MetricCard
              title="Customer LTV"
              value={client.metrics.customerLifetimeValue}
              change={12.5}
              isPositive={true}
              icon={Heart}
              prefix="$"
              dataSource="api"
            />
            <MetricCard
              title="Acquisition Cost"
              value={client.metrics.customerAcquisitionCost}
              change={-5.3}
              isPositive={true}
              icon={Users}
              prefix="$"
              dataSource="api"
            />
            <MetricCard
              title="Repeat Rate"
              value={client.metrics.repeatCustomerRate}
              change={2.8}
              isPositive={true}
              icon={TrendingUp}
              suffix="%"
              dataSource="api"
            />
          </div>
        </div>

        {/* Platform Performance */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Marketing Platform Performance</h2>
          
          {/* Google Ads */}
          <PlatformSection
            title="Google Ads Performance"
            data={client.metrics.googleAds}
            icon={Target}
            dataSource="api"
          />
          
          {/* Meta Ads */}
          <PlatformSection
            title="Meta Ads Performance"
            data={client.metrics.metaAds}
            icon={Eye}
            dataSource="api"
          />
          
          {/* CouponTools - Manual Entry */}
          <PlatformSection
            title="CouponTools Performance"
            data={client.metrics.couponTools}
            icon={Star}
            dataSource="manual"
          />
          
          {/* Search Data - Manual Entry */}
          <PlatformSection
            title="Search Performance (SEM Rush)"
            data={client.metrics.searchData}
            icon={BarChart3}
            dataSource="manual"
          />
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
              <h4 className="font-medium text-green-900">Strong Performance</h4>
              <p className="text-sm text-green-700">Google Ads conversion rate at 7.5%+ is excellent</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="h-5 w-5 text-blue-600 mb-2" />
              <h4 className="font-medium text-blue-900">Optimization Opportunity</h4>
              <p className="text-sm text-blue-700">Increase Meta Ads reach to match Google performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 