// Multi-tenant configuration system
export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    favicon?: string;
  };
  features: {
    customChecklist: boolean;
    analytics: boolean;
    teamManagement: boolean;
    whiteLabel: boolean;
  };
  plan: 'starter' | 'professional' | 'enterprise';
}

// Example tenant configurations
export const tenantConfigs: Record<string, TenantConfig> = {
  'pizza-palace': {
    id: 'pizza-palace',
    name: 'Pizza Palace',
    subdomain: 'pizza-palace',
    branding: {
      logo: '/tenants/pizza-palace/logo.png',
      primaryColor: '#e53e3e',
      secondaryColor: '#ff6b6b',
      fontFamily: 'Inter',
    },
    features: {
      customChecklist: true,
      analytics: true,
      teamManagement: true,
      whiteLabel: true,
    },
    plan: 'professional',
  },
  'fine-dining': {
    id: 'fine-dining',
    name: 'Fine Dining Co.',
    subdomain: 'fine-dining',
    customDomain: 'growth.finedining.com',
    branding: {
      logo: '/tenants/fine-dining/logo.png',
      primaryColor: '#2d3748',
      secondaryColor: '#4a5568',
      fontFamily: 'Playfair Display',
    },
    features: {
      customChecklist: true,
      analytics: true,
      teamManagement: true,
      whiteLabel: true,
    },
    plan: 'enterprise',
  },
  'burger-spot': {
    id: 'burger-spot',
    name: 'Burger Spot',
    subdomain: 'burger-spot',
    branding: {
      logo: '/tenants/burger-spot/logo.png',
      primaryColor: '#ff8c00',
      secondaryColor: '#ffa500',
      fontFamily: 'Inter',
    },
    features: {
      customChecklist: false,
      analytics: true,
      teamManagement: false,
      whiteLabel: false,
    },
    plan: 'starter',
  },
};

// Tenant detection from subdomain or custom domain
export function getTenantFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // Check for custom domain first
  for (const [tenantId, config] of Object.entries(tenantConfigs)) {
    if (config.customDomain && hostname === config.customDomain) {
      return tenantId;
    }
  }
  
  // Check for subdomain (pizza-palace.growth-os.com)
  const subdomain = hostname.split('.')[0];
  if (tenantConfigs[subdomain]) {
    return subdomain;
  }
  
  return null;
}

// Generate tenant-specific CSS variables
export function generateTenantCSS(tenant: TenantConfig): string {
  return `
    :root {
      --tenant-primary: ${tenant.branding.primaryColor};
      --tenant-secondary: ${tenant.branding.secondaryColor};
      --tenant-font: '${tenant.branding.fontFamily}', sans-serif;
    }
    
    .tenant-logo {
      background-image: url('${tenant.branding.logo}');
    }
    
    .tenant-primary {
      background-color: ${tenant.branding.primaryColor};
    }
    
    .tenant-secondary {
      background-color: ${tenant.branding.secondaryColor};
    }
  `;
}

// Dynamic checklist content per tenant
export interface TenantChecklist {
  tenantId: string;
  sections: Array<{
    id: string;
    title: string;
    emoji: string;
    description: string;
    items: Array<{
      id: string;
      text: string;
      priority: 'high' | 'medium' | 'low';
      category: string;
    }>;
  }>;
}

// Example: Pizza Palace gets pizza-specific checklist items
export const pizzaPalaceChecklist: TenantChecklist = {
  tenantId: 'pizza-palace',
  sections: [
    {
      id: 'foundation',
      title: 'PIZZA FOUNDATION',
      emoji: '🍕',
      description: 'Essential pizza business fundamentals',
      items: [
        {
          id: 'dough-quality',
          text: 'Perfect dough recipe and consistency established',
          priority: 'high',
          category: 'product'
        },
        {
          id: 'sauce-recipe',
          text: 'Signature sauce recipe documented and standardized',
          priority: 'high',
          category: 'product'
        },
        {
          id: 'delivery-radius',
          text: 'Optimal delivery radius mapped for 30-minute guarantee',
          priority: 'medium',
          category: 'operations'
        },
        // ... more pizza-specific items
      ]
    }
    // ... more sections
  ]
};

// Admin functions for managing tenants
export class TenantManager {
  static async createTenant(config: Omit<TenantConfig, 'id'>): Promise<TenantConfig> {
    const id = config.subdomain;
    const tenant: TenantConfig = { ...config, id };
    
    // Save to database
    // await database.tenants.create(tenant);
    
    return tenant;
  }
  
  static async updateTenantBranding(
    tenantId: string, 
    branding: Partial<TenantConfig['branding']>
  ): Promise<void> {
    // Update database
    // await database.tenants.update(tenantId, { branding });
    
    // Regenerate CSS
    const tenant = tenantConfigs[tenantId];
    if (tenant) {
      tenant.branding = { ...tenant.branding, ...branding };
    }
  }
  
  static async getTenantAnalytics(tenantId: string): Promise<{
    totalItems: number;
    completedItems: number;
    progressPercentage: number;
    activeUsers: number;
    lastActivity: Date;
  }> {
    // Fetch from analytics database
    return {
      totalItems: 40,
      completedItems: 28,
      progressPercentage: 70,
      activeUsers: 5,
      lastActivity: new Date(),
    };
  }
} 