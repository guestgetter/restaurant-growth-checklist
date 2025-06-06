'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ClientProfileManager from '../../components/ClientProfile';
import { Client } from '../../components/Settings/ClientManagement';

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
            setCurrentClient(client);
          }
        } catch (error) {
          console.error('Error loading current client:', error);
        }
      }
    };

    loadCurrentClient();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Client Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Comprehensive view of {currentClient.name}&apos;s journey, baseline metrics, and goals
          </p>
        </div>
      </div>

      {/* Client Profile Manager */}
      <ClientProfileManager clientId={currentClient.id} />

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Quick Actions
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
                Onboarding Checklist
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Complete setup tasks
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
                View current metrics
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
                Generate Reports
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Create progress reports
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
} 