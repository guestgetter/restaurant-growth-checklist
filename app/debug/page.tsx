'use client';

import { useEffect, useState } from 'react';
import { fixAllClientDataFormats, checkClientDataFormats, getAllClients } from '../../lib/clientDataFixer';
import ErrorBoundaryTest from '../../components/ErrorBoundaryTest';
import DataErrorBoundary from '../../components/DataErrorBoundary';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [clients, setClients] = useState<any[]>([]);
  const [needsFixes, setNeedsFixes] = useState(false);
  const [metaStatus, setMetaStatus] = useState<string>('Checking...');
  const [googleStatus, setGoogleStatus] = useState<string>('Checking...');
  const [envStatus, setEnvStatus] = useState<any>({});
  const [fixResult, setFixResult] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    // Load client data
    const clientData = getAllClients();
    setClients(clientData);
    setNeedsFixes(checkClientDataFormats());

    // Check environment variables from server
    fetch('/api/debug/env')
      .then(res => res.json())
      .then(data => {
        setEnvStatus(data);
      })
      .catch(err => {
        console.error('Error checking environment:', err);
        setEnvStatus({ error: 'Failed to check environment variables' });
      });

    // Test Meta API
    fetch('/api/meta-ads?accountId=demo')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMetaStatus(`❌ ${data.error}: ${data.message}`);
        } else if (data.demo) {
          setMetaStatus('Demo Mode (needs real account ID)');
        } else {
          setMetaStatus('Real Data ✅');
        }
      })
      .catch(err => {
        setMetaStatus('Error: ' + err.message);
      });

    // Test Google Ads API
    fetch('/api/google-ads?customerId=demo')
      .then(res => res.json())
      .then(data => {
        setGoogleStatus(data.demo ? 'Demo Mode (needs real customer ID)' : 'Real Data ✅');
      })
      .catch(err => {
        setGoogleStatus('Error: ' + err.message);
      });
  }, []);

  const handleFixClientData = () => {
    const result = fixAllClientDataFormats();
    setFixResult(`Fixed ${result.fixed} client data issues`);
    setClients(result.clients);
    setNeedsFixes(checkClientDataFormats());
    
    // Reload the page to refresh the data
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const checkTokens = async () => {
    try {
      const response = await fetch('/api/debug/tokens');
      const data = await response.json();
      setTokenInfo(data);
    } catch (error) {
      console.error('Error fetching token info:', error);
    }
  };

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Debug Information
        </h1>

        {/* Authentication Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Authentication Status
          </h2>
          
          {session ? (
            <div className="space-y-3">
              <div>
                <strong>Status:</strong> <span className="text-green-600">Authenticated</span>
              </div>
              <div>
                <strong>User:</strong> {session.user?.name} ({session.user?.email})
              </div>
              <div>
                <strong>Provider:</strong> {session.user?.image ? 'Google OAuth' : 'Credentials'}
              </div>
              {session.accessToken && (
                <div>
                  <strong>Access Token:</strong> 
                  <span className="text-green-600 ml-2">✓ Available</span>
                </div>
              )}
              <button
                onClick={checkTokens}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Check OAuth Tokens
              </button>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <strong>Status:</strong> <span className="text-red-600">Not Authenticated</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => signIn('google')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Sign In with Google
                </button>
                <button
                  onClick={() => signIn('credentials')}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Sign In with Credentials
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Token Information */}
        {tokenInfo && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              OAuth Token Information
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(tokenInfo, null, 2)}
            </pre>
            
            {tokenInfo.refreshToken && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  🎉 Refresh Token Found!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  Add this to your .env.local file:
                </p>
                <code className="block bg-green-100 dark:bg-green-800 p-2 rounded text-sm">
                  GOOGLE_REFRESH_TOKEN={tokenInfo.refreshToken}
                </code>
              </div>
            )}
          </div>
        )}

        {/* Environment Variables */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Environment Variables Status
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>GOOGLE_CLIENT_ID:</span>
              <span className={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GOOGLE_CLIENT_SECRET:</span>
              <span className="text-gray-500">Hidden (server-side)</span>
            </div>
            <div className="flex justify-between">
              <span>GOOGLE_REFRESH_TOKEN:</span>
              <span className="text-gray-500">Hidden (server-side)</span>
            </div>
            <div className="flex justify-between">
              <span>GOOGLE_ANALYTICS_PROPERTY_ID:</span>
              <span className="text-gray-500">Hidden (server-side)</span>
            </div>
          </div>
        </div>

        {/* Error Boundary Testing */}
        <ErrorBoundaryTest />

        {/* Environment Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded ${envStatus.META_ACCESS_TOKEN ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-medium">META_ACCESS_TOKEN</div>
              <div className="text-sm">{envStatus.META_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}</div>
            </div>
            <div className={`p-3 rounded ${envStatus.META_APP_ID ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-medium">META_APP_ID</div>
              <div className="text-sm">{envStatus.META_APP_ID ? '✅ Set' : '❌ Missing'}</div>
            </div>
            <div className={`p-3 rounded ${envStatus.META_APP_SECRET ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-medium">META_APP_SECRET</div>
              <div className="text-sm">{envStatus.META_APP_SECRET ? '✅ Set' : '❌ Missing'}</div>
            </div>
            <div className={`p-3 rounded ${envStatus.GOOGLE_ADS_DEVELOPER_TOKEN ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="font-medium">GOOGLE_ADS_DEVELOPER_TOKEN</div>
              <div className="text-sm">{envStatus.GOOGLE_ADS_DEVELOPER_TOKEN ? '✅ Set' : '❌ Missing'}</div>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Meta Ads API</span>
              <span className={metaStatus.includes('✅') ? 'text-green-600' : 'text-orange-600'}>{metaStatus}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">Google Ads API</span>
              <span className={googleStatus.includes('✅') ? 'text-green-600' : 'text-orange-600'}>{googleStatus}</span>
            </div>
          </div>
        </div>

        {/* Client Data Issues */}
        {needsFixes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">Client Data Issues Detected</h2>
            <p className="text-yellow-700 mb-4">
              Some client data has formatting issues that prevent APIs from working properly.
            </p>
            <button
              onClick={handleFixClientData}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Fix Client Data Formats
            </button>
            {fixResult && (
              <div className="mt-3 p-3 bg-green-100 text-green-800 rounded">
                {fixResult}
              </div>
            )}
          </div>
        )}

        {/* Client Data Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Client Data ({clients.length} clients)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Google Ads ID</th>
                  <th className="px-4 py-2 text-left">Meta Ads ID</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-t">
                    <td className="px-4 py-2 font-medium">{client.name}</td>
                    <td className="px-4 py-2">
                      <span className={client.googleAdsCustomerId && /[^0-9]/.test(client.googleAdsCustomerId) ? 'text-red-600' : 'text-green-600'}>
                        {client.googleAdsCustomerId || 'Not set'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={client.metaAdsAccountId ? 'text-green-600' : 'text-gray-400'}>
                        {client.metaAdsAccountId || 'Not set'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 