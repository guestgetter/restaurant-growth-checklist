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
  BarChart3,
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
  change?: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated?: string;
  dataSource: 'api' | 'manual' | 'imported';
  notes?: string;
  timePeriod?: string;
}

export default function DashboardPage() {
  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('last30');
  const [isDataEntryMode, setIsDataEntryMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Current Marketing Metrics - What we have today
  const [primaryMetricsData, setPrimaryMetricsData] = useState<Record<string, MetricData>>({});

  // Load metrics data on component mount
  useEffect(() => {
    const loadMetricsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/metrics');
        if (response.ok) {
          const data = await response.json();
          
          // Filter out totalReach completely - we don't want this metric
          const { totalReach, ...filteredData } = data;
          
          setPrimaryMetricsData(filteredData);
        } else {
          throw new Error(`Failed to load metrics: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to load metrics data:', error);
        setError('Unable to load metrics data. Using defaults.');
        // Set fallback data - focus on current tools
        setPrimaryMetricsData({
          gac: { 
            value: '$12.45', 
            trend: 'stable',
            lastUpdated: new Date().toISOString().split('T')[0],
            dataSource: 'api',
            timePeriod: 'Last 30 Days',
            notes: 'Combined from Google Ads + Meta Ads'
          },
          emailOptIns: { 
            value: '485', 
            trend: 'up',
            lastUpdated: new Date().toISOString().split('T')[0],
            dataSource: 'manual',
            timePeriod: 'Last 30 Days',
            notes: 'New email subscribers this period'
          },

        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMetricsData();
  }, []);

  // Date range options with clear time periods
  const dateRanges = [
    { id: 'last7', label: 'Last 7 Days', description: 'Past week' },
    { id: 'last30', label: 'Last 30 Days', description: 'Past month' },
    { id: 'last90', label: 'Last 90 Days', description: 'Past quarter' },
    { id: 'ytd', label: 'Year to Date', description: 'Jan 1st to now' },
    { id: 'custom', label: 'Custom Range', description: 'Select dates' }
  ];

  // Get current time period label
  const getCurrentTimePeriod = () => {
    const selected = dateRanges.find(range => range.id === selectedDateRange);
    return selected ? selected.label : 'Current Period';
  };

  // Manual data entry handlers with API persistence
  const handleMetricEdit = async (metricKey: string, newValue: string, notes?: string, timePeriod?: string) => {
    // Don't allow editing totalReach - remove it completely
    if (metricKey === 'totalReach') {
      console.log('Ignoring totalReach edit - this metric should not exist');
      return;
    }
    
    // Validate input
    if (!newValue || newValue.trim() === '') {
      setError('Value cannot be empty');
      return;
    }

    const updatedData = {
      ...primaryMetricsData,
      [metricKey]: {
        ...primaryMetricsData[metricKey],
        value: newValue,
        lastUpdated: new Date().toISOString().split('T')[0],
        dataSource: 'manual' as const,
        timePeriod: timePeriod || getCurrentTimePeriod(),
        notes: notes || `Updated manually for ${getCurrentTimePeriod()}`
      }
    };

    // Update UI immediately for better UX
    setPrimaryMetricsData(updatedData);
    setEditingMetric(null);
    setSaveStatus('saving');
    setError(null);
    
    // Save to database (filter out totalReach)
    try {
      const { totalReach, ...dataToSave } = updatedData;
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metricsData: dataToSave })
      });

      const result = await response.json();

      if (response.ok) {
        setSaveStatus('saved');
        if (result.fallback) {
          setError('⚠️ Data updated locally but not saved to database yet');
        } else {
          // Clear any previous errors
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
        console.log('✅ Dashboard metrics saved successfully');
      } else {
        throw new Error(result.message || 'Failed to save metrics data');
      }
    } catch (error) {
      console.error('❌ Failed to save metrics data:', error);
      setSaveStatus('error');
      setError('Failed to save data. Changes are temporary until you refresh.');
      
      // Fallback to localStorage for recovery
      try {
        localStorage.setItem('dashboardMetricsData', JSON.stringify(updatedData));
        setError('Failed to save to database. Data saved locally as backup.');
      } catch (localError) {
        setError('Failed to save data. Please try again.');
      }
    }
  };

  const getDataSourceIcon = (source: string) => {
    switch (source) {
      case 'api': return <Database className="text-green-600" size={12} />;
      case 'manual': return <Edit3 className="text-blue-600" size={12} />;
      case 'imported': return <TrendUp className="text-purple-600" size={12} />;
      default: return <Database className="text-gray-600" size={12} />;
    }
  };

  const getTrendIcon = (trend: string, change?: number) => {
    if (trend === 'up' || (change && change > 0)) return <TrendUp className="text-green-600" size={16} />;
    if (trend === 'down' || (change && change < 0)) return <TrendingDown className="text-red-600" size={16} />;
    return <Minus className="text-gray-600" size={16} />;
  };

  const getMetricIcon = (key: string) => {
    switch (key) {
      case 'gac': return <DollarSign className="text-blue-600" size={20} />;
      case 'emailOptIns': return <Mail className="text-green-600" size={20} />;

      default: return <BarChart3 className="text-gray-600" size={20} />;
    }
  };

  const getMetricTitle = (key: string) => {
    switch (key) {
      case 'gac': return 'Guest Acquisition Cost';
      case 'emailOptIns': return 'Email Opt-ins';

      default: return key;
    }
  };



  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading dashboard metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={32} />
            Growth Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track performance and manage your restaurant's growth metrics
          </p>
        </div>
        
        {/* Data Entry Mode Toggle */}
        <div className="flex items-center gap-4">
          {/* Save Status Indicator */}
          {saveStatus !== 'idle' && (
            <div className="flex items-center gap-2">
              {saveStatus === 'saving' && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-600">Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-green-600">Saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">Error</span>
                </>
              )}
            </div>
          )}
          
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

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-sm text-yellow-800 dark:text-yellow-200">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-yellow-600 hover:text-yellow-800"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Time Period Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="text-blue-600" size={20} />
          <span className="font-semibold text-slate-800 dark:text-slate-100">Time Period</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            - All metrics below reflect data for the selected period
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {dateRanges.map(range => (
            <button
              key={range.id}
              onClick={() => setSelectedDateRange(range.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
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
        
        {/* Current Period Display */}
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Calendar size={16} />
            <span className="font-medium">Currently viewing: {getCurrentTimePeriod()}</span>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            When you edit data manually, it will be tagged with this time period for context.
          </p>
        </div>
      </div>

      {/* Data Entry Mode Banner */}
      {isDataEntryMode && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <Edit3 size={16} />
            <span className="font-medium">Data Entry Mode Active</span>
          </div>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
            Click any metric value to edit. All edits will be tagged with the current time period: <strong>{getCurrentTimePeriod()}</strong>
          </p>
        </div>
      )}



      {/* AIDA Marketing Funnel */}
      <DashboardFunnel isDataEntryMode={isDataEntryMode} clientId={undefined} />

    </div>
  );
}

// Enhanced Editable Metric Value Component with Time Period Context
function EditableMetricValue({ 
  value, 
  currentTimePeriod,
  onSave, 
  onCancel 
}: { 
  value: string; 
  currentTimePeriod: string;
  onSave: (value: string, notes?: string, timePeriod?: string) => void; 
  onCancel: () => void; 
}) {
  const [editValue, setEditValue] = useState(value);
  const [notes, setNotes] = useState('');
  const [timePeriod, setTimePeriod] = useState(currentTimePeriod);

  return (
    <div className="space-y-3 min-w-0 flex-1">
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        className="w-full text-2xl font-bold bg-white border border-gray-300 rounded px-3 py-2 text-center"
        placeholder="Enter value"
        autoFocus
      />
      
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Time period (optional)"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="w-full text-sm bg-white border border-gray-300 rounded px-2 py-1"
        />
        
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full text-sm bg-white border border-gray-300 rounded px-2 py-1"
        />
      </div>
      
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => onSave(editValue, notes, timePeriod)}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
        >
          <Save size={12} />
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center gap-1"
        >
          <X size={12} />
          Cancel
        </button>
      </div>
    </div>
  );
} 