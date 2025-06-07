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
  Minus,
  FileText
} from 'lucide-react';

// Keep the interface definitions here for the client component
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

interface DashboardClientProps {
  metrics: Record<string, MetricWithChecklist>;
  clientName: string;
}

export default function DashboardClient({ metrics, clientName }: DashboardClientProps) {
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());
  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('current');
  const [isDataEntryMode, setIsDataEntryMode] = useState(false);
  const [primaryMetricsData, setPrimaryMetricsData] = useState(metrics);

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

  const dateRanges = [
    { id: 'current', label: 'Current Period', description: 'Latest available data' },
    { id: 'last30', label: 'Last 30 Days', description: 'Past month performance' },
    { id: 'last90', label: 'Last 90 Days', description: 'Quarterly view' },
    { id: 'ytd', label: 'Year to Date', description: 'January 1st to now' },
    { id: 'custom', label: 'Custom Range', description: 'Select specific dates' }
  ];

  const handleMetricEdit = (metricKey: string, newValue: string, notes?: string) => {
    // This will be replaced by a server action
    setPrimaryMetricsData(prev => ({
      ...prev,
      [metricKey]: {
        ...prev[metricKey],
        metric: {
          ...prev[metricKey].metric,
          value: newValue,
          notes: notes || prev[metricKey].metric.notes,
          dataSource: 'manual',
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      }
    }));
    setEditingMetric(null);
  };
  
  const getBenchmarkColor = (category: string) => {
    switch (category) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-emerald-500';
      case 'average': return 'text-yellow-500';
      case 'below-average': return 'text-orange-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getBenchmarkLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  };

  const getCompletionPercentage = (checklist: ChecklistItem[]) => {
    const completedCount = checklist.filter(item => item.completed).length;
    return Math.round((completedCount / checklist.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getDataSourceIcon = (source: string) => {
    switch(source) {
      case 'api': return <Database className="h-4 w-4 text-blue-500" />;
      case 'manual': return <Edit3 className="h-4 w-4 text-orange-500" />;
      case 'imported': return <FileText className="h-4 w-4 text-purple-500" />;
      default: return null;
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <TrendUp className={`h-5 w-5 ${change > 0 ? 'text-green-500' : 'text-red-500'}`} />;
    if (trend === 'down') return <TrendingDown className={`h-5 w-5 ${change < 0 ? 'text-green-500' : 'text-red-500'}`} />;
    return <Minus className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Key metrics and growth opportunities for your restaurant.</p>
        </header>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:flex-wrap">
            {dateRanges.map(range => (
              <button
                key={range.id}
                onClick={() => setSelectedDateRange(range.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedDateRange === range.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
            <div className="col-span-2 sm:col-span-1 flex items-center justify-end flex-1">
              <div className="flex items-center gap-2">
                  <label htmlFor="data-entry-toggle" className="text-sm font-medium text-gray-700">Manual Entry</label>
                  <button
                      id="data-entry-toggle"
                      onClick={() => setIsDataEntryMode(!isDataEntryMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDataEntryMode ? 'bg-primary' : 'bg-gray-300'
                      }`}
                  >
                      <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isDataEntryMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                  </button>
              </div>
            </div>
          </div>
        </div>

        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(primaryMetricsData).map(([key, data]) => {
            const isExpanded = expandedMetrics.has(key);
            const isEditing = editingMetric === key;
            const completion = getCompletionPercentage(data.checklist);

            return (
              <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md">
                <div className="p-4 cursor-pointer" onClick={() => toggleMetric(key)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                          {isEditing ? (
                              <EditableMetricValue 
                                  value={data.metric.value.toString()}
                                  onSave={(newValue, notes) => handleMetricEdit(key, newValue, notes)}
                                  onCancel={() => setEditingMetric(null)}
                              />
                          ) : (
                              <p className="text-2xl font-bold text-gray-800">{data.metric.value}</p>
                          )}
                          
                          {isDataEntryMode && !isEditing && (
                              <button onClick={(e) => { e.stopPropagation(); setEditingMetric(key); }} className="p-1 rounded-full hover:bg-gray-100">
                                  <Edit3 className="h-4 w-4 text-gray-500" />
                              </button>
                          )}
                      </div>
                    </div>
                    {getTrendIcon(data.metric.trend, data.metric.change)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    {getDataSourceIcon(data.metric.dataSource)}
                    <span>{data.metric.dataSource}</span>
                    <span className="text-gray-300">|</span>
                    <span className={getBenchmarkColor(data.benchmarkCategory)}>
                      {getBenchmarkLabel(data.benchmarkCategory)}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-gray-50/70 p-4 border-t border-gray-200">
                    <h4 className="font-semibold text-sm mb-2 text-gray-700">Action Steps</h4>
                    <ul className="space-y-2 text-xs">
                      {data.actionSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${getPriorityColor(step.priority)}`}></div>
                          <div>
                            <span className="font-medium text-gray-800">{step.title}: </span>
                            <span className="text-gray-600">{step.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <h4 className="font-semibold text-sm mt-4 mb-2 text-gray-700">Data Quality Checklist</h4>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${completion}%` }}></div>
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {data.checklist.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {item.completed ? <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" /> : <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                          <span className="text-gray-700">{item.name}</span>
                        </li>
                      ))}
                    </ul>

                    {data.metric.notes && (
                      <div className="mt-4 text-xs text-gray-500 bg-yellow-50 border border-yellow-200 p-2 rounded-md">
                        <strong>Notes:</strong> {data.metric.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>
    </div>
  );
}

function EditableMetricValue({ 
  value, 
  onSave, 
  onCancel 
}: { 
  value: string; 
  onSave: (value: string, notes?: string) => void; 
  onCancel: () => void; 
}) {
  const [currentValue, setCurrentValue] = useState(value);
  const [notes, setNotes] = useState('');

  return (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
            <input 
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="w-24 p-1 text-lg font-bold border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                autoFocus
            />
            <button onClick={() => onSave(currentValue, notes)} className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600">
                <Save className="h-4 w-4" />
            </button>
            <button onClick={onCancel} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600">
                <X className="h-4 w-4" />
            </button>
        </div>
        <input
            type="text"
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-1 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
        />
    </div>
  );
} 