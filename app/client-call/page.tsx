'use client';

import { useState } from 'react';
import RestaurantClientDashboard from '../../components/RestaurantClientDashboard';
import { Calendar, Users, TrendingUp } from 'lucide-react';

export default function ClientCallPage() {
  const [selectedClient, setSelectedClient] = useState<'amano-trattoria' | 'the-berczy-tavern'>('amano-trattoria');

  const clients = [
    {
      id: 'amano-trattoria' as const,
      name: 'Amano Trattoria',
      type: 'Italian Fine Dining',
      color: 'bg-red-100 text-red-700 border-red-300'
    },
    {
      id: 'the-berczy-tavern' as const,
      name: 'The Berczy Tavern',
      type: 'Canadian Gastropub',
      color: 'bg-green-100 text-green-700 border-green-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Call Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Client Call Dashboard</h1>
                <p className="text-gray-600">Same ownership group - Amano Trattoria & The Berczy Tavern</p>
                <p className="text-sm text-blue-600">Today's Call • Live Performance Data</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Meeting Date</div>
              <div className="text-lg font-semibold">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Selector */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">View Dashboard:</span>
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  selectedClient === client.id
                    ? client.color
                    : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {client.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <RestaurantClientDashboard clientId={selectedClient} />

      {/* Call Summary Footer */}
      <div className="bg-white border-t border-gray-200 p-6 mt-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Talking Points for Today's Call</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-5 w-5 text-green-600 mb-2" />
              <h4 className="font-medium text-green-900">Strong Performance</h4>
              <p className="text-sm text-green-700">Both restaurants showing 7.5%+ Google Ads conversion rates</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="h-5 w-5 text-blue-600 mb-2" />
              <h4 className="font-medium text-blue-900">Growth Opportunities</h4>
              <p className="text-sm text-blue-700">Meta Ads reach expansion and coupon strategy optimization</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Calendar className="h-5 w-5 text-yellow-600 mb-2" />
              <h4 className="font-medium text-yellow-900">Next Steps</h4>
              <p className="text-sm text-yellow-700">CouponTools integration and SEM Rush data connection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 