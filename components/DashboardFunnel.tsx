'use client';

import React, { useState, useEffect } from 'react';
import { Eye, MousePointer, Heart, Users, TrendingUp, Edit3, Save, X, Database, ChevronDown, ChevronRight } from 'lucide-react';

interface FunnelStageData {
  value: number;
  sources: Array<{ name: string; value: number; color: string }>;
  lastUpdated: string;
  dataSource: 'api' | 'manual' | 'imported';
  notes?: string;
}

interface DashboardFunnelProps {
  secondaryMetrics: Record<string, any>;
  isDataEntryMode: boolean;
}

export default function DashboardFunnel({ secondaryMetrics, isDataEntryMode }: DashboardFunnelProps) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [editingStage, setEditingStage] = useState<string | null>(null);
  
  // Initialize funnel data with persistence capability
  const [funnelData, setFunnelData] = useState<Record<string, FunnelStageData>>({
    attention: {
      value: 24500,
      sources: [
        { name: 'Google Ads', value: 12400, color: 'bg-blue-500' },
        { name: 'Meta Ads', value: 8900, color: 'bg-blue-600' },
        { name: 'Search/Organic', value: 3200, color: 'bg-blue-400' }
      ],
      lastUpdated: new Date().toISOString().split('T')[0],
      dataSource: 'manual',
      notes: 'Combined impressions across all channels'
    },
    interest: {
      value: 1210,
      sources: [
        { name: 'Google Ads', value: 680, color: 'bg-green-500' },
        { name: 'Meta Ads', value: 420, color: 'bg-green-600' },
        { name: 'Search/Organic', value: 110, color: 'bg-green-400' }
      ],
      lastUpdated: new Date().toISOString().split('T')[0],
      dataSource: 'manual',
      notes: 'Clicks and engagement actions'
    },
    desire: {
      value: 485,
      sources: [
        { name: 'Menu Views', value: 280, color: 'bg-yellow-500' },
        { name: 'Location/Hours', value: 125, color: 'bg-yellow-600' },
        { name: 'Reviews Read', value: 80, color: 'bg-yellow-400' }
      ],
      lastUpdated: new Date().toISOString().split('T')[0],
      dataSource: 'manual',
      notes: 'Intent signals - deeper engagement'
    },
    action: {
      value: 89,
      sources: [
        { name: 'Online Reservations', value: 52, color: 'bg-orange-500' },
        { name: 'Phone Calls', value: 28, color: 'bg-orange-600' },
        { name: 'Walk-ins (est)', value: 9, color: 'bg-orange-400' }
      ],
      lastUpdated: new Date().toISOString().split('T')[0],
      dataSource: 'manual',
      notes: 'Meaningful actions taken'
    }
  });

  const stages = [
    {
      key: 'attention',
      name: 'Attention',
      icon: Eye,
      subtitle: 'Impressions & Views',
      description: 'Total reach across all marketing channels',
      width: 400,
      color: 'from-blue-100 to-blue-200',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-600'
    },
    {
      key: 'interest', 
      name: 'Interest',
      icon: MousePointer,
      subtitle: 'Clicks & Engagement',
      description: 'People who showed interest by clicking or engaging',
      width: 320,
      color: 'from-green-100 to-green-200',
      borderColor: 'border-green-300',
      textColor: 'text-green-600'
    },
    {
      key: 'desire',
      name: 'Desire',
      icon: Heart,
      subtitle: 'Intent Signals',
      description: 'Deeper engagement showing purchase intent',
      width: 240,
      color: 'from-yellow-100 to-yellow-200',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-600'
    },
    {
      key: 'action',
      name: 'Action',
      icon: Users,
      subtitle: 'Meaningful Actions',
      description: 'Reservations, calls, and direct conversions',
      width: 160,
      color: 'from-orange-100 to-orange-200',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-600'
    }
  ];

  // Calculate conversion rates
  const conversionRates = {
    attentionToInterest: ((funnelData.interest.value / funnelData.attention.value) * 100).toFixed(1),
    interestToDesire: ((funnelData.desire.value / funnelData.interest.value) * 100).toFixed(1),
    desireToAction: ((funnelData.action.value / funnelData.desire.value) * 100).toFixed(1)
  };

  const toggleStage = (stageKey: string) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageKey)) {
      newExpanded.delete(stageKey);
    } else {
      newExpanded.add(stageKey);
    }
    setExpandedStages(newExpanded);
  };

  // Load funnel data on component mount
  useEffect(() => {
    const loadFunnelData = async () => {
      try {
        const response = await fetch('/api/funnel');
        if (response.ok) {
          const data = await response.json();
          setFunnelData(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error('Failed to load funnel data:', error);
      }
    };

    loadFunnelData();
  }, []);

  const handleStageEdit = async (stageKey: string, newValue: string, notes?: string) => {
    const updatedData = {
      ...funnelData,
      [stageKey]: {
        ...funnelData[stageKey],
        value: parseInt(newValue.replace(/[^\d]/g, '')) || 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        dataSource: 'manual',
        notes: notes || `Updated manually on ${new Date().toLocaleDateString()}`
      }
    };

    setFunnelData(updatedData as Record<string, FunnelStageData>);
    setEditingStage(null);
    
    // Save to database
    try {
      const response = await fetch('/api/funnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ funnelData: updatedData })
      });

      if (!response.ok) {
        throw new Error('Failed to save funnel data');
      }
      
      console.log('✅ Funnel data saved successfully');
    } catch (error) {
      console.error('❌ Failed to save funnel data:', error);
      // Fallback to localStorage
      localStorage.setItem('dashboardFunnelData', JSON.stringify(updatedData));
    }
  };

  const getDataSourceIcon = (source: string) => {
    switch (source) {
      case 'api': return <Database className="text-green-600" size={12} />;
      case 'manual': return <Edit3 className="text-blue-600" size={12} />;
      case 'imported': return <TrendingUp className="text-purple-600" size={12} />;
      default: return <Database className="text-gray-600" size={12} />;
    }
  };

  const FunnelStage = ({ stage, data, conversionRate }: { 
    stage: any; 
    data: FunnelStageData; 
    conversionRate?: string;
  }) => {
    const isExpanded = expandedStages.has(stage.key);
    const isEditing = editingStage === stage.key;
    const Icon = stage.icon;

    return (
      <div className="flex flex-col items-center mb-6">
        {/* Conversion Rate */}
        {conversionRate && (
          <div className="mb-2 text-sm font-medium text-gray-600">
            {conversionRate}% conversion
          </div>
        )}
        
        {/* Funnel Stage */}
        <div 
          className={`bg-gradient-to-b ${stage.color} rounded-lg border-2 ${stage.borderColor} flex flex-col items-center justify-center p-4 transition-all hover:shadow-lg cursor-pointer`}
          style={{ width: `${stage.width}px`, minHeight: '120px' }}
          onClick={() => !isEditing && toggleStage(stage.key)}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <Icon className={`h-6 w-6 ${stage.textColor}`} />
            {!isEditing && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </div>
          
          <h3 className="font-semibold text-gray-900 text-center text-sm mb-1">
            {stage.name}
          </h3>
          
          {isEditing && isDataEntryMode ? (
            <EditableFunnelValue 
              value={data.value.toString()}
              onSave={(newValue, notes) => handleStageEdit(stage.key, newValue, notes)}
              onCancel={() => setEditingStage(null)}
            />
          ) : (
            <p 
              className={`text-2xl font-bold ${stage.textColor} ${
                isDataEntryMode ? 'cursor-pointer hover:bg-yellow-100 rounded px-1' : ''
              }`}
              onClick={(e) => {
                if (isDataEntryMode) {
                  e.stopPropagation();
                  setEditingStage(stage.key);
                }
              }}
            >
              {data.value.toLocaleString()}
            </p>
          )}
          
          <p className="text-xs text-gray-600 text-center mt-1">
            {stage.subtitle}
          </p>
          
          <div className="flex items-center gap-1 mt-2">
            {getDataSourceIcon(data.dataSource)}
            <span className="text-xs text-gray-500">{data.dataSource}</span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4 w-80">
            <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
            
            {/* Source Breakdown */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 text-sm">Source Breakdown:</h4>
              {data.sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                    <span className="text-gray-600">{source.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">{source.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            {data.notes && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                <strong>Notes:</strong> {data.notes}
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-400">
              Last updated: {data.lastUpdated}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          AIDA Marketing Funnel
        </h2>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Attention → Interest → Desire → Action
        </span>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.key}>
            <FunnelStage 
              stage={stage}
              data={funnelData[stage.key]}
              conversionRate={index === 0 ? undefined : 
                             index === 1 ? conversionRates.attentionToInterest :
                             index === 2 ? conversionRates.interestToDesire :
                             conversionRates.desireToAction}
            />
            {index < stages.length - 1 && (
              <div className="text-gray-400 text-2xl">↓</div>
            )}
          </div>
        ))}

        {/* Retention */}
        <div className="text-gray-400 text-2xl mt-4">↓</div>
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-b from-purple-100 to-purple-200 rounded-lg border-2 border-purple-300 flex flex-col items-center justify-center p-4"
               style={{ width: '120px', minHeight: '100px' }}>
            <Heart className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 text-center text-sm mb-1">
              Retention
            </h3>
            <p className="text-2xl font-bold text-purple-600">34%</p>
            <p className="text-xs text-gray-600 text-center mt-1">Return Visits</p>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Conversion Insights:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <p className="font-semibold text-blue-600">{conversionRates.attentionToInterest}%</p>
            <p className="text-gray-600">Attention → Interest</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-orange-600">{conversionRates.desireToAction}%</p>
            <p className="text-gray-600">Desire → Action</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-purple-600">34%</p>
            <p className="text-gray-600">Customer Retention</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Editable Funnel Value Component
function EditableFunnelValue({ 
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
        className="w-full text-xl font-bold bg-white border border-gray-300 rounded px-2 py-1 text-center"
        autoFocus
      />
      <input
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full text-xs bg-white border border-gray-300 rounded px-2 py-1"
      />
      <div className="flex gap-2 justify-center">
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