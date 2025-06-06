// Restaurant Growth Operating System Types

export interface Client {
  id: string;
  name: string;
  type: 'fast-casual' | 'fine-dining' | 'quick-service' | 'cafe' | 'catering' | 'food-truck';
  location: {
    city: string;
    state: string;
    country: string;
  };
  accountManager: string;
  fulfillmentManager: string;
  onboardingDate: string;
  currentPhase: 'onboarding' | 'magnet' | 'convert' | 'keep' | 'optimization';
  googleAdsCustomerId?: string;
  dreamCaseStudyGoal: string;
  targetAudience: string;
  topCompetitors: string[];
  monthlyRevenue?: number;
  averageOrderValue?: number;
}

export interface GrowthMetric {
  id: string;
  name: string;
  category: 'primary' | 'secondary';
  value?: number;
  unit: string;
  dataQualityScore: 1 | 2 | 3 | 4 | 5; // 1=Unknown, 3=Directional, 5=Dialed
  lastUpdated?: string;
  trend: 'up' | 'down' | 'stable' | 'unknown';
  targetValue?: number;
}

export interface PrimaryMetrics {
  guestAcquisitionCost: GrowthMetric;
  guestLifetimeValue: GrowthMetric;
  repeatVisitRate: GrowthMetric;
  averagePerHeadSpend: GrowthMetric;
  monthlyRevenue: GrowthMetric;
  profit: GrowthMetric;
  membershipGrowth: GrowthMetric;
  costPerMembershipOptIn: GrowthMetric;
}

export interface SecondaryMetrics {
  paidReach: GrowthMetric;
  organicReach: GrowthMetric;
  emailEngagement: GrowthMetric;
  localSearchRankings: GrowthMetric;
  phoneCalls: GrowthMetric;
  directionRequests: GrowthMetric;
}

export interface EnablementChecklist {
  metricId: string;
  items: EnablementChecklistItem[];
  completionPercentage: number;
}

export interface EnablementChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  owner: string;
  dueDate?: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface GrowthPhase {
  id: 'onboarding' | 'magnet' | 'convert' | 'keep';
  name: string;
  description: string;
  estimatedDuration: string;
  checklists: PhaseChecklist[];
  metrics: string[];
  startDate?: string;
  completedDate?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
}

export interface PhaseChecklist {
  id: string;
  title: string;
  category: string;
  items: ChecklistItem[];
  completionPercentage: number;
  assignedTo: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completedDate?: string;
  completedBy?: string;
  notes?: string;
  subItems?: ChecklistItem[];
}

export interface EngagementEvent {
  id: string;
  type: 'pulse-call' | 'strategic-call' | 'deep-dive' | 'onboarding' | 'review';
  scheduledDate: string;
  completedDate?: string;
  attendees: string[];
  agenda: string[];
  notes?: string;
  actionItems: ActionItem[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  relatedPhase?: string;
  relatedMetric?: string;
}

export interface PlatformAccess {
  websiteCMS: {
    platform: string;
    hasAccess: boolean;
    credentials?: boolean;
  };
  googleBusinessProfile: {
    hasAccess: boolean;
    verified: boolean;
  };
  metaAds: {
    hasAccess: boolean;
    pixelInstalled: boolean;
  };
  googleAds: {
    hasAccess: boolean;
    tagInstalled: boolean;
  };
  emailSMS: {
    platform: string;
    hasAccess: boolean;
    integrationStatus: 'connected' | 'pending' | 'error' | 'not-configured';
  };
  pos: {
    platform: string;
    hasAccess: boolean;
    integrationStatus: 'connected' | 'pending' | 'error' | 'not-configured';
  };
  reservation: {
    platform: string;
    hasAccess: boolean;
    integrationStatus: 'connected' | 'pending' | 'error' | 'not-configured';
  };
}

export interface TechnicalSetup {
  metaPixel: {
    installed: boolean;
    testing: boolean;
    events: string[];
  };
  googleAdsTag: {
    installed: boolean;
    testing: boolean;
    conversions: string[];
  };
  googleTagManager: {
    installed: boolean;
    containerActive: boolean;
  };
  ga4: {
    installed: boolean;
    enhancedMeasurement: boolean;
    customEvents: string[];
  };
  utmLibrary: {
    created: boolean;
    conventions: string;
    activeCampaigns: number;
  };
}

export interface ClientProfile {
  client: Client;
  currentState: {
    traffic: number;
    bookings: number;
    reviews: { count: number; averageRating: number };
    listSize: number;
    brandPresence: 'weak' | 'moderate' | 'strong';
  };
  phases: GrowthPhase[];
  primaryMetrics: PrimaryMetrics;
  secondaryMetrics: SecondaryMetrics;
  enablementChecklists: EnablementChecklist[];
  platformAccess: PlatformAccess;
  technicalSetup: TechnicalSetup;
  engagementEvents: EngagementEvent[];
  actionItems: ActionItem[];
  lastUpdated: string;
}

export interface DashboardConfig {
  accountManager: string;
  clients: string[]; // client IDs
  defaultView: 'overview' | 'metrics' | 'checklists' | 'calendar';
  refreshInterval: number; // minutes
  alertThresholds: {
    dataQualityBelow: number;
    overdueActionItems: number;
    missedCalls: number;
  };
} 