import { GoogleAdsService } from './googleAdsService';
import { getAllClients } from './clientUtils';
import type { Client } from '../components/Settings/ClientManagement';

export interface ClientHealthStatus {
  clientId: string;
  clientName: string;
  googleAdsCustomerId?: string;
  hasGoogleAdsAccess: boolean;
  hasMetaAccess: boolean;
  status: 'healthy' | 'partial' | 'demo' | 'error';
  lastChecked: string;
  issues: string[];
}

export async function checkAllClientsHealth(): Promise<ClientHealthStatus[]> {
  const clients = getAllClients();
  const googleAdsService = new GoogleAdsService();
  const results: ClientHealthStatus[] = [];
  
  for (const client of clients) {
    const status = await checkClientHealth(client, googleAdsService);
    results.push(status);
  }
  
  return results;
}

export async function checkClientHealth(
  client: Client, 
  googleAdsService?: GoogleAdsService
): Promise<ClientHealthStatus> {
  const service = googleAdsService || new GoogleAdsService();
  const issues: string[] = [];
  let hasGoogleAdsAccess = false;
  let hasMetaAccess = false;
  
  // Check Google Ads access
  if (client.googleAdsCustomerId) {
    if (client.googleAdsCustomerId === 'demo') {
      issues.push('Using demo Google Ads data');
    } else {
      try {
        if (service.isConfigured()) {
          hasGoogleAdsAccess = await service.hasAccessToCustomer(client.googleAdsCustomerId);
          if (!hasGoogleAdsAccess) {
            issues.push(`No access to Google Ads customer ID: ${client.googleAdsCustomerId}`);
          }
        } else {
          issues.push('Google Ads service not configured');
        }
      } catch (error) {
        issues.push(`Google Ads check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  } else {
    issues.push('No Google Ads customer ID configured');
  }
  
  // Check Meta Ads access (basic check for now)
  if (client.metaAdsAccountId) {
    // For now, we'll assume Meta access is working if there's an account ID
    // TODO: Implement actual Meta API access check
    hasMetaAccess = true;
  } else {
    issues.push('No Meta Ads account ID configured');
  }
  
  // Determine overall status
  let status: 'healthy' | 'partial' | 'demo' | 'error';
  if (hasGoogleAdsAccess && hasMetaAccess) {
    status = 'healthy';
  } else if (hasGoogleAdsAccess || hasMetaAccess) {
    status = 'partial';
  } else if (issues.some(issue => issue.includes('demo'))) {
    status = 'demo';
  } else {
    status = 'error';
  }
  
  return {
    clientId: client.id,
    clientName: client.name,
    googleAdsCustomerId: client.googleAdsCustomerId,
    hasGoogleAdsAccess,
    hasMetaAccess,
    status,
    lastChecked: new Date().toISOString(),
    issues
  };
}

export function getStatusColor(status: ClientHealthStatus['status']): string {
  switch (status) {
    case 'healthy': return 'text-green-600 bg-green-50';
    case 'partial': return 'text-yellow-600 bg-yellow-50';
    case 'demo': return 'text-blue-600 bg-blue-50';
    case 'error': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

export function getStatusIcon(status: ClientHealthStatus['status']): string {
  switch (status) {
    case 'healthy': return '✅';
    case 'partial': return '⚠️';
    case 'demo': return '🔄';
    case 'error': return '❌';
    default: return '❓';
  }
} 