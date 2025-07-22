'use client';

import { useState, useEffect } from 'react';
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
  Zap,
  ArrowRight,
  Calendar,
  Edit3,
  Save,
  X,
  Database,
  TrendingUp as TrendUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import DashboardFunnel from '../../components/DashboardFunnel';

interface MetricData {
  value: string | number;
  change: number;
  dataQuality: 1 | 2 | 3 | 4 | 5;
  trend: 'up' | 'down' | 'stable';
  lastUpdated?: string;
  dataSource: 'api' | 'manual' | 'imported';
  notes?: string;
}

interface ChecklistItem {
  name: string;
  completed: boolean;
  description: string;
}

interface ActionStep {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface MetricWithChecklist {
  metric: MetricData;
  checklist: ChecklistItem[];
  benchmarkCategory: 'excellent' | 'good' | 'average' | 'below-average' | 'poor';
  actionSteps: ActionStep[];
}

interface HistoricalDataPoint {
  date: string;
  value: string | number;
  source: 'api' | 'manual' | 'imported';
}

export default function DashboardPage() {
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());
  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('current');
  const [isDataEntryMode, setIsDataEntryMode] = useState(false);

  const toggleMetric = (metricKey: string) => {
    const newExpanded = new Set(expandedMetrics);
    if (newExpanded.has(metricKey)) {
      newExpanded.delete(metricKey);
    } else {
      newExpanded.add(metricKey);
    }
    setExpandedMetrics(newExpanded);
  };

  // Helper function to get benchmark assessment
  const getBenchmarkAssessment = (key: string, value: string | number): 'excellent' | 'good' | 'average' | 'below-average' | 'poor' => {
    switch (key) {
      case 'gac':
        const gacValue = parseFloat(value.toString().replace('$', ''));
        if (gacValue < 15) return 'excellent';
        if (gacValue < 25) return 'good';
        if (gacValue < 40) return 'average';
        if (gacValue < 60) return 'below-average';
        return 'poor';

      case 'ltv':
        const ltvValue = parseFloat(value.toString().replace('$', ''));
        if (ltvValue > 200) return 'excellent';
        if (ltvValue > 150) return 'good';
        if (ltvValue > 100) return 'average';
        if (ltvValue > 75) return 'below-average';
        return 'poor';

      case 'repeatRate':
        const repeatValue = parseFloat(value.toString().replace('%', ''));
        if (repeatValue > 45) return 'excellent';
        if (repeatValue > 35) return 'good';
        if (repeatValue > 25) return 'average';
        if (repeatValue > 15) return 'below-average';
        return 'poor';

      case 'avgSpend':
        const spendValue = parseFloat(value.toString().replace('$', ''));
        if (spendValue > 35) return 'excellent';
        if (spendValue > 25) return 'good';
        if (spendValue > 18) return 'average';
        if (spendValue > 12) return 'below-average';
        return 'poor';

      case 'monthlyRevenue':
        return 'good';

      case 'membershipGrowth':
        const growthValue = parseInt(value.toString().replace('+', ''));
        if (growthValue > 100) return 'excellent';
        if (growthValue > 50) return 'good';
        if (growthValue > 25) return 'average';
        if (growthValue > 10) return 'below-average';
        return 'poor';

      case 'costPerOptIn':
        const optInValue = parseFloat(value.toString().replace('$', ''));
        if (optInValue < 2) return 'excellent';
        if (optInValue < 4) return 'good';
        if (optInValue < 7) return 'average';
        if (optInValue < 10) return 'below-average';
        return 'poor';

      default:
        return 'average';
    }
  };

  // Primary Metrics Data with manual entry capabilities
  const [primaryMetricsData, setPrimaryMetricsData] = useState<Record<string, MetricWithChecklist>>({
    gac: {
      metric: { 
        value: '$12.45', 
        change: -8.2, 
        dataQuality: 4, 
        trend: 'down',
        lastUpdated: '2025-01-06',
        dataSource: 'api',
        notes: 'Pulled from Google Ads API'
      },
      checklist: [
        { name: 'Meta & Google Pixels installed', completed: true, description: 'Tracking pixels properly configured' },
        { name: 'UTM parameters on campaigns', completed: true, description: 'Campaign tracking structure in place' },
        { name: 'Conversion attribution setup', completed: false, description: 'Attribution model needs configuration' }
      ],
      benchmarkCategory: getBenchmarkAssessment('gac', '$12.45'),
      actionSteps: [
        { title: 'Optimize referral program', description: 'Your $12.45 CAC is excellent vs industry avg $27-83. Double down on word-of-mouth marketing and referral incentives to maintain this efficiency.', priority: 'high' },
        { title: 'Invest in organic content', description: 'Focus budget on SEO and social content creation since your acquisition costs are already well below benchmarks.', priority: 'medium' },
        { title: 'Test premium channels', description: 'With such efficient CAC, experiment with higher-cost channels like influencer partnerships for growth.', priority: 'low' }
      ]
    },
    ltv: {
      metric: { 
        value: '$156.78', 
        change: 12.3, 
        dataQuality: 3, 
        trend: 'up',
        lastUpdated: '2025-01-05',
        dataSource: 'manual',
        notes: 'Calculated from POS data - awaiting full integration'
      },
      checklist: [
        { name: 'POS integration active', completed: true, description: 'Point of sale system connected' },
        { name: 'Customer ID tracking', completed: false, description: 'Unique customer identification needed' },
        { name: 'Visit history tracking', completed: true, description: 'Historical visit data available' }
      ],
      benchmarkCategory: getBenchmarkAssessment('ltv', '$156.78'),
      actionSteps: [
        { title: 'Launch loyalty program', description: 'Your $156 LTV is good but can reach $200+. Implement points-based rewards to increase visit frequency by 15-25%.', priority: 'high' },
        { title: 'Upsell training for staff', description: 'Train team on suggestive selling techniques. Industry leaders see 20-30% higher per-visit spend through effective upselling.', priority: 'high' },
        { title: 'Email retention campaigns', description: 'Deploy automated win-back campaigns for guests who haven\'t visited in 30+ days to boost lifetime value.', priority: 'medium' }
      ]
    },
    repeatRate: {
      metric: { 
        value: '34.2%', 
        change: 5.1, 
        dataQuality: 2, 
        trend: 'up',
        lastUpdated: '2025-01-04',
        dataSource: 'imported',
        notes: 'Historical data imported from previous system'
      },
      checklist: [
        { name: 'Loyalty system active', completed: true, description: 'Loyalty program in place' },
        { name: 'Email engagement tracking', completed: true, description: 'Email open rates monitored' },
        { name: 'Visit frequency analysis', completed: false, description: 'Detailed visit pattern tracking needed' }
      ],
      benchmarkCategory: getBenchmarkAssessment('repeatRate', '34.2%'),
      actionSteps: [
        { title: 'Personalize guest experiences', description: 'At 34% repeat rate (industry avg 25-35%), implement personalized menu recommendations and birthday campaigns to reach 45%+.', priority: 'high' },
        { title: 'Optimize visit intervals', description: 'Analyze guest visit patterns and send targeted offers at optimal timing to encourage return visits.', priority: 'medium' },
        { title: 'Staff recognition training', description: 'Train staff to remember regular customers\' preferences - personal touch increases repeat visits by 20%.', priority: 'medium' }
      ]
    },
    avgSpend: {
      metric: { 
        value: '$28.50', 
        change: 2.8, 
        dataQuality: 5, 
        trend: 'up',
        lastUpdated: '2025-01-06',
        dataSource: 'api',
        notes: 'Real-time POS integration active'
      },
      checklist: [
        { name: 'POS transaction tracking', completed: true, description: 'Complete transaction data available' },
        { name: 'Menu engineering analysis', completed: true, description: 'Menu profitability tracked' },
        { name: 'Upselling metrics', completed: true, description: 'Staff upselling performance measured' }
      ],
      benchmarkCategory: getBenchmarkAssessment('avgSpend', '$28.50'),
      actionSteps: [
        { title: 'Strategic menu positioning', description: 'Your $28.50 spend is strong vs $18-25 average. Test premium items and limited-time offers to push toward $35+ benchmark.', priority: 'high' },
        { title: 'Bundling opportunities', description: 'Create attractive meal bundles and combo deals that increase transaction value while providing guest value.', priority: 'medium' },
        { title: 'Beverage program expansion', description: 'Focus on higher-margin beverages and desserts - these categories can boost check averages by 15-20%.', priority: 'low' }
      ]
    }
  });

  // Date range options
  const dateRanges = [
    { id: 'current', label: 'Current Period', description: 'Latest available data' },
    { id: 'last30', label: 'Last 30 Days', description: 'Past month performance' },
    { id: 'last90', label: 'Last 90 Days', description: 'Quarterly view' },
    { id: 'ytd', label: 'Year to Date', description: 'January 1st to now' },
    { id: 'custom', label: 'Custom Range', description: 'Select specific dates' }
  ];

  // Manual data entry handlers
  const handleMetricEdit = (metricKey: string, newValue: string, notes?: string) => {
    setPrimaryMetricsData(prev => ({
      ...prev,
      [metricKey]: {
        ...prev[metricKey],
        metric: {
          ...prev[metricKey].metric,
          value: newValue,
          lastUpdated: new Date().toISOString().split('T')[0],
          dataSource: 'manual',
          notes: notes || `Updated manually on ${new Date().toLocaleDateString()}`
        },
        benchmarkCategory: getBenchmarkAssessment(metricKey, newValue)
      }
    }));
    setEditingMetric(null);
  };

  const getBenchmarkColor = (category: string) => {
    switch (category) {
      case 'excellent': return 'text-green-700 bg-green-100 border-green-300';
      case 'good': return 'text-blue-700 bg-blue-100 border-blue-300';
      case 'average': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'below-average': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'poor': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getBenchmarkLabel = (category: string) => {
    switch (category) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'average': return 'Average';
      case 'below-average': return 'Below Avg';
      case 'poor': return 'Poor';
      default: return 'Unknown';
    }
  };

  const getCompletionPercentage = (checklist: ChecklistItem[]) => {
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getDataSourceIcon = (source: string) => {
    switch (source) {
      case 'api': return <Database className="text-green-600" size={12} />;
      case 'manual': return <Edit3 className="text-blue-600" size={12} />;
      case 'imported': return <TrendUp className="text-purple-600" size={12} />;
      default: return <AlertCircle className="text-gray-600" size={12} />;
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up' || change > 0) return <TrendUp className="text-green-600" size={12} />;
    if (trend === 'down' || change < 0) return <TrendingDown className="text-red-600" size={12} />;
    return <Minus className="text-gray-600" size={12} />;
  };

  // Secondary Metrics Data
  const secondaryMetrics: Record<string, MetricData> = {
    attentionTrend: { value: '+12.3%', change: 8.1, dataQuality: 3, trend: 'up', dataSource: 'api' },
    paidReach: { value: '2.4K', change: 15.2, dataQuality: 4, trend: 'up', dataSource: 'api' },
    organicReach: { value: '1.8K', change: -3.4, dataQuality: 2, trend: 'down', dataSource: 'manual' },
    emailEngagement: { value: '24.1%', change: 6.7, dataQuality: 4, trend: 'up', dataSource: 'api' },
    searchRankings: { value: '#3', change: 12.0, dataQuality: 3, trend: 'up', dataSource: 'manual' },
    callsDirections: { value: '89', change: 21.3, dataQuality: 2, trend: 'up', dataSource: 'imported' }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Controls */}
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
        
        {/* Data Entry Mode Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDataEntryMode(!isDataEntryMode)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isDataEntryMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <Edit3 size={16} />
            {isDataEntryMode ? 'Exit Edit Mode' : 'Edit Data'}
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="text-slate-500" size={16} />
          <span className="font-medium text-slate-800 dark:text-slate-100">Time Period</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {dateRanges.map(range => (
            <button
              key={range.id}
              onClick={() => setSelectedDateRange(range.id)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedDateRange === range.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              <div className="font-medium">{range.label}</div>
              <div className="text-xs opacity-75">{range.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Data Entry Mode Banner */}
      {isDataEntryMode && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Edit3 size={16} />
            <span className="font-medium">Data Entry Mode Active</span>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            Click on any metric value to edit manually. Perfect for when API integrations aren't ready yet.
          </p>
        </div>
      )}

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
          {Object.entries(primaryMetricsData).map(([key, { metric, checklist, benchmarkCategory, actionSteps }]) => {
            const isExpanded = expandedMetrics.has(key);
            const isEditing = editingMetric === key;
            const completionPercentage = getCompletionPercentage(checklist);
            
            return (
              <div key={key} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  onClick={() => !isEditing && toggleMetric(key)}
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
                    {!isEditing && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    {isEditing && isDataEntryMode ? (
                      <EditableMetricValue 
                        value={metric.value.toString()}
                        onSave={(newValue, notes) => handleMetricEdit(key, newValue, notes)}
                        onCancel={() => setEditingMetric(null)}
                      />
                    ) : (
                      <span 
                        className={`text-2xl font-bold text-slate-900 dark:text-slate-100 ${
                          isDataEntryMode ? 'cursor-pointer hover:bg-yellow-100 rounded px-1' : ''
                        }`}
                        onClick={(e) => {
                          if (isDataEntryMode) {
                            e.stopPropagation();
                            setEditingMetric(key);
                          }
                        }}
                      >
                        {metric.value}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend, metric.change)}
                      <span className={`text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change >= 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-xs px-2 py-1 rounded ${completionPercentage === 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {completionPercentage}% Setup
                    </div>
                    <div className="flex items-center gap-1">
                      {getDataSourceIcon(metric.dataSource)}
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {metric.dataSource}
                      </span>
                    </div>
                  </div>

                  <div className={`px-2 py-1 rounded text-xs border w-fit ${getBenchmarkColor(benchmarkCategory)}`}>
                    {getBenchmarkLabel(benchmarkCategory)} vs Industry
                  </div>

                  {metric.notes && (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                      {metric.notes}
                    </div>
                  )}

                  {metric.lastUpdated && (
                    <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Updated: {metric.lastUpdated}
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    {/* Action Steps */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3 text-sm flex items-center gap-2">
                        <ArrowRight size={16} className="text-blue-600" />
                        Action Steps (Industry Benchmarks)
                      </h4>
                      <div className="space-y-3">
                        {actionSteps.map((step, index) => (
                          <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-start gap-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(step.priority)}`}>
                                {step.priority.toUpperCase()}
                              </span>
                              <h5 className="font-medium text-slate-800 dark:text-slate-100 text-sm flex-1">
                                {step.title}
                              </h5>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enablement Checklist */}
                    <div className="p-4">
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
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend, metric.change)}
                  <span className={`text-xs ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {getDataSourceIcon(metric.dataSource)}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {metric.dataSource}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AIDA Marketing Funnel */}
      <DashboardFunnel secondaryMetrics={secondaryMetrics} isDataEntryMode={isDataEntryMode} />

    </div>
  );
}

// Editable Metric Value Component
function EditableMetricValue({ 
  value, 
  onSave, 
  onCancel 
}: { 
  value: string; 
  onSave: (value: string, notes?: string) => void; 
  onCancel: () => void; 
}) {
  const [editValue, setEditValue] = useState(value);
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-2 min-w-0 flex-1">
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        className="w-full text-xl font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
        autoFocus
      />
      <input
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSave(editValue, notes)}
          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center gap-1"
        >
          <Save size={12} />
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 flex items-center gap-1"
        >
          <X size={12} />
          Cancel
        </button>
      </div>
    </div>
  );
} 