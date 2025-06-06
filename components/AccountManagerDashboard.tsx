'use client';

import React, { useState, useEffect } from 'react';
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
  Settings,
  Plus,
  Filter,
  Search,
  Download,
  Bell
} from 'lucide-react';

import { 
  ClientProfile, 
  GrowthPhase, 
  GrowthMetric, 
  ActionItem, 
  EngagementEvent 
} from '../types/restaurant-growth';

import { 
  GROWTH_PHASES, 
  DATA_QUALITY_GUIDE, 
  ENABLEMENT_CHECKLISTS 
} from '../lib/growth-system-data';

interface AccountManagerDashboardProps {
  accountManager: string;
  initialClients?: ClientProfile[];
}

export default function AccountManagerDashboard({ 
  accountManager, 
  initialClients = [] 
}: AccountManagerDashboardProps) {
  
  const [activeView, setActiveView] = useState<'overview' | 'clients' | 'metrics' | 'calendar' | 'tasks'>('overview');
  const [clients, setClients] = useState<ClientProfile[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'on-track' | 'needs-attention'>('all');
  
  // Mock data for demonstration
  const mockActionItems: ActionItem[] = [
    {
      id: '1',
      description: 'Complete Meta Pixel installation for Koma Restaurant',
      assignedTo: 'fulfillment',
      dueDate: '2025-06-05',
      status: 'pending',
      priority: 'high',
      relatedPhase: 'onboarding'
    },
    {
      id: '2',
      description: 'Schedule bi-weekly pulse call with Bella Vista',
      assignedTo: accountManager,
      dueDate: '2025-06-03',
      status: 'pending',
      priority: 'medium'
    }
  ];

  const mockUpcomingEvents: EngagementEvent[] = [
    {
      id: '1',
      type: 'pulse-call',
      scheduledDate: '2025-06-03T10:00:00Z',
      attendees: ['Koma Restaurant Owner', accountManager],
      agenda: ['Review tracking setup', 'Discuss MAGNET phase priorities'],
      actionItems: [],
      status: 'scheduled'
    }
  ];

  // Calculate overview stats
  const overviewStats = {
    totalClients: clients.length,
    urgentItems: mockActionItems.filter(item => item.priority === 'high' && item.status === 'pending').length,
    upcomingCalls: mockUpcomingEvents.filter(event => 
      new Date(event.scheduledDate) > new Date() && 
      new Date(event.scheduledDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length,
    avgDataQuality: 3.2
  };

  const ClientCard = ({ client }: { client: ClientProfile }) => {
    const currentPhase = client.phases.find(p => p.status === 'in-progress') || client.phases[0];
    const overallProgress = client.phases.reduce((acc, phase) => {
      const phaseProgress = phase.checklists.reduce((sum, checklist) => sum + checklist.completionPercentage, 0) / phase.checklists.length;
      return acc + phaseProgress;
    }, 0) / client.phases.length;

    const urgentTasks = mockActionItems.filter(item => 
      item.priority === 'high' && 
      item.status === 'pending'
    ).length;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
           onClick={() => setSelectedClient(client)}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{client.client.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{client.client.type} • {client.client.location.city}</p>
          </div>
          <div className="flex items-center space-x-2">
            {urgentTasks > 0 && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {urgentTasks} urgent
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded-full ${
              currentPhase.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {currentPhase.name}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-sm text-gray-600">Data Quality</div>
              <div className={`text-lg font-semibold ${
                client.primaryMetrics.guestAcquisitionCost.dataQualityScore >= 4 ? 'text-green-600' :
                client.primaryMetrics.guestAcquisitionCost.dataQualityScore >= 3 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {DATA_QUALITY_GUIDE[client.primaryMetrics.guestAcquisitionCost.dataQualityScore].label}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Next Call</div>
              <div className="text-lg font-semibold text-gray-900">
                {mockUpcomingEvents.find(e => e.attendees.includes(client.client.name)) ? 'Jun 3' : 'TBD'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MetricCard = ({ metric, enablementItems }: { metric: GrowthMetric, enablementItems: number }) => {
    const qualityGuide = DATA_QUALITY_GUIDE[metric.dataQualityScore];
    
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-medium text-gray-900">{metric.name}</h4>
          <span className={`text-xs px-2 py-1 rounded-full bg-${qualityGuide.color}-100 text-${qualityGuide.color}-800`}>
            {qualityGuide.label}
          </span>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {metric.value ? `${metric.unit === '$' ? '$' : ''}${metric.value.toLocaleString()}${metric.unit === '%' ? '%' : ''}` : '--'}
            </div>
            <div className="text-xs text-gray-500">{enablementItems} setup items</div>
          </div>
          
          {metric.trend && metric.trend !== 'unknown' && (
            <div className={`flex items-center text-xs ${
              metric.trend === 'up' ? 'text-green-600' : 
              metric.trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
              {metric.trend}
            </div>
          )}
        </div>
      </div>
    );
  };

  const ActionItemRow = ({ item }: { item: ActionItem }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${
          item.priority === 'high' ? 'bg-red-500' :
          item.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
        }`} />
        <div>
          <div className="text-sm font-medium text-gray-900">{item.description}</div>
          <div className="text-xs text-gray-500">
            Assigned to {item.assignedTo} • Due {new Date(item.dueDate).toLocaleDateString()}
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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">2h ago</span>
            <span>Completed Google Ads setup for Koma Restaurant</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">1d ago</span>
            <span>Pulse call completed with Bella Vista - discussed CONVERT phase</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-gray-600">2d ago</span>
            <span>Updated GAC metric for 3 clients with new tracking data</span>
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
          {(['all', 'urgent', 'on-track', 'needs-attention'] as const).map(filterOption => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4 inline mr-2" />
            Add Client
          </button>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <ClientCard key={client.client.id} client={client} />
        ))}
        
        {/* Add sample clients if none exist */}
        {clients.length === 0 && (
          <>
            <ClientCard client={{
              client: {
                id: '1',
                name: 'Koma Restaurant',
                type: 'fine-dining',
                location: { city: 'Toronto', state: 'ON', country: 'Canada' },
                accountManager: accountManager,
                fulfillmentManager: 'Sarah Chen',
                onboardingDate: '2025-05-15',
                currentPhase: 'onboarding',
                googleAdsCustomerId: '8455915770',
                dreamCaseStudyGoal: 'Increase monthly revenue by 40% through digital marketing',
                targetAudience: 'Young professionals and food enthusiasts in Toronto',
                topCompetitors: ['Canoe', 'Alo Restaurant', 'Richmond Station'],
                monthlyRevenue: 85000,
                averageOrderValue: 78
              },
              currentState: {
                traffic: 1250,
                bookings: 240,
                reviews: { count: 127, averageRating: 4.3 },
                listSize: 890,
                brandPresence: 'moderate'
              },
              phases: GROWTH_PHASES,
              primaryMetrics: {
                guestAcquisitionCost: { id: 'gac', name: 'Guest Acquisition Cost', category: 'primary', unit: '$', dataQualityScore: 3, trend: 'unknown', value: 12.50 },
                guestLifetimeValue: { id: 'ltv', name: 'Guest Lifetime Value', category: 'primary', unit: '$', dataQualityScore: 2, trend: 'unknown' },
                repeatVisitRate: { id: 'rvr', name: 'Repeat Visit Rate', category: 'primary', unit: '%', dataQualityScore: 1, trend: 'unknown' },
                averagePerHeadSpend: { id: 'aphs', name: 'Average Per Head Spend', category: 'primary', unit: '$', dataQualityScore: 4, trend: 'up', value: 78 },
                monthlyRevenue: { id: 'revenue', name: 'Monthly Revenue', category: 'primary', unit: '$', dataQualityScore: 5, trend: 'up', value: 85000 },
                profit: { id: 'profit', name: 'Profit', category: 'primary', unit: '$', dataQualityScore: 1, trend: 'unknown' },
                membershipGrowth: { id: 'membership', name: 'Membership Growth', category: 'primary', unit: 'contacts', dataQualityScore: 3, trend: 'stable', value: 890 },
                costPerMembershipOptIn: { id: 'cpmo', name: 'Cost Per Opt-In', category: 'primary', unit: '$', dataQualityScore: 2, trend: 'unknown' }
              },
              secondaryMetrics: {
                paidReach: { id: 'paid-reach', name: 'Paid Reach', category: 'secondary', unit: 'impressions', dataQualityScore: 4, trend: 'up', value: 8547 },
                organicReach: { id: 'organic-reach', name: 'Organic Reach', category: 'secondary', unit: 'views', dataQualityScore: 2, trend: 'unknown' },
                emailEngagement: { id: 'email-engagement', name: 'Email Engagement', category: 'secondary', unit: '%', dataQualityScore: 1, trend: 'unknown' },
                localSearchRankings: { id: 'local-rankings', name: 'Local Rankings', category: 'secondary', unit: 'position', dataQualityScore: 1, trend: 'unknown' },
                phoneCalls: { id: 'phone-calls', name: 'Phone Calls', category: 'secondary', unit: 'calls', dataQualityScore: 3, trend: 'stable', value: 16 },
                directionRequests: { id: 'directions', name: 'Directions', category: 'secondary', unit: 'requests', dataQualityScore: 2, trend: 'unknown' }
              },
              enablementChecklists: ENABLEMENT_CHECKLISTS,
              platformAccess: {
                websiteCMS: { platform: 'WordPress', hasAccess: true, credentials: true },
                googleBusinessProfile: { hasAccess: true, verified: true },
                metaAds: { hasAccess: true, pixelInstalled: false },
                googleAds: { hasAccess: true, tagInstalled: true },
                emailSMS: { platform: 'Klaviyo', hasAccess: false, integrationStatus: 'pending' },
                pos: { platform: 'Square', hasAccess: false, integrationStatus: 'not-configured' },
                reservation: { platform: 'OpenTable', hasAccess: true, integrationStatus: 'connected' }
              },
              technicalSetup: {
                metaPixel: { installed: false, testing: false, events: [] },
                googleAdsTag: { installed: true, testing: true, conversions: ['purchase', 'lead'] },
                googleTagManager: { installed: false, containerActive: false },
                ga4: { installed: true, enhancedMeasurement: true, customEvents: ['reservation_made'] },
                utmLibrary: { created: false, conventions: '', activeCampaigns: 0 }
              },
              engagementEvents: mockUpcomingEvents,
              actionItems: mockActionItems,
              lastUpdated: new Date().toISOString()
            }} />
          </>
        )}
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
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Growth OS</h1>
              <p className="text-sm text-gray-600">Account Manager: {accountManager}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Metrics Dashboard</h3>
            <p className="text-gray-600">Comprehensive metrics view coming soon</p>
          </div>
        )}
        {activeView === 'calendar' && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Engagement Calendar</h3>
            <p className="text-gray-600">Calendar and scheduling view coming soon</p>
          </div>
        )}
        {activeView === 'tasks' && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Task Management</h3>
            <p className="text-gray-600">Advanced task tracking coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
} 