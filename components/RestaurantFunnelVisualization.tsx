'use client';

import React from 'react';
import { Eye, MousePointer, Phone, Users, Heart } from 'lucide-react';

interface FunnelData {
  attention: {
    value: number;
    label: string;
    sources: Array<{ name: string; value: number; color: string }>;
  };
  interest: {
    value: number;
    label: string;
    sources: Array<{ name: string; value: number; color: string }>;
  };
  desire: {
    value: number;
    label: string;
    sources: Array<{ name: string; value: number; color: string }>;
  };
  meaningfulAction: {
    value: number;
    label: string;
    sources: Array<{ name: string; value: number; color: string }>;
  };
  retention: {
    value: number;
    label: string;
    color: string;
  };
}

interface RestaurantFunnelProps {
  clientId: string;
  googleAdsData: any;
  metaAdsData: any;
  searchData: any;
  monthlyRevenue: number;
  repeatCustomerRate: number;
}

export default function RestaurantFunnelVisualization({ 
  clientId, 
  googleAdsData, 
  metaAdsData, 
  searchData,
  monthlyRevenue,
  repeatCustomerRate 
}: RestaurantFunnelProps) {
  
  // Calculate funnel metrics from existing data using AIDA framework
  const funnelData: FunnelData = {
    attention: {
      value: googleAdsData.impressions + metaAdsData.impressions + searchData.impressions,
      label: 'Total Impressions & Views',
      sources: [
        { name: 'Google Ads', value: googleAdsData.impressions, color: 'bg-blue-500' },
        { name: 'Meta Ads', value: metaAdsData.impressions, color: 'bg-blue-600' },
        { name: 'Search', value: searchData.impressions, color: 'bg-blue-400' }
      ]
    },
    interest: {
      value: googleAdsData.clicks + metaAdsData.clicks + searchData.clicks,
      label: 'Clicks & Engagement',
      sources: [
        { name: 'Google Ads', value: googleAdsData.clicks, color: 'bg-green-500' },
        { name: 'Meta Ads', value: metaAdsData.clicks, color: 'bg-green-600' },
        { name: 'Search', value: searchData.clicks, color: 'bg-green-400' }
      ]
    },
    desire: {
      value: Math.round((googleAdsData.clicks + metaAdsData.clicks) * 0.65), // Estimated desire actions
      label: 'Menu Views & Location Lookups',
      sources: [
        { name: 'Menu Views', value: Math.round(googleAdsData.clicks * 0.4), color: 'bg-yellow-500' },
        { name: 'Location/Hours', value: Math.round(metaAdsData.clicks * 0.3), color: 'bg-yellow-600' },
        { name: 'Reviews Read', value: Math.round(searchData.clicks * 0.2), color: 'bg-yellow-400' }
      ]
    },
    meaningfulAction: {
      value: googleAdsData.conversions + metaAdsData.conversions + Math.round(searchData.clicks * 0.08),
      label: 'Reservations, Orders & Inquiries',
      sources: [
        { name: 'Online Reservations', value: googleAdsData.conversions, color: 'bg-orange-500' },
        { name: 'Phone Calls', value: metaAdsData.conversions, color: 'bg-orange-600' },
        { name: 'Walk-ins', value: Math.round(searchData.clicks * 0.08), color: 'bg-orange-400' }
      ]
    },
    retention: {
      value: repeatCustomerRate,
      label: 'Repeat Customer Rate',
      color: 'bg-purple-500'
    }
  };

  // Calculate conversion rates between AIDA stages
  const interestRate = ((funnelData.interest.value / funnelData.attention.value) * 100).toFixed(1);
  const desireRate = ((funnelData.desire.value / funnelData.interest.value) * 100).toFixed(1);
  const actionRate = ((funnelData.meaningfulAction.value / funnelData.desire.value) * 100).toFixed(1);

  const FunnelStage = ({ 
    stage, 
    icon: Icon, 
    width, 
    conversionRate 
  }: { 
    stage: any; 
    icon: any; 
    width: number; 
    conversionRate?: string;
  }) => (
    <div className="flex flex-col items-center mb-6">
      {/* Conversion Rate */}
      {conversionRate && (
        <div className="mb-2 text-sm font-medium text-gray-600">
          {conversionRate}% conversion
        </div>
      )}
      
      {/* Funnel Shape */}
      <div 
        className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300 flex flex-col items-center justify-center p-4 transition-all hover:shadow-lg"
        style={{ width: `${width}px`, minHeight: '120px' }}
      >
        <Icon className="h-6 w-6 text-blue-600 mb-2" />
        <h3 className="font-semibold text-gray-900 text-center text-sm mb-1">
          {stage.label}
        </h3>
        <p className="text-2xl font-bold text-blue-600">
          {stage.value.toLocaleString()}
        </p>
        
        {/* Source Breakdown */}
        {stage.sources && (
          <div className="mt-3 space-y-1 w-full">
            {stage.sources.map((source: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${source.color}`}></div>
                  <span className="text-gray-600">{source.name}</span>
                </div>
                <span className="font-medium text-gray-800">{source.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">AIDA Marketing Funnel</h2>
        <span className="text-sm text-gray-500">Attention → Interest → Desire → Action</span>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* Attention Stage */}
        <FunnelStage 
          stage={funnelData.attention} 
          icon={Eye} 
          width={400}
        />
        
        {/* Arrow */}
        <div className="text-gray-400">↓</div>
        
        {/* Interest Stage */}
        <FunnelStage 
          stage={funnelData.interest} 
          icon={MousePointer} 
          width={320}
          conversionRate={interestRate}
        />
        
        {/* Arrow */}
        <div className="text-gray-400">↓</div>
        
        {/* Desire Stage */}
        <FunnelStage 
          stage={funnelData.desire} 
          icon={Phone} 
          width={240}
          conversionRate={desireRate}
        />
        
        {/* Arrow */}
        <div className="text-gray-400">↓</div>
        
        {/* Meaningful Action Stage */}
        <FunnelStage 
          stage={funnelData.meaningfulAction} 
          icon={Users} 
          width={160}
          conversionRate={actionRate}
        />
        
        {/* Arrow */}
        <div className="text-gray-400">↓</div>
        
        {/* Retention Stage */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-b from-purple-100 to-purple-200 rounded-lg border-2 border-purple-300 flex flex-col items-center justify-center p-4 transition-all hover:shadow-lg"
               style={{ width: '120px', minHeight: '100px' }}>
            <Heart className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 text-center text-sm mb-1">
              {funnelData.retention.label}
            </h3>
            <p className="text-2xl font-bold text-purple-600">
              {funnelData.retention.value}%
            </p>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Key Insights:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <p className="font-semibold text-blue-600">{interestRate}%</p>
            <p className="text-gray-600">Attention → Interest</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-green-600">{actionRate}%</p>
            <p className="text-gray-600">Desire → Action</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-purple-600">{repeatCustomerRate}%</p>
            <p className="text-gray-600">Customer Retention</p>
          </div>
        </div>
      </div>
    </div>
  );
} 