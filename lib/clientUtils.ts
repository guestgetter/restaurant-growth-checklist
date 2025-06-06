import { Client } from '../components/Settings/ClientManagement';

export const DEFAULT_CLIENT: Client = {
  id: 'pizza-palace',
  name: 'Pizza Palace',
  industry: 'Quick Service Restaurant',
  branding: {
    primaryColor: '#e53e3e',
    secondaryColor: '#ff6b6b',
    fontFamily: 'Inter',
  },
  contact: {
    email: 'owner@pizzapalace.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA',
  },
  googleAdsCustomerId: '',
  status: 'active',
  createdAt: new Date().toISOString(),
};

export const KOMA_CLIENT: Client = {
  id: 'koma-restaurant',
  name: 'KOMA Restaurant',
  industry: 'Japanese Fine Dining',
  branding: {
    primaryColor: '#000000',
    secondaryColor: '#FF6B6B',
    fontFamily: 'Inter',
  },
  contact: {
    email: 'info@komarestaurant.com',
    phone: '(214) 395-8798',
    address: '3699 McKinney Ave, Dallas, TX 75204',
  },
  googleAdsCustomerId: '8455915770',
  metaAdsAccountId: '',
  status: 'active',
  createdAt: new Date().toISOString(),
};

export const TOBOGGAN_CLIENT: Client = {
  id: 'toboggan-brewing-company',
  name: 'Toboggan Brewing Company',
  industry: 'Bar & Grill',
  branding: {
    primaryColor: '#8B4513',
    secondaryColor: '#D2B48C',
    fontFamily: 'Inter',
  },
  contact: {
    email: 'info@tobogganbrewing.com',
    phone: '(555) 987-6543',
    address: 'Brewery District, City, State',
  },
  googleAdsCustomerId: '8396280050', // Toboggan's customer ID (will fallback to demo if no access)
  metaAdsAccountId: '',
  status: 'active',
  createdAt: new Date().toISOString(),
};

export function initializeDefaultClient(): Client {
  if (typeof window === 'undefined') {
    return DEFAULT_CLIENT; // Return default for SSR
  }

  try {
    const savedClients = localStorage.getItem('growth-os-clients');
    const savedCurrentClientId = localStorage.getItem('growth-os-current-client');

    if (!savedClients || !savedCurrentClientId) {
      // No clients exist, create defaults
      const defaultClients = [DEFAULT_CLIENT, KOMA_CLIENT, TOBOGGAN_CLIENT];
      localStorage.setItem('growth-os-clients', JSON.stringify(defaultClients));
      localStorage.setItem('growth-os-current-client', DEFAULT_CLIENT.id);
      return DEFAULT_CLIENT;
    }

    const clients: Client[] = JSON.parse(savedClients);
    const currentClient = clients.find(c => c.id === savedCurrentClientId);
    
    if (currentClient) {
      return currentClient;
    } else if (clients.length > 0) {
      // Current client not found, use first available
      localStorage.setItem('growth-os-current-client', clients[0].id);
      return clients[0];
    } else {
      // No valid clients, create defaults
      const defaultClients = [DEFAULT_CLIENT, KOMA_CLIENT, TOBOGGAN_CLIENT];
      localStorage.setItem('growth-os-clients', JSON.stringify(defaultClients));
      localStorage.setItem('growth-os-current-client', DEFAULT_CLIENT.id);
      return DEFAULT_CLIENT;
    }
  } catch (error) {
    console.error('Error initializing client:', error);
    return DEFAULT_CLIENT;
  }
}

export function getCurrentClient(): Client | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const savedCurrentClientId = localStorage.getItem('growth-os-current-client');
    const savedClients = localStorage.getItem('growth-os-clients');

    if (!savedCurrentClientId || !savedClients) {
      return null;
    }

    const clients: Client[] = JSON.parse(savedClients);
    return clients.find(c => c.id === savedCurrentClientId) || null;
  } catch (error) {
    console.error('Error getting current client:', error);
    return null;
  }
}

export function getAllClients(): Client[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const savedClients = localStorage.getItem('growth-os-clients');
    return savedClients ? JSON.parse(savedClients) : [];
  } catch (error) {
    console.error('Error getting all clients:', error);
    return [];
  }
}

export function saveAllClients(clients: Client[]): void {
  try {
    localStorage.setItem('growth-os-clients', JSON.stringify(clients));
  } catch (error) {
    console.error('Error saving clients:', error);
  }
}

export function fixAllClientDataFormats(): void {
  try {
    const clients = getAllClients();
    let hasChanges = false;

    const fixedClients = clients.map(client => {
      const originalGoogleId = client.googleAdsCustomerId;
      const originalMetaId = client.metaAdsAccountId;
      
      const fixedClient = {
        ...client,
        googleAdsCustomerId: client.googleAdsCustomerId ? formatGoogleAdsCustomerId(client.googleAdsCustomerId) : undefined,
        metaAdsAccountId: client.metaAdsAccountId ? formatMetaAdsAccountId(client.metaAdsAccountId) : undefined
      };

      if (originalGoogleId !== fixedClient.googleAdsCustomerId || originalMetaId !== fixedClient.metaAdsAccountId) {
        hasChanges = true;
        console.log(`Fixed formats for ${client.name}:`, {
          googleAds: { before: originalGoogleId, after: fixedClient.googleAdsCustomerId },
          metaAds: { before: originalMetaId, after: fixedClient.metaAdsAccountId }
        });
      }

      return fixedClient;
    });

    if (hasChanges) {
      saveAllClients(fixedClients);
      console.log('✅ Client data formats have been fixed!');
      // Trigger a page reload to see the changes
      window.location.reload();
    } else {
      console.log('ℹ️ No format fixes needed');
    }
  } catch (error) {
    console.error('Error fixing client data formats:', error);
  }
}

export function checkClientDataFormats(): boolean {
  try {
    const clients = getAllClients();
    
    for (const client of clients) {
      // Check Google Ads ID format (should not have dashes)
      if (client.googleAdsCustomerId && client.googleAdsCustomerId.includes('-')) {
        return true;
      }
      
      // Check Meta Ads ID format (should not have 'act_' prefix)
      if (client.metaAdsAccountId && client.metaAdsAccountId.startsWith('act_')) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking client data formats:', error);
    return false;
  }
}

// Fix Google Ads customer ID format (remove dashes)
export function formatGoogleAdsCustomerId(customerId: string): string {
  if (!customerId) return '';
  // Remove all non-numeric characters
  return customerId.replace(/[^0-9]/g, '');
}

// Fix Meta Ads account ID format (ensure it's just the numeric part)
export function formatMetaAdsAccountId(accountId: string): string {
  if (!accountId) return '';
  // Remove 'act_' prefix if it exists and any non-numeric characters
  return accountId.replace(/^act_/, '').replace(/[^0-9]/g, '');
} 