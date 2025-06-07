import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '../../lib/prisma';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, Repeat, Mail, Phone, Eye, Search, 
  CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronRight, BarChart3,
  Target, Zap, ArrowRight, Calendar, Edit3, Save, X, Database,
  TrendingUp as TrendUp, TrendingDown, Minus, FileText
} from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================
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

// ============================================================================
// CLIENT COMPONENT
// ============================================================================
const DashboardClient = ({ metrics, clientName }: { metrics: Record<string, MetricWithChecklist>, clientName: string }) => {
  'use client';

  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());
  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('current');
  const [isDataEntryMode, setIsDataEntryMode] = useState(false);
  const [primaryMetricsData, setPrimaryMetricsData] = useState(metrics);

  const toggleMetric = (metricKey: string) => {
    const newExpanded = new Set(expandedMetrics);
    if (newExpanded.has(metricKey)) newExpanded.delete(metricKey);
    else newExpanded.add(metricKey);
    setExpandedMetrics(newExpanded);
  };

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

  const getBenchmarkColor = (category: string) => ({
    'excellent': 'text-green-500', 'good': 'text-emerald-500', 'average': 'text-yellow-500',
    'below-average': 'text-orange-500', 'poor': 'text-red-500'
  }[category] || 'text-gray-500');

  const getBenchmarkLabel = (category: string) => category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');

  const getCompletionPercentage = (checklist: ChecklistItem[]) => {
    if (!checklist || checklist.length === 0) return 0;
    const completedCount = checklist.filter(item => item.completed).length;
    return Math.round((completedCount / checklist.length) * 100);
  };

  const getPriorityColor = (priority: string) => ({
    'high': 'bg-red-500', 'medium': 'bg-yellow-500', 'low': 'bg-green-500'
  }[priority] || 'bg-gray-400');

  const getDataSourceIcon = (source: string) => {
    if (source === 'api') return <Database className="h-4 w-4 text-blue-500" />;
    if (source === 'manual') return <Edit3 className="h-4 w-4 text-orange-500" />;
    if (source === 'imported') return <FileText className="h-4 w-4 text-purple-500" />;
    return null;
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <TrendUp className={`h-5 w-5 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`} />;
    if (trend === 'down') return <TrendingDown className={`h-5 w-5 ${change < 0 ? 'text-green-500' : 'text-red-500'}`} />;
    return <Minus className="h-5 w-5 text-gray-500" />;
  };
  
  const dateRanges = [
    { id: 'current', label: 'Current Period' }, { id: 'last30', label: 'Last 30 Days' },
    { id: 'last90', label: 'Last 90 Days' }, { id: 'ytd', label: 'Year to Date' },
    { id: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Displaying data for: <span className="font-semibold text-primary">{clientName}</span>
          </p>
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
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ isDataEntryMode ? 'bg-primary' : 'bg-gray-300' }`}
                  >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ isDataEntryMode ? 'translate-x-6' : 'translate-x-1' }`} />
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

function EditableMetricValue({ value, onSave, onCancel }: { value: string; onSave: (value: string, notes?: string) => void; onCancel: () => void; }) {
  const [currentValue, setCurrentValue] = useState(value);
  const [notes, setNotes] = useState('');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <input type="text" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} className="w-24 p-1 text-lg font-bold border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" autoFocus />
        <button onClick={() => onSave(currentValue, notes)} className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"><Save className="h-4 w-4" /></button>
        <button onClick={onCancel} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"><X className="h-4 w-4" /></button>
      </div>
      <input type="text" placeholder="Add notes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-1 text-xs border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
    </div>
  );
}


// ============================================================================
// SERVER COMPONENT (Default Export)
// ============================================================================
async function getCurrentClient(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      clients: {
        where: { isActive: true },
      },
    },
  });
  return user?.clients[0] ?? null;
}

async function getMetricsData(clientId: string): Promise<Record<string, MetricWithChecklist>> {
  console.log(`Fetching metrics for client: ${clientId}`);
  // This is placeholder data. In a real application, you'd fetch this from a database.
  return {
    gac: {
      metric: { value: '$12.45', change: -8.2, dataQuality: 4, trend: 'down', lastUpdated: '2025-01-06', dataSource: 'api', notes: 'Pulled from Google Ads API' },
      checklist: [
        { name: 'Meta & Google Pixels installed', completed: true, description: '...' },
        { name: 'UTM parameters on campaigns', completed: true, description: '...' },
        { name: 'Conversion attribution setup', completed: false, description: '...' }
      ],
      benchmarkCategory: 'excellent' as const,
      actionSteps: [
        { title: 'Optimize referral program', description: 'Your $12.45 CAC is excellent...', priority: 'high' as const },
      ]
    },
     ltv: {
      metric: { value: '$156.78', change: 12.3, dataQuality: 3, trend: 'up', lastUpdated: '2025-01-05', dataSource: 'manual', notes: 'Calculated from POS data' },
      checklist: [],
      benchmarkCategory: 'good' as const,
      actionSteps: [
        { title: 'Launch loyalty program', description: '...', priority: 'high' as const },
      ]
    },
     repeatRate: {
      metric: { value: '34.2%', change: 5.1, dataQuality: 2, trend: 'up', lastUpdated: '2025-01-04', dataSource: 'imported', notes: 'Historical data import' },
       checklist: [],
      benchmarkCategory: 'good' as const,
      actionSteps: [
        { title: 'Personalize guest experiences', description: '...', priority: 'high' as const },
      ]
    },
     avgSpend: {
      metric: { value: '$28.50', change: 2.8, dataQuality: 5, trend: 'up', lastUpdated: '2025-01-06', dataSource: 'api', notes: 'Real-time POS integration' },
       checklist: [],
      benchmarkCategory: 'good' as const,
      actionSteps: [
        { title: 'Strategic menu positioning', description: '...', priority: 'high' as const },
      ]
    }
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const currentClient = await getCurrentClient(session.user.id);

  if (!currentClient) {
    return (
      <div className="flex-1 p-8 text-center">
        <h1 className="text-2xl font-bold">No Active Client Selected</h1>
        <p className="mt-2 text-gray-600">Please select a client from the sidebar to view their dashboard.</p>
      </div>
    );
  }

  const metrics = await getMetricsData(currentClient.id);

  return <DashboardClient metrics={metrics} clientName={currentClient.name} />;
} 