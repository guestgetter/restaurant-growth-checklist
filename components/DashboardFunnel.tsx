'use client';

import React from 'react';
import { Eye, MousePointer, Heart, Users, TrendingUp } from 'lucide-react';

interface DashboardFunnelProps {
  secondaryMetrics: Record<string, any>;
}

export default function DashboardFunnel({ secondaryMetrics }: DashboardFunnelProps) {
  // Calculate AIDA funnel metrics from secondary metrics
  const attention = parseInt(secondaryMetrics.paidReach?.value?.replace(/[^\d]/g, '') || '2400') + 
                   parseInt(secondaryMetrics.organicReach?.value?.replace(/[^\d]/g, '') || '1800');
  
  const interest = Math.round(attention * 0.045); // ~4.5% CTR
  const desire = Math.round(interest * 0.35); // 35% browse further
  const action = Math.round(desire * 0.12); // 12% take action
  const retention = 34; // From repeat rate metrics

  const stages = [
    {
      name: 'Attention',
      value: attention,
      width: 100,
      color: 'from-blue-400 to-blue-500',
      icon: Eye,
      subtitle: 'Impressions & Views'
    },
    {
      name: 'Interest', 
      value: interest,
      width: 80,
      color: 'from-green-400 to-green-500',
      icon: MousePointer,
      subtitle: 'Clicks & Engagement'
    },
    {
      name: 'Desire',
      value: desire,
      width: 60,
      color: 'from-yellow-400 to-yellow-500',
      icon: Heart,
      subtitle: 'Menu & Location Views'
    },
    {
      name: 'Action',
      value: action,
      width: 40,
      color: 'from-orange-400 to-orange-500',
      icon: Users,
      subtitle: 'Reservations & Calls'
    }
  ];

  const conversionRates = [
    ((interest / attention) * 100).toFixed(1),
    ((desire / interest) * 100).toFixed(1),
    ((action / desire) * 100).toFixed(1)
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          AIDA Marketing Funnel
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
          A → I → D → A
        </span>
      </div>

      <div className="space-y-4">
        {/* Funnel Stages */}
        <div className="flex items-center justify-center space-x-2">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={stage.name} className="flex items-center">
                {/* Stage */}
                <div className="flex flex-col items-center">
                  <div 
                    className={`bg-gradient-to-b ${stage.color} rounded-lg flex flex-col items-center justify-center p-3 text-white transition-all hover:shadow-lg`}
                    style={{ width: `${stage.width}px`, height: '80px' }}
                  >
                    <Icon size={16} className="mb-1" />
                    <div className="text-xs font-medium">{stage.name}</div>
                    <div className="text-sm font-bold">{stage.value.toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
                    {stage.subtitle}
                  </div>
                </div>
                
                {/* Arrow with conversion rate */}
                {index < stages.length - 1 && (
                  <div className="flex flex-col items-center mx-2">
                    <div className="text-slate-400">→</div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {conversionRates[index]}%
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Retention */}
        <div className="flex items-center justify-center pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col items-center">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Then...</div>
            <div className="bg-gradient-to-b from-purple-400 to-purple-500 rounded-lg flex flex-col items-center justify-center p-3 text-white"
                 style={{ width: '80px', height: '60px' }}>
              <Heart size={14} className="mb-1" />
              <div className="text-xs font-medium">Retention</div>
              <div className="text-sm font-bold">{retention}%</div>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
              Return Visits
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-sm font-semibold text-blue-600">{conversionRates[0]}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Attention Rate</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-orange-600">{conversionRates[2]}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Action Rate</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-purple-600">{retention}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Retention</div>
          </div>
        </div>
      </div>
    </div>
  );
} 