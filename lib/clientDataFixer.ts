// Client data format fixer utility
export interface Client {
  id: string;
  name: string;
  industry: string;
  logo?: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  googleAdsCustomerId?: string;
  metaAdsAccountId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Fix Google Ads customer ID format (remove dashes and non-numeric characters)
export function fixGoogleAdsCustomerId(customerId: string): string {
  if (!customerId) return '';
  // Remove all non-numeric characters (dashes, spaces, etc.)
  return customerId.replace(/[^0-9]/g, '');
}

// Fix Meta Ads account ID format
export function fixMetaAdsAccountId(accountId: string): string {
  if (!accountId) return '';
  // Remove 'act_' prefix if present and ensure it's just the numeric part
  return accountId.replace(/^act_/, '');
}

// Get all clients from localStorage
export function getAllClients(): Client[] {
  if (typeof window === 'undefined') return [];
  const clientsData = localStorage.getItem('clients');
  return clientsData ? JSON.parse(clientsData) : [];
}

// Save clients to localStorage
export function saveClients(clients: Client[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('clients', JSON.stringify(clients));
}

// Fix all client data formats
export function fixAllClientDataFormats(): { fixed: number; clients: Client[] } {
  const clients = getAllClients();
  let fixedCount = 0;

  const fixedClients = clients.map(client => {
    const originalClient = { ...client };
    
    // Fix Google Ads customer ID
    if (client.googleAdsCustomerId) {
      const fixedGoogleId = fixGoogleAdsCustomerId(client.googleAdsCustomerId);
      if (fixedGoogleId !== client.googleAdsCustomerId) {
        client.googleAdsCustomerId = fixedGoogleId;
        fixedCount++;
      }
    }

    // Fix Meta Ads account ID
    if (client.metaAdsAccountId) {
      const fixedMetaId = fixMetaAdsAccountId(client.metaAdsAccountId);
      if (fixedMetaId !== client.metaAdsAccountId) {
        client.metaAdsAccountId = fixedMetaId;
        fixedCount++;
      }
    }

    return client;
  });

  if (fixedCount > 0) {
    saveClients(fixedClients);
  }

  return { fixed: fixedCount, clients: fixedClients };
}

// Check if client data needs fixes
export function checkClientDataFormats(): boolean {
  const clients = getAllClients();
  
  return clients.some(client => {
    // Check if Google Ads ID has dashes or non-numeric characters
    if (client.googleAdsCustomerId && /[^0-9]/.test(client.googleAdsCustomerId)) {
      return true;
    }
    
    // Check if Meta ID has 'act_' prefix
    if (client.metaAdsAccountId && client.metaAdsAccountId.startsWith('act_')) {
      return true;
    }
    
    return false;
  });
} 