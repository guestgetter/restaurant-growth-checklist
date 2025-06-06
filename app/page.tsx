'use client';

import { useState, useEffect } from 'react';
import { BarChart3, CheckSquare, TrendingUp, Users, Target, Clock, Brain, Zap } from 'lucide-react';
import { Client } from '../components/Settings/ClientManagement';
import { initializeDefaultClient } from '../lib/clientUtils';

export default function OverviewPage() {
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [checklistProgress, setChecklistProgress] = useState(0);
  const [completedItems, setCompletedItems] = useState(0);
  const [totalItems, setTotalItems] = useState(40); // Default checklist total
  const [isLoading, setIsLoading] = useState(false); // Changed to false for faster loading

  useEffect(() => {
    const loadClientData = async () => {
      try {
        // Initialize default client if none exists (non-blocking)
        const client = initializeDefaultClient();
        setCurrentClient(client);
        
        if (client) {
          // Load checklist progress for this client (async)
          setTimeout(() => {
            const clientProgressKey = `restaurant-checklist-progress-${client.id}`;
            const saved = localStorage.getItem(clientProgressKey);
            
            if (saved) {
              const completedIds = JSON.parse(saved);
              const completed = completedIds.length;
              setCompletedItems(completed);
              setChecklistProgress(Math.round((completed / totalItems) * 100));
            } else {
              setCompletedItems(0);
              setChecklistProgress(0);
            }
          }, 0);
        }
      } catch (error) {
        console.error('Error loading client data:', error);
        // Don't block UI on error - show default state
        setCurrentClient(initializeDefaultClient());
      }
    };

    loadClientData();

    // Listen for client changes (improved event handling)
    const handleStorageChange = (e: StorageEvent) => {
      console.log('Overview: Storage event received:', e.key, e.newValue);
      if (e.key === 'growth-os-current-client') {
        // Client switched - reload data
        console.log('Overview: Client switched, reloading data');
        loadClientData();
      } else if (e.key?.startsWith('restaurant-checklist-progress-')) {
        // Progress updated - just reload progress
        const currentClientId = localStorage.getItem('growth-os-current-client');
        if (currentClientId) {
          const clientProgressKey = `restaurant-checklist-progress-${currentClientId}`;
          const saved = localStorage.getItem(clientProgressKey);
          
          if (saved) {
            const completedIds = JSON.parse(saved);
            const completed = completedIds.length;
            setCompletedItems(completed);
            setChecklistProgress(Math.round((completed / totalItems) * 100));
          }
        }
      }
    };

    // Listen for custom events (for real-time client switching)
    const handleClientChange = (e: CustomEvent) => {
      console.log('Overview: Custom client change event received:', e.detail);
      if (e.detail.clientId) {
        console.log('Overview: Loading data for new client:', e.detail.client?.name);
        loadClientData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('clientChanged', handleClientChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('clientChanged', handleClientChange as EventListener);
    };
  }, [totalItems]);

  // Show content immediately with loading states for individual sections
  const renderContent = () => {
    const displayClient = currentClient || {
      id: 'loading',
      name: 'Loading...',
      industry: 'Restaurant',
      status: 'active'
    };

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Growth OS Overview
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Your restaurant growth command center
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500 dark:text-slate-400">Current Client</div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">
              {currentClient ? displayClient.name : (
                <div className="h-5 bg-slate-300 dark:bg-slate-600 rounded animate-pulse w-24"></div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Growth System Progress</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{checklistProgress}%</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CheckSquare className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Completed Items</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{completedItems}/{totalItems}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Client Industry</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{displayClient.industry}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Target className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Client Status</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize">{displayClient.status}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Brain className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 dark:text-slate-100">
                    <strong>{displayClient.name}</strong> progress: {completedItems} of {totalItems} checklist items completed
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Current session</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 dark:text-slate-100">
                    <strong>Growth System</strong> loaded for {displayClient.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Client-specific progress tracking active</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800 dark:text-slate-100">
                    <strong>Multi-client system</strong> ready for scale
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Settings configured</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
              Priority Actions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <Clock className="text-amber-600 dark:text-amber-400" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Complete Growth System Checklist
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {completedItems} of {totalItems} items completed ({checklistProgress}%)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <CheckSquare className="text-blue-600 dark:text-blue-400" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Add More Restaurant Clients
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Scale your operations with multiple clients</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <Target className="text-orange-600 dark:text-orange-400" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Customize {displayClient.name} Branding
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update colors, logo, and fonts in Settings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth OS Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/checklist" className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white hover:from-blue-600 hover:to-indigo-700 transition-all">
            <CheckSquare size={32} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Growth System Checklist</h3>
            <p className="text-blue-100 text-sm mb-4">
              MAGNET → CONVERT → KEEP framework with 40+ proven growth strategies
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs">{checklistProgress}% Complete</span>
              <span className="px-3 py-1 bg-green-400 text-green-900 rounded-full text-xs">Updated Framework!</span>
            </div>
          </a>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <BarChart3 size={32} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
            <p className="text-purple-100 text-sm mb-4">
              Visual analytics and performance metrics from your Growth OS Dashboard project
            </p>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Ready for Integration</span>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
            <Target size={32} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Leverage</h3>
            <p className="text-orange-100 text-sm mb-4">
              Identify and maximize force multipliers that amplify your restaurant's growth
            </p>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Coming Soon</span>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <Brain size={32} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Report & Insights Generator</h3>
            <p className="text-indigo-100 text-sm mb-4">
              AI-powered analysis and automated reporting for data-driven decisions
            </p>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Coming Soon</span>
          </div>

          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-6 text-white">
            <Users size={32} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Settings</h3>
            <p className="text-slate-300 text-sm mb-4">
              Manage clients, team members, and platform configuration
            </p>
            <span className="px-3 py-1 bg-green-400 text-green-900 rounded-full text-xs">Active</span>
          </div>

          <a href="/growth-system" className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white hover:from-yellow-600 hover:to-orange-700 transition-all">
            <Target size={32} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">🍽️ Account Manager Dashboard</h3>
            <p className="text-yellow-100 text-sm mb-4">
              Full Restaurant Growth Operating System for managing multiple clients through MAGNET → CONVERT → KEEP phases
            </p>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">New! Click to Open</span>
          </a>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
            <Zap size={32} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Future Features</h3>
            <p className="text-emerald-100 text-sm mb-4">
              Team collaboration, goal tracking, and advanced automation
            </p>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Roadmap</span>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
} 