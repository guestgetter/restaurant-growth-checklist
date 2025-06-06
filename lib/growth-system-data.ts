import { GrowthPhase, EnablementChecklist, PrimaryMetrics, SecondaryMetrics } from '../types/restaurant-growth';

// 🧭 System Structure: 3 Core Phases + Onboarding

export const GROWTH_PHASES: GrowthPhase[] = [
  {
    id: 'onboarding',
    name: 'Onboarding & Setup',
    description: 'Foundation setting, tracking setup, and client alignment',
    estimatedDuration: 'Weeks 1-2',
    status: 'not-started',
    metrics: ['dataQualityScore', 'platformAccess', 'technicalSetup'],
    checklists: [
      {
        id: 'internal-alignment',
        title: 'Internal Alignment',
        category: 'Setup',
        assignedTo: '',
        priority: 'high',
        completionPercentage: 0,
        items: [
          {
            id: 'assign-leads',
            description: 'Assign account lead + fulfillment manager',
            completed: false
          },
          {
            id: 'review-intake',
            description: 'Review intake form + discovery notes',
            completed: false
          },
          {
            id: 'confirm-details',
            description: 'Confirm restaurant type, target audience, and top competitors',
            completed: false
          },
          {
            id: 'define-current-state',
            description: 'Define "Current State" profile: traffic, bookings, reviews, list size, brand presence',
            completed: false
          },
          {
            id: 'establish-dream-goal',
            description: 'Establish "Dream Case Study" goal: exciting, measurable, transformation',
            completed: false
          },
          {
            id: 'document-summary',
            description: 'Document internal summary (roles, expectations, timelines)',
            completed: false
          }
        ]
      },
      {
        id: 'client-kickoff',
        title: 'Client Kickoff',
        category: 'Alignment',
        assignedTo: '',
        priority: 'high',
        completionPercentage: 0,
        items: [
          {
            id: 'kickoff-call',
            description: 'Host 60-min kickoff call (vision, expectations, how we work)',
            completed: false
          },
          {
            id: 'present-system',
            description: 'Present our 3-phase Growth System (Magnet / Convert / Keep)',
            completed: false
          },
          {
            id: 'align-priorities',
            description: 'Align on short- and long-term priorities',
            completed: false
          },
          {
            id: 'confirm-cadence',
            description: 'Confirm cadence: Bi-weekly Pulse Calls, Monthly Strategic Reporting, Quarterly Deep-Dive',
            completed: false
          }
        ]
      },
      {
        id: 'tracking-instrumentation',
        title: 'Tracking & Instrumentation',
        category: 'Technical',
        assignedTo: '',
        priority: 'high',
        completionPercentage: 0,
        items: [
          {
            id: 'platform-access',
            description: 'Secure platform access',
            completed: false,
            subItems: [
              { id: 'website-cms', description: 'Website CMS', completed: false },
              { id: 'google-business', description: 'Google Business Profile', completed: false },
              { id: 'meta-ads', description: 'Meta Ads / Google Ads accounts', completed: false },
              { id: 'email-sms', description: 'Email/SMS platforms (Klaviyo, etc.)', completed: false },
              { id: 'pos-reservation', description: 'POS + Reservation Systems (if available)', completed: false }
            ]
          },
          {
            id: 'technical-setup',
            description: 'Complete technical setup',
            completed: false,
            subItems: [
              { id: 'meta-pixel', description: 'Install Meta Pixel', completed: false },
              { id: 'google-ads-tag', description: 'Install Google Ads Tag', completed: false },
              { id: 'gtm-setup', description: 'Set up Google Tag Manager with centralized scripts', completed: false },
              { id: 'ga4-config', description: 'Configure GA4 with enhanced measurement + conversions', completed: false },
              { id: 'goals-tracking', description: 'Define + track goals (opt-ins, bookings, redemptions, inquiries)', completed: false }
            ]
          },
          {
            id: 'campaign-intelligence',
            description: 'Set up campaign intelligence',
            completed: false,
            subItems: [
              { id: 'utm-library', description: 'Create UTM Library (naming conventions + live links)', completed: false },
              { id: 'campaign-index', description: 'Create campaign index doc', completed: false },
              { id: 'test-events', description: 'Test events using Pixel Helper / Tag Assistant', completed: false }
            ]
          },
          {
            id: 'tracking-snapshot',
            description: 'Create "Tracking Snapshot" Doc and verify dashboard links',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'magnet',
    name: 'MAGNET - Attract High-Intent Guests',
    description: 'Build awareness, capture leads, and increase local visibility',
    estimatedDuration: 'Weeks 2-4',
    status: 'not-started',
    metrics: ['costPerOptIn', 'guestListGrowth', 'paidOrganicReach', 'gmbViews'],
    checklists: [
      {
        id: 'guest-magnet-method',
        title: 'Guest Magnet Method',
        category: 'Lead Generation',
        assignedTo: '',
        priority: 'high',
        completionPercentage: 0,
        items: [
          {
            id: 'lead-gen-funnel',
            description: 'Build lead gen funnel with compelling offer',
            completed: false
          },
          {
            id: 'awareness-ads',
            description: 'Run awareness + offer ads (Meta/IG)',
            completed: false
          },
          {
            id: 'list-growth-campaign',
            description: 'Launch SMS/email list growth campaign',
            completed: false
          },
          {
            id: 'content-calendar',
            description: 'Build content calendar (social posts, reels, stories)',
            completed: false
          }
        ]
      },
      {
        id: 'local-visibility-booster',
        title: 'Local Visibility Booster',
        category: 'Local SEO',
        assignedTo: '',
        priority: 'high',
        completionPercentage: 0,
        items: [
          {
            id: 'optimize-gmb',
            description: 'Fully optimize Google Business Profile (GMB)',
            completed: false
          },
          {
            id: 'weekly-gmb-posts',
            description: 'Post weekly GMB updates (offers, promos, events)',
            completed: false
          },
          {
            id: 'fix-citations',
            description: 'Fix NAP citations (Yelp, TripAdvisor, etc.)',
            completed: false
          },
          {
            id: 'local-backlinks',
            description: 'Start local backlink + PR outreach',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'convert',
    name: 'CONVERT - Turn Attention into Revenue',
    description: 'Optimize conversion flows and build social proof',
    estimatedDuration: 'Weeks 4-6',
    status: 'not-started',
    metrics: ['reviewVolume', 'offerConversionRate', 'clickToBookRate', 'abandonmentRate'],
    checklists: [
      {
        id: 'reputation-accelerator',
        title: 'Reputation Accelerator',
        category: 'Social Proof',
        assignedTo: '',
        priority: 'high',
        completionPercentage: 0,
        items: [
          {
            id: 'automated-review-requests',
            description: 'Set up automated review requests (SMS, email, QR codes)',
            completed: false
          },
          {
            id: 'weekly-review-responses',
            description: 'Respond to reviews weekly',
            completed: false
          },
          {
            id: 'repurpose-reviews',
            description: 'Repurpose top reviews in ads, emails, website',
            completed: false
          }
        ]
      },
      {
        id: 'conversion-optimization',
        title: 'Conversion Optimization',
        category: 'UX/CRO',
        assignedTo: '',
        priority: 'high',
        completionPercentage: 0,
        items: [
          {
            id: 'audit-booking-flows',
            description: 'Audit booking + order flows (desktop + mobile)',
            completed: false
          },
          {
            id: 'test-friction-points',
            description: 'Test friction points, offers, and copy',
            completed: false
          },
          {
            id: 'ab-test-pages',
            description: 'A/B test conversion pages',
            completed: false
          },
          {
            id: 'add-trust-signals',
            description: 'Add trust signals (social proof, awards, guarantees)',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'keep',
    name: 'KEEP - Retain & Build Loyalty',
    description: 'Ongoing relationship building and loyalty programs',
    estimatedDuration: 'Ongoing',
    status: 'not-started',
    metrics: ['repeatVisitRate', 'avgPerHeadSpend', 'eventInquiries', 'membershipGrowth'],
    checklists: [
      {
        id: 'brand-relationship-builder',
        title: 'Brand & Relationship Builder',
        category: 'Retention',
        assignedTo: '',
        priority: 'medium',
        completionPercentage: 0,
        items: [
          {
            id: 'define-brand-tone',
            description: 'Define brand tone, visuals, and language',
            completed: false
          },
          {
            id: 'welcome-automation',
            description: 'Launch welcome automation + nurture flows',
            completed: false
          },
          {
            id: 'monthly-campaigns',
            description: 'Send 2–4 monthly campaigns (stories, promos, content)',
            completed: false
          },
          {
            id: 'birthday-sms',
            description: 'Send birthday or surprise-and-delight SMS',
            completed: false
          }
        ]
      },
      {
        id: 'event-experience-engine',
        title: 'Event & Experience Engine',
        category: 'Events',
        assignedTo: '',
        priority: 'medium',
        completionPercentage: 0,
        items: [
          {
            id: 'catering-packages',
            description: 'Build catering/event packages',
            completed: false
          },
          {
            id: 'event-landing-pages',
            description: 'Design event-specific landing pages',
            completed: false
          },
          {
            id: 'promote-events',
            description: 'Promote events monthly',
            completed: false
          },
          {
            id: 'track-event-conversions',
            description: 'Track event inquiries and conversions',
            completed: false
          }
        ]
      },
      {
        id: 'feedback-loop',
        title: 'Feedback Loop',
        category: 'Intelligence',
        assignedTo: '',
        priority: 'medium',
        completionPercentage: 0,
        items: [
          {
            id: 'post-visit-emails',
            description: 'Send post-visit "How was it?" emails',
            completed: false
          },
          {
            id: 'monitor-feedback',
            description: 'Monitor and tag guest feedback',
            completed: false
          },
          {
            id: 'share-comments',
            description: 'Share standout guest comments publicly',
            completed: false
          },
          {
            id: 'guest-love-report',
            description: 'Deliver quarterly "Guest Love Report"',
            completed: false
          }
        ]
      }
    ]
  }
];

// 🎯 Primary Metrics with Enablement Checklists

export const PRIMARY_METRICS_TEMPLATE: PrimaryMetrics = {
  guestAcquisitionCost: {
    id: 'gac',
    name: 'Guest Acquisition Cost (GAC)',
    category: 'primary',
    unit: '$',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  guestLifetimeValue: {
    id: 'ltv',
    name: 'Guest Lifetime Value (LTV)',
    category: 'primary',
    unit: '$',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  repeatVisitRate: {
    id: 'rvr',
    name: 'Average Repeat Visit Rate',
    category: 'primary',
    unit: '%',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  averagePerHeadSpend: {
    id: 'aphs',
    name: 'Average Per Head Spend',
    category: 'primary',
    unit: '$',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  monthlyRevenue: {
    id: 'revenue',
    name: 'Monthly Revenue',
    category: 'primary',
    unit: '$',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  profit: {
    id: 'profit',
    name: 'Profit',
    category: 'primary',
    unit: '$',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  membershipGrowth: {
    id: 'membership',
    name: 'Membership Growth',
    category: 'primary',
    unit: 'contacts',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  costPerMembershipOptIn: {
    id: 'cpmo',
    name: 'Cost Per Membership Opt-In',
    category: 'primary',
    unit: '$',
    dataQualityScore: 1,
    trend: 'unknown'
  }
};

export const SECONDARY_METRICS_TEMPLATE: SecondaryMetrics = {
  paidReach: {
    id: 'paid-reach',
    name: 'Paid Reach',
    category: 'secondary',
    unit: 'impressions',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  organicReach: {
    id: 'organic-reach',
    name: 'Organic Reach',
    category: 'secondary',
    unit: 'views',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  emailEngagement: {
    id: 'email-engagement',
    name: 'Email Engagement',
    category: 'secondary',
    unit: '%',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  localSearchRankings: {
    id: 'local-rankings',
    name: 'Local Search Rankings',
    category: 'secondary',
    unit: 'position',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  phoneCalls: {
    id: 'phone-calls',
    name: 'Phone Calls',
    category: 'secondary',
    unit: 'calls',
    dataQualityScore: 1,
    trend: 'unknown'
  },
  directionRequests: {
    id: 'directions',
    name: 'Direction Requests',
    category: 'secondary',
    unit: 'requests',
    dataQualityScore: 1,
    trend: 'unknown'
  }
};

// ⚙️ Enablement Checklists (Per Metric)

export const ENABLEMENT_CHECKLISTS: EnablementChecklist[] = [
  {
    metricId: 'gac',
    completionPercentage: 0,
    items: [
      {
        id: 'meta-pixel-gac',
        description: 'Meta & Google Pixels installed',
        completed: false,
        owner: 'fulfillment',
        priority: 'high'
      },
      {
        id: 'utm-attribution-gac',
        description: 'UTM parameters on all campaigns',
        completed: false,
        owner: 'fulfillment',
        priority: 'high'
      },
      {
        id: 'funnel-attribution-gac',
        description: 'Offer funnel with UTM attribution',
        completed: false,
        owner: 'fulfillment',
        priority: 'high'
      },
      {
        id: 'conversion-events-gac',
        description: 'Conversion events firing correctly',
        completed: false,
        owner: 'fulfillment',
        priority: 'high'
      },
      {
        id: 'pos-tracking-gac',
        description: 'POS or CRM tracking in place',
        completed: false,
        owner: 'client',
        priority: 'medium'
      },
      {
        id: 'spend-tracking-gac',
        description: 'Campaign-level spend tracking',
        completed: false,
        owner: 'account-manager',
        priority: 'high'
      }
    ]
  },
  {
    metricId: 'rvr',
    completionPercentage: 0,
    items: [
      {
        id: 'loyalty-system-rvr',
        description: 'Loyalty check-ins or punch cards',
        completed: false,
        owner: 'client',
        priority: 'medium'
      },
      {
        id: 'email-history-rvr',
        description: 'Email/SMS open history',
        completed: false,
        owner: 'fulfillment',
        priority: 'medium'
      },
      {
        id: 'pos-visits-rvr',
        description: 'POS visit history',
        completed: false,
        owner: 'client',
        priority: 'high'
      },
      {
        id: 'wifi-checkins-rvr',
        description: 'WiFi check-ins or credit card swipes',
        completed: false,
        owner: 'client',
        priority: 'low'
      }
    ]
  },
  {
    metricId: 'ltv',
    completionPercentage: 0,
    items: [
      {
        id: 'customer-segments-ltv',
        description: 'Customer segmentation in place',
        completed: false,
        owner: 'fulfillment',
        priority: 'medium'
      },
      {
        id: 'purchase-history-ltv',
        description: 'Purchase history tracking',
        completed: false,
        owner: 'client',
        priority: 'high'
      },
      {
        id: 'cohort-analysis-ltv',
        description: 'Cohort analysis setup',
        completed: false,
        owner: 'account-manager',
        priority: 'medium'
      }
    ]
  },
  {
    metricId: 'membership',
    completionPercentage: 0,
    items: [
      {
        id: 'email-platform-membership',
        description: 'Email platform integration',
        completed: false,
        owner: 'fulfillment',
        priority: 'high'
      },
      {
        id: 'signup-forms-membership',
        description: 'Signup forms on website',
        completed: false,
        owner: 'fulfillment',
        priority: 'high'
      },
      {
        id: 'lead-magnets-membership',
        description: 'Lead magnets and offers',
        completed: false,
        owner: 'account-manager',
        priority: 'medium'
      },
      {
        id: 'data-collection-membership',
        description: 'Birthday/preference data collection',
        completed: false,
        owner: 'fulfillment',
        priority: 'medium'
      }
    ]
  }
];

// 📆 Engagement Rhythm Templates

export const ENGAGEMENT_SCHEDULE = {
  'first-30-90-days': [
    {
      type: 'pulse-call',
      frequency: 'bi-weekly',
      duration: '30 minutes',
      agenda: ['Unblock tasks', 'Clarify priorities', 'Build trust and momentum']
    }
  ],
  'ongoing': [
    {
      type: 'strategic-call',
      frequency: 'monthly',
      duration: '45 minutes',
      agenda: ['Review metrics + performance', 'Identify next growth focus', 'Report progress toward Dream Case Study']
    },
    {
      type: 'deep-dive',
      frequency: 'quarterly',
      duration: '60 minutes',
      agenda: ['Revisit Current State', 'Realign goals', 'Optimize scope and opportunities']
    }
  ]
};

// 📊 Data Quality Scoring Guide

export const DATA_QUALITY_GUIDE = {
  1: { label: 'Unknown', description: 'No data available', color: 'red' },
  2: { label: 'Limited', description: 'Some data, low confidence', color: 'orange' },
  3: { label: 'Directional', description: 'Estimates or proxies available', color: 'yellow' },
  4: { label: 'Good', description: 'Reliable data with minor gaps', color: 'blue' },
  5: { label: 'Dialed', description: 'Fully reliable & synced', color: 'green' }
}; 