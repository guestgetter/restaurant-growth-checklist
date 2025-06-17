'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ClientProfileManager from '../../components/ClientProfile';
import { Client } from '../../components/Settings/ClientManagement';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  Users,
  Star,
  MessageSquare
} from 'lucide-react';

export default function ClientProfilePage() {
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    const loadCurrentClient = () => {
      const savedCurrentClientId = localStorage.getItem('growth-os-current-client');
      const savedClients = localStorage.getItem('growth-os-clients');
      
      if (savedClients && savedCurrentClientId) {
        try {
          const clients: Client[] = JSON.parse(savedClients);
          const client = clients.find(c => c.id === savedCurrentClientId);
          if (client) {
            console.log('ClientProfile Page: Loading client:', client.name);
            setCurrentClient(client);
          }
        } catch (error) {
          console.error('Error loading current client:', error);
        }
      }
    };

    loadCurrentClient();

    // Listen for client changes from sidebar dropdown
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'growth-os-current-client') {
        console.log('ClientProfile Page: Client switched via storage event, reloading client');
        loadCurrentClient();
      }
    };

    const handleClientChange = (e: CustomEvent) => {
      if (e.detail.client) {
        console.log('ClientProfile Page: Client switched via custom event to:', e.detail.client.name);
        setCurrentClient(e.detail.client);
      } else if (e.detail.clientId) {
        // Fallback: reload from localStorage if only clientId is provided
        loadCurrentClient();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('clientChanged', handleClientChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('clientChanged', handleClientChange as EventListener);
    };
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Authentication Required
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Please sign in to access the client profile.
          </p>
        </div>
      </div>
    );
  }

  if (!currentClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            No Client Selected
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Please select a client from the sidebar or go to Settings to add a client.
          </p>
        </div>
      </div>
    );
  }

  // Mock data for demonstration - in production, this would come from your database
  const clientHealth = {
    score: 85,
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    lastContact: '2 days ago',
    nextAction: 'Monthly check-in call',
    nextActionDue: 'Tomorrow',
    revenueRisk: 'low' as 'low' | 'medium' | 'high',
    sentiment: 'positive' as 'positive' | 'neutral' | 'negative'
  };

  const quickStats = {
    monthlyRevenue: '$24,500',
    revenueChange: '+12.3%',
    guestCount: 1247,
    guestChange: '+8.1%',
    avgPerHeadSpend: '$19.65',
    avgPerHeadChange: '+2.4%',
    googleRating: 4.6,
    ratingChange: '+0.2'
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Client Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Account management center for {currentClient.name}
          </p>
        </div>
      </div>

      {/* Client Health Dashboard */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Client Health Overview
          </h2>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(clientHealth.score)}`}>
            {getHealthIcon(clientHealth.score)}
            Health Score: {clientHealth.score}%
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Relationship Status */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Relationship Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
                  <Clock className="w-4 h-4" />
                  Last Contact
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {clientHealth.lastContact}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  Next Action
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {clientHealth.nextAction}
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400">
                  Due {clientHealth.nextActionDue}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Phone className="w-4 h-4" />
                Schedule Call
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                <Mail className="w-4 h-4" />
                Send Update
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Key Performance Indicators</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <DollarSign className="w-4 h-4" />
                    Monthly Revenue
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs">{quickStats.revenueChange}</span>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {quickStats.monthlyRevenue}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Users className="w-4 h-4" />
                    Guests
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs">{quickStats.guestChange}</span>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {quickStats.guestCount.toLocaleString()}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <DollarSign className="w-4 h-4" />
                    Avg Per Head Spend
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs">{quickStats.avgPerHeadChange}</span>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {quickStats.avgPerHeadSpend}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Star className="w-4 h-4" />
                    Google Rating
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs">{quickStats.ratingChange}</span>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {quickStats.googleRating} ⭐
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Profile Manager */}
      <ClientProfileManager clientId={currentClient.id} />

      {/* Enhanced Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Account Manager Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/checklist"
            className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Onboarding Progress
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Track setup completion
              </p>
            </div>
          </a>

          <a
            href="/dashboard"
            className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Performance Dashboard
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                View detailed metrics
              </p>
            </div>
          </a>

          <a
            href="/reports"
            className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Client Reports
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Generate progress reports
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
} 