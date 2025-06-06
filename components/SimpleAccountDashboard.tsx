'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Phone,
  Target,
  BarChart3,
  Plus,
  Bell,
  Download
} from 'lucide-react';

import { DATA_QUALITY_GUIDE } from '../lib/simple-data';

interface SimpleAccountDashboardProps {
  accountManager: string;
}

export default function SimpleAccountDashboard({ 
  accountManager = "Kyle Guilfoyle" 
}: SimpleAccountDashboardProps) {
  
  const [activeView, setActiveView] = useState<'overview' | 'clients' | 'metrics' | 'calendar' | 'tasks'>('overview');
  
  // Sample data based on your Restaurant Growth System
  const mockClients = [
    {
      id: '1',
      name: 'Koma Restaurant',
      type: 'fine-dining',
      location: 'Toronto, ON',
      currentPhase: 'onboarding',
      overallProgress: 30,
      dataQuality: 3,
      nextCall: 'Jun 3',
      urgentTasks: 2,
      monthlyRevenue: 85000,
      googleAdsSpend: 528,
      conversions: 43,
      gac: 12.50
    },
    {
      id: '2', 
      name: 'Bella Vista Cafe',
      type: 'cafe',
      location: 'Vancouver, BC',
      currentPhase: 'magnet',
      overallProgress: 65,
      dataQuality: 4,
      nextCall: 'Jun 5',
      urgentTasks: 0,
      monthlyRevenue: 42000,
      googleAdsSpend: 280,
      conversions: 18,
      gac: 15.60
    }
  ];

  const mockActionItems = [
    {
      id: '1',
      description: 'Complete Meta Pixel installation for Koma Restaurant',
      assignedTo: 'fulfillment',
      dueDate: '2025-06-05',
      priority: 'high',
      client: 'Koma Restaurant'
    },
    {
      id: '2',
      description: 'Schedule bi-weekly pulse call with Bella Vista',
      assignedTo: accountManager,
      dueDate: '2025-06-03',
      priority: 'medium',
      client: 'Bella Vista Cafe'
    },
    {
      id: '3',
      description: 'Set up Google Business Profile posting schedule',
      assignedTo: 'fulfillment',
      dueDate: '2025-06-07',
      priority: 'medium',
      client: 'Koma Restaurant'
    }
  ];

  // Calculate overview stats
  const overviewStats = {
    totalClients: mockClients.length,
    urgentItems: mockActionItems.filter(item => item.priority === 'high').length,
    upcomingCalls: mockClients.filter(client => client.nextCall !== 'TBD').length,
    avgDataQuality: mockClients.reduce((acc, client) => acc + client.dataQuality, 0) / mockClients.length
  };

  const ClientCard = ({ client }: { client: any }) => {
    const qualityGuide = DATA_QUALITY_GUIDE[client.dataQuality as keyof typeof DATA_QUALITY_GUIDE];
    
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{client.type} • {client.location}</p>
          </div>
          <div className="flex items-center space-x-2">
            {client.urgentTasks > 0 && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {client.urgentTasks} urgent
              </span>
            )}
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {client.currentPhase}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium">{client.overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${client.overallProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
            <div>
              <div className="text-gray-600">Data Quality</div>
              <div className={`font-semibold text-${qualityGuide.color}-600`}>
                {qualityGuide.label}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Next Call</div>
              <div className="font-semibold text-gray-900">{client.nextCall}</div>
            </div>
            <div>
              <div className="text-gray-600">Monthly Revenue</div>
              <div className="font-semibold text-green-600">${client.monthlyRevenue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-600">GAC</div>
              <div className="font-semibold text-gray-900">${client.gac}</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <a 
              href={`/client/${client.id}`}
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Performance Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  };

  const ActionItemRow = ({ item }: { item: any }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${
          item.priority === 'high' ? 'bg-red-500' :
          item.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
        }`} />
        <div>
          <div className="text-sm font-medium text-gray-900">{item.description}</div>
          <div className="text-xs text-gray-500">
            {item.client} • Assigned to {item.assignedTo} • Due {new Date(item.dueDate).toLocaleDateString()}
          </div>
        </div>
      </div>
      <button className="text-blue-600 hover:text-blue-800 text-sm">
        Mark Complete
      </button>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{overviewStats.totalClients}</div>
              <div className="text-sm text-gray-600">Total Clients</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{overviewStats.urgentItems}</div>
              <div className="text-sm text-gray-600">Urgent Items</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Phone className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{overviewStats.upcomingCalls}</div>
              <div className="text-sm text-gray-600">This Week's Calls</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{overviewStats.avgDataQuality.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Data Quality</div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth System Phases Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">🍽️ Restaurant Growth System Progress</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { phase: 'Onboarding', clients: 1, color: 'blue', description: 'Setup & Foundation' },
            { phase: 'MAGNET', clients: 1, color: 'green', description: 'Attract Guests' },
            { phase: 'CONVERT', clients: 0, color: 'orange', description: 'Turn to Revenue' },
            { phase: 'KEEP', clients: 0, color: 'purple', description: 'Build Loyalty' }
          ].map(item => (
            <div key={item.phase} className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                <span className={`text-${item.color}-600 font-bold`}>{item.clients}</span>
              </div>
              <div className="font-medium text-gray-900">{item.phase}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p><strong>System Overview:</strong> Your Restaurant Growth System guides clients through 3 core phases - 
          MAGNET (attract high-intent guests), CONVERT (turn attention into revenue), and KEEP (retain guests & build loyalty).
          Each phase has clear checklists, measurable metrics, and defined ownership.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Priority Actions</h3>
        <div className="space-y-1">
          {mockActionItems.slice(0, 5).map(item => (
            <ActionItemRow key={item.id} item={item} />
          ))}
        </div>
        <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Action Items →
        </button>
      </div>

      {/* Key Metrics Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$127K</div>
            <div className="text-sm text-gray-600">Total Monthly Revenue</div>
            <div className="text-xs text-gray-500">Combined client revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">$14.05</div>
            <div className="text-sm text-gray-600">Avg GAC</div>
            <div className="text-xs text-gray-500">Guest Acquisition Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">61</div>
            <div className="text-sm text-gray-600">Total Conversions</div>
            <div className="text-xs text-gray-500">This month</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      {/* Client Filters */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">ALL</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium">URGENT</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium">ON-TRACK</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium">NEEDS ATTENTION</button>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4 inline mr-2" />
          Add Client
        </button>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClients.map(client => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      {/* Restaurant Growth System Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Your Restaurant Growth System</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">MAGNET Phase</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Build lead gen funnels</li>
              <li>• Run awareness ads</li>
              <li>• Optimize Google Business Profile</li>
              <li>• Local visibility campaigns</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-600 mb-2">CONVERT Phase</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Reputation management</li>
              <li>• Conversion optimization</li>
              <li>• Review automation</li>
              <li>• Booking flow testing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-600 mb-2">KEEP Phase</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Email/SMS nurture flows</li>
              <li>• Event promotion</li>
              <li>• Loyalty programs</li>
              <li>• Guest feedback loops</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🍽️ Restaurant Growth OS</h1>
              <p className="text-sm text-gray-600">Account Manager: {accountManager}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <a 
                href="/checklist"
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Growth Checklist
              </a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                <Download className="w-4 h-4 inline mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'metrics', label: 'Metrics', icon: Target },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'tasks', label: 'Tasks', icon: CheckCircle2 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeView === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'clients' && renderClients()}
        {activeView === 'metrics' && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Metrics Dashboard</h3>
            <p className="text-gray-600">Primary & Secondary metrics with data quality scoring coming soon</p>
          </div>
        )}
        {activeView === 'calendar' && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Engagement Calendar</h3>
            <p className="text-gray-600">Bi-weekly pulse calls, monthly strategic calls, quarterly deep-dives</p>
          </div>
        )}
        {activeView === 'tasks' && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Task Management</h3>
            <p className="text-gray-600">Phase checklists, enablement items, and action tracking</p>
          </div>
        )}
      </div>
    </div>
  );
} 