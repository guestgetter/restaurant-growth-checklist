'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  DollarSign, 
  Eye, 
  MousePointer, 
  Calendar,
  Target,
  Utensils,
  Heart,
  FileText,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ClientData {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  currentPhase: 'Onboarding' | 'MAGNET' | 'CONVERT' | 'KEEP';
  
  // Performance metrics
  metrics: {
    // Primary Metrics
    gac: number; // Guest Acquisition Cost
    ltv: number; // Customer Lifetime Value
    repeatVisitRate: number; // %
    avgPerHeadSpend: number;
    monthlyRevenue: number;
    monthlyProfit: number;
    membershipGrowth: number; // %
    costPerOptIn: number;
    
    // Secondary Metrics
    paidReach: number;
    organicReach: number;
    emailOpenRate: number; // %
    emailClickRate: number; // %
    localSearchRanking: number; // position
    phoneCalls: number;
    directionRequests: number;
    
    // Google Ads Data (real from Koma Restaurant)
    googleAds: {
      impressions: number;
      clicks: number;
      conversions: number;
      spend: number;
      ctr: number; // %
      conversionRate: number; // %
      cpc: number;
    };
  };
  
  // Data quality scores (1-5)
  dataQuality: {
    overall: number;
    revenue: number;
    marketing: number;
    customerData: number;
  };
  
  // Recent activities
  recentActivities: Array<{
    id: string;
    type: 'campaign' | 'review' | 'booking' | 'event' | 'milestone';
    title: string;
    description: string;
    date: string;
    impact?: string;
  }>;
  
  // Action items
  actionItems: Array<{
    id: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    assignee: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
}

const sampleClientData: ClientData = {
  id: 'koma-restaurant',
  name: 'Koma Restaurant',
  industry: 'Fine Dining Japanese',
  currentPhase: 'MAGNET',
  
  metrics: {
    gac: 12.50,
    ltv: 185.00,
    repeatVisitRate: 35,
    avgPerHeadSpend: 78.50,
    monthlyRevenue: 85000,
    monthlyProfit: 18700,
    membershipGrowth: 22,
    costPerOptIn: 3.20,
    
    paidReach: 24500,
    organicReach: 8900,
    emailOpenRate: 31.5,
    emailClickRate: 6.8,
    localSearchRanking: 3,
    phoneCalls: 156,
    directionRequests: 298,
    
    // Real Google Ads data from Koma Restaurant
    googleAds: {
      impressions: 8547,
      clicks: 502,
      conversions: 43,
      spend: 528.43,
      ctr: 5.87,
      conversionRate: 8.57,
      cpc: 1.05
    }
  },
  
  dataQuality: {
    overall: 3.8,
    revenue: 4.2,
    marketing: 4.5,
    customerData: 2.9
  },
  
  recentActivities: [
    {
      id: '1',
      type: 'campaign',
      title: 'Meta Ads Campaign Launch',
      description: 'Launched "Taste of Tokyo" lead generation campaign',
      date: '2024-05-28',
      impact: '+43 new leads'
    },
    {
      id: '2',
      type: 'review',
      title: 'New 5-Star Review',
      description: '"Exceptional omakase experience. Will definitely return!"',
      date: '2024-05-27',
      impact: '+0.1 avg rating'
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Google Ads Optimization Complete',
      description: 'Meta Pixel and conversion tracking fully implemented',
      date: '2024-05-25',
      impact: '8.57% conversion rate'
    },
    {
      id: '4',
      type: 'booking',
      title: 'Private Event Booked',
      description: 'Corporate dinner for 24 guests scheduled for June 15th',
      date: '2024-05-24',
      impact: '$1,890 revenue'
    }
  ],
  
  actionItems: [
    {
      id: '1',
      title: 'Complete Google Business Profile optimization',
      priority: 'high',
      dueDate: '2024-06-05',
      assignee: 'Kyle Guilfoyle',
      status: 'in-progress'
    },
    {
      id: '2',
      title: 'Launch email welcome sequence',
      priority: 'medium',
      dueDate: '2024-06-10',
      assignee: 'Marketing Team',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Set up birthday campaign automation',
      priority: 'medium',
      dueDate: '2024-06-15',
      assignee: 'Kyle Guilfoyle',
      status: 'pending'
    }
  ]
};

const DataQualityIndicator = ({ score, label }: { score: number; label: string }) => {
  const getColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100';
    if (score >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  
  const getLabel = (score: number) => {
    if (score >= 4) return 'Dialed';
    if (score >= 3) return 'Directional';
    return 'Unknown';
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor(score)}`}>
        {score.toFixed(1)} - {getLabel(score)}
      </span>
    </div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon, 
  prefix = '', 
  suffix = '' 
}: {
  title: string;
  value: number | string;
  change?: number;
  isPositive?: boolean;
  icon: any;
  prefix?: string;
  suffix?: string;
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
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
      {change !== undefined && (
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
      )}
    </div>
  </div>
);

const ActivityItem = ({ activity }: { activity: ClientData['recentActivities'][0] }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'campaign': return Target;
      case 'review': return Star;
      case 'booking': return Calendar;
      case 'event': return Users;
      case 'milestone': return CheckCircle;
      default: return FileText;
    }
  };
  
  const getIconColor = (type: string) => {
    switch (type) {
      case 'campaign': return 'text-blue-600 bg-blue-100';
      case 'review': return 'text-yellow-600 bg-yellow-100';
      case 'booking': return 'text-green-600 bg-green-100';
      case 'event': return 'text-purple-600 bg-purple-100';
      case 'milestone': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const Icon = getIcon(activity.type);
  
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${getIconColor(activity.type)}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-600">{activity.description}</p>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-xs text-gray-500">{activity.date}</span>
          {activity.impact && (
            <span className="text-xs text-green-600 font-medium">{activity.impact}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionItemCard = ({ item }: { item: ClientData['actionItems'][0] }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      default: return AlertTriangle;
    }
  };

  const StatusIcon = getStatusIcon(item.status);
  
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">{item.title}</h4>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Due: {item.dueDate}</span>
            <span>Assigned: {item.assignee}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
          {item.priority}
        </span>
      </div>
    </div>
  );
};

export default function ClientPerformanceDashboard() {
  const [client] = useState<ClientData>(sampleClientData);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'metrics' | 'activities' | 'actions'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'metrics', label: 'Metrics', icon: Target },
    { id: 'activities', label: 'Activities', icon: Calendar },
    { id: 'actions', label: 'Action Items', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {client.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                <p className="text-gray-600">{client.industry}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    client.currentPhase === 'MAGNET' ? 'text-blue-600 bg-blue-100' :
                    client.currentPhase === 'CONVERT' ? 'text-green-600 bg-green-100' :
                    client.currentPhase === 'KEEP' ? 'text-purple-600 bg-purple-100' :
                    'text-gray-600 bg-gray-100'
                  }`}>
                    Current Phase: {client.currentPhase}
                  </span>
                  <DataQualityIndicator score={client.dataQuality.overall} label="Data Quality" />
                </div>
              </div>
            </div>
                         <div className="flex items-center gap-3">
               <a 
                 href="/checklist"
                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
               >
                 <CheckCircle className="h-4 w-4" />
                 View Growth Checklist
               </a>
               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                 <Download className="h-4 w-4" />
                 Export Report
               </button>
             </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {selectedTab === 'overview' && (
            <>
              {/* Key Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Monthly Revenue"
                  value={client.metrics.monthlyRevenue}
                  change={12.5}
                  isPositive={true}
                  icon={DollarSign}
                  prefix="$"
                />
                <MetricCard
                  title="Guest Acquisition Cost"
                  value={client.metrics.gac}
                  change={-8.2}
                  isPositive={true}
                  icon={Users}
                  prefix="$"
                />
                <MetricCard
                  title="Customer Lifetime Value"
                  value={client.metrics.ltv}
                  change={15.3}
                  isPositive={true}
                  icon={Heart}
                  prefix="$"
                />
                <MetricCard
                  title="Repeat Visit Rate"
                  value={client.metrics.repeatVisitRate}
                  change={5.7}
                  isPositive={true}
                  icon={TrendingUp}
                  suffix="%"
                />
              </div>

              {/* Google Ads Performance */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Google Ads Performance (Live Data)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{client.metrics.googleAds.impressions.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Impressions</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{client.metrics.googleAds.clicks}</p>
                    <p className="text-sm text-gray-600">Clicks</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{client.metrics.googleAds.conversions}</p>
                    <p className="text-sm text-gray-600">Conversions</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">${client.metrics.googleAds.spend}</p>
                    <p className="text-sm text-gray-600">Spend (CAD)</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">{client.metrics.googleAds.ctr}%</p>
                    <p className="text-xs text-gray-600">Click-Through Rate</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">{client.metrics.googleAds.conversionRate}%</p>
                    <p className="text-xs text-gray-600">Conversion Rate</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-semibold text-gray-900">${client.metrics.googleAds.cpc}</p>
                    <p className="text-xs text-gray-600">Cost Per Click</p>
                  </div>
                </div>
              </div>

              {/* Growth Phase Progress */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Growth System Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { phase: 'Onboarding', progress: 100, color: 'bg-green-500' },
                    { phase: 'MAGNET', progress: 65, color: 'bg-blue-500' },
                    { phase: 'CONVERT', progress: 20, color: 'bg-orange-500' },
                    { phase: 'KEEP', progress: 5, color: 'bg-purple-500' }
                  ].map((item) => (
                    <div key={item.phase} className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-2">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 32 32">
                          <circle
                            cx="16"
                            cy="16"
                            r="14"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="16"
                            cy="16"
                            r="14"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            className={item.color.replace('bg-', 'text-')}
                            strokeDasharray={`${item.progress} 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-semibold">{item.progress}%</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{item.phase}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedTab === 'metrics' && (
            <>
              {/* Primary Metrics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Primary Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    title="Guest Acquisition Cost"
                    value={client.metrics.gac}
                    icon={Users}
                    prefix="$"
                  />
                  <MetricCard
                    title="Customer Lifetime Value"
                    value={client.metrics.ltv}
                    icon={Heart}
                    prefix="$"
                  />
                  <MetricCard
                    title="Avg Per Head Spend"
                    value={client.metrics.avgPerHeadSpend}
                    icon={Utensils}
                    prefix="$"
                  />
                  <MetricCard
                    title="Monthly Profit"
                    value={client.metrics.monthlyProfit}
                    icon={DollarSign}
                    prefix="$"
                  />
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Secondary Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    title="Paid Reach"
                    value={client.metrics.paidReach}
                    icon={Eye}
                  />
                  <MetricCard
                    title="Organic Reach"
                    value={client.metrics.organicReach}
                    icon={TrendingUp}
                  />
                  <MetricCard
                    title="Email Open Rate"
                    value={client.metrics.emailOpenRate}
                    icon={Mail}
                    suffix="%"
                  />
                  <MetricCard
                    title="Phone Calls"
                    value={client.metrics.phoneCalls}
                    icon={Phone}
                  />
                </div>
              </div>

              {/* Data Quality Breakdown */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Quality Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <DataQualityIndicator score={client.dataQuality.revenue} label="Revenue Tracking" />
                  <DataQualityIndicator score={client.dataQuality.marketing} label="Marketing Attribution" />
                  <DataQualityIndicator score={client.dataQuality.customerData} label="Customer Data" />
                  <DataQualityIndicator score={client.dataQuality.overall} label="Overall Score" />
                </div>
              </div>
            </>
          )}

          {selectedTab === 'activities' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
              <div className="space-y-2">
                {client.recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'actions' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Action Items</h2>
              {client.actionItems.map((item) => (
                <ActionItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 