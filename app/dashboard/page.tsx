'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Repeat, 
  Mail, 
  Phone, 
  Eye, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

interface MetricData {
  value: string | number;
  change: number;
  dataQuality: 1 | 2 | 3 | 4 | 5;
  trend: 'up' | 'down' | 'stable';
}

interface ChecklistItem {
  name: string;
  completed: boolean;
  description: string;
}

interface MetricWithChecklist {
  metric: MetricData;
  checklist: ChecklistItem[];
}

export default function DashboardPage() {
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());

  const toggleMetric = (metricKey: string) => {
    const newExpanded = new Set(expandedMetrics);
    if (newExpanded.has(metricKey)) {
      newExpanded.delete(metricKey);
    } else {
      newExpanded.add(metricKey);
    }
    setExpandedMetrics(newExpanded);
  };

  // Primary Metrics Data
  const primaryMetrics: Record<string, MetricWithChecklist> = {
    gac: {
      metric: { value: '$12.45', change: -8.2, dataQuality: 4, trend: 'down' },
      checklist: [
        { name: 'Meta & Google Pixels installed', completed: true, description: 'Tracking pixels properly configured' },
        { name: 'UTM parameters on all campaigns', completed: true, description: 'All campaigns using proper UTM structure' },
        { name: 'Funnel attribution in place', completed: false, description: 'Attribution model needs configuration' },
        { name: 'Conversion events firing correctly', completed: true, description: 'All conversion events tracking properly' }
      ]
    },
    ltv: {
      metric: { value: '$156.78', change: 12.3, dataQuality: 3, trend: 'up' },
      checklist: [
        { name: 'POS integration active', completed: true, description: 'Point of sale system connected' },
        { name: 'Customer ID tracking', completed: false, description: 'Unique customer identification needed' },
        { name: 'Visit history data', completed: true, description: 'Historical visit data available' },
        { name: 'Revenue attribution', completed: false, description: 'Revenue properly attributed to customers' }
      ]
    },
    repeatRate: {
      metric: { value: '34.2%', change: 5.1, dataQuality: 2, trend: 'up' },
      checklist: [
        { name: 'POS visit tracking', completed: false, description: 'Point of sale visit tracking setup' },
        { name: 'Loyalty system (digital or analog)', completed: true, description: 'Loyalty program in place' },
        { name: 'Email/SMS open + click history', completed: true, description: 'Email engagement tracking active' },
        { name: 'WiFi login tracking', completed: false, description: 'WiFi login system needs setup' }
      ]
    },
    avgSpend: {
      metric: { value: '$28.50', change: 2.8, dataQuality: 5, trend: 'up' },
      checklist: [
        { name: 'POS transaction data', completed: true, description: 'Complete transaction data available' },
        { name: 'Item-level tracking', completed: true, description: 'Individual item sales tracked' },
        { name: 'Time-based analysis', completed: true, description: 'Time-based spending patterns tracked' },
        { name: 'Customer segmentation', completed: true, description: 'Customer segments properly defined' }
      ]
    },
    monthlyRevenue: {
      metric: { value: '$45,230', change: 18.7, dataQuality: 5, trend: 'up' },
      checklist: [
        { name: 'Complete POS integration', completed: true, description: 'All revenue sources tracked' },
        { name: 'Real-time sync', completed: true, description: 'Data syncs in real-time' },
        { name: 'Multiple payment methods', completed: true, description: 'All payment types captured' },
        { name: 'Refund/void tracking', completed: true, description: 'Returns and voids properly handled' }
      ]
    },
    membershipGrowth: {
      metric: { value: '+127', change: 23.4, dataQuality: 4, trend: 'up' },
      checklist: [
        { name: 'Email capture system', completed: true, description: 'Email collection active' },
        { name: 'Phone number collection', completed: true, description: 'Phone number gathering in place' },
        { name: 'Birthday collection', completed: false, description: 'Birthday data collection needed' },
        { name: 'Opt-in tracking', completed: true, description: 'Opt-in status properly tracked' }
      ]
    },
    costPerOptIn: {
      metric: { value: '$3.24', change: -12.1, dataQuality: 3, trend: 'down' },
      checklist: [
        { name: 'Campaign cost tracking', completed: true, description: 'All campaign costs tracked' },
        { name: 'Opt-in attribution', completed: false, description: 'Opt-ins need campaign attribution' },
        { name: 'Channel breakdown', completed: true, description: 'Cost per channel available' },
        { name: 'Conversion funnel', completed: false, description: 'Full conversion funnel tracking needed' }
      ]
    }
  };

  // Secondary Metrics Data
  const secondaryMetrics: Record<string, MetricData> = {
    attentionTrend: { value: '+12.3%', change: 8.1, dataQuality: 3, trend: 'up' },
    paidReach: { value: '2.4K', change: 15.2, dataQuality: 4, trend: 'up' },
    organicReach: { value: '1.8K', change: -3.4, dataQuality: 2, trend: 'down' },
    emailEngagement: { value: '24.1%', change: 6.7, dataQuality: 4, trend: 'up' },
    searchRankings: { value: '#3', change: 12.0, dataQuality: 3, trend: 'up' },
    callsDirections: { value: '89', change: 21.3, dataQuality: 2, trend: 'up' }
  };

  const getDataQualityColor = (quality: number) => {
    switch (quality) {
      case 1: return 'text-red-600 bg-red-50 border-red-200';
      case 2: return 'text-orange-600 bg-orange-50 border-orange-200';
      case 3: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 4: return 'text-blue-600 bg-blue-50 border-blue-200';
      case 5: return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDataQualityLabel = (quality: number) => {
    switch (quality) {
      case 1: return 'Unknown';
      case 2: return 'Poor';
      case 3: return 'Directional';
      case 4: return 'Good';
      case 5: return 'Dialed';
      default: return 'Unknown';
    }
  };

  const getCompletionPercentage = (checklist: ChecklistItem[]) => {
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={32} />
            Growth Operating System
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Your control center for performance, readiness, and data accuracy
          </p>
        </div>
      </div>

      {/* Primary Metrics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Primary Metrics
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            (what matters most)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(primaryMetrics).map(([key, { metric, checklist }]) => {
            const isExpanded = expandedMetrics.has(key);
            const completionPercentage = getCompletionPercentage(checklist);
            
            return (
              <div key={key} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  onClick={() => toggleMetric(key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                      {key === 'gac' && 'Guest Acquisition Cost'}
                      {key === 'ltv' && 'Guest Lifetime Value'}
                      {key === 'repeatRate' && 'Repeat Visit Rate'}
                      {key === 'avgSpend' && 'Avg Per Head Spend'}
                      {key === 'monthlyRevenue' && 'Monthly Revenue'}
                      {key === 'membershipGrowth' && 'Membership Growth'}
                      {key === 'costPerOptIn' && 'Cost Per Opt-In'}
                    </h3>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {metric.value}
                    </span>
                    <span className={`text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`px-2 py-1 rounded text-xs border ${getDataQualityColor(metric.dataQuality)}`}>
                      {getDataQualityLabel(metric.dataQuality)}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${completionPercentage === 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {completionPercentage}% Setup
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                    <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3 text-sm">
                      Enablement Checklist
                    </h4>
                    <div className="space-y-2">
                      {checklist.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          {item.completed ? (
                            <CheckCircle className="text-green-600 mt-0.5" size={16} />
                          ) : (
                            <XCircle className="text-red-500 mt-0.5" size={16} />
                          )}
                          <div>
                            <p className={`text-xs font-medium ${item.completed ? 'text-green-700' : 'text-red-700'}`}>
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Metrics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="text-purple-600" size={24} />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Secondary Metrics
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            (visibility & awareness)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(secondaryMetrics).map(([key, metric]) => (
            <div key={key} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-medium text-slate-800 dark:text-slate-100 text-sm mb-2">
                {key === 'attentionTrend' && 'Attention Trend'}
                {key === 'paidReach' && 'Paid Reach'}
                {key === 'organicReach' && 'Organic Reach'}
                {key === 'emailEngagement' && 'Email Engagement'}
                {key === 'searchRankings' && 'Search Rankings'}
                {key === 'callsDirections' && 'Calls & Directions'}
              </h3>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {metric.value}
                </span>
                <span className={`text-xs ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
              </div>

              <div className={`px-2 py-1 rounded text-xs border w-fit ${getDataQualityColor(metric.dataQuality)}`}>
                {getDataQualityLabel(metric.dataQuality)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality Overview */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Why This Matters
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Everyone knows what matters
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Clear visibility into the metrics that drive restaurant growth
            </p>
          </div>
          
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Everyone sees what's missing
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Data quality scores show exactly where to improve tracking
            </p>
          </div>
          
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Everyone builds toward the same numbers
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Client and team aligned on consistent metrics across all restaurants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 