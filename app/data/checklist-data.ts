export interface ChecklistSubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  description?: string;
  subTasks?: ChecklistSubTask[];
  tips?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: 'article' | 'tool' | 'template' | 'video';
  }>;
}

export interface ChecklistSection {
  id: string;
  title: string;
  emoji: string;
  description: string;
  items: ChecklistItem[];
}

export interface ChecklistProgress {
  itemId: string;
  subTaskIds: string[];
}

export const checklistData: ChecklistSection[] = [
  {
    id: 'onboarding',
    title: 'ONBOARDING & SETUP',
    emoji: '🚀',
    description: 'Foundation setting, tracking setup, and client alignment (Weeks 1-2)',
    items: [
      {
        id: 'onboarding-1',
        text: 'Review Meeting Summary + Proposal',
        completed: false,
        description: 'Review all pre-close conversations and confirm proposal details before kick-off.',
        subTasks: [
          {
            id: 'onboarding-1-1',
            text: 'Review all conversation history in Client Profile',
            completed: false,
          },
          {
            id: 'onboarding-1-2',
            text: 'Confirm proposal details and scope of work',
            completed: false,
          },
          {
            id: 'onboarding-1-3',
            text: 'Review client\'s stated goals and challenges',
            completed: false,
          },
          {
            id: 'onboarding-1-4',
            text: 'Prepare kick-off call agenda and talking points',
            completed: false,
          },
        ],
        tips: [
          'Having full context before the kick-off call shows professionalism',
          'Reference specific points from previous conversations to build rapport',
          'Come prepared with questions about their business goals',
        ],
        resources: [
          {
            title: 'Client Profile Manager',
            url: '/client-profile',
            type: 'tool',
          },
        ],
      },
      {
        id: 'onboarding-2',
        text: 'Create Client Profile',
        completed: false,
        description: 'Set up comprehensive client profile with baseline metrics and dream case study.',
        subTasks: [
          {
            id: 'onboarding-2-1',
            text: 'Create new client profile in system',
            completed: false,
          },
          {
            id: 'onboarding-2-2',
            text: 'Document "Starting Baseline": current revenue, traffic, reviews, challenges',
            completed: false,
          },
          {
            id: 'onboarding-2-3',
            text: 'Establish "Dream Case Study" vision: exciting, measurable transformation goal',
            completed: false,
          },
          {
            id: 'onboarding-2-4',
            text: 'Add all prospect conversation history and summaries',
            completed: false,
          },
        ],
        tips: [
          'Be specific about the Dream Case Study goal - "40% revenue increase in 6 months" not "more customers"',
          'Document baseline metrics for future comparison and case study development',
          'Include both quantitative metrics and qualitative challenges',
        ],
        resources: [
          {
            title: 'Client Profile Manager',
            url: '/client-profile',
            type: 'tool',
          },
          {
            title: 'Dream Case Study Worksheet',
            url: '#',
            type: 'template',
          },
        ],
      },
      {
        id: 'onboarding-3',
        text: 'Send Welcome Email + Strategy Overview',
        completed: false,
        description: 'Send comprehensive welcome package with strategy preview and kick-off call preparation.',
        subTasks: [
          {
            id: 'onboarding-3-1',
            text: 'Send personalized welcome email with team introductions',
            completed: false,
          },
          {
            id: 'onboarding-3-2',
            text: 'Include high-level strategy overview and what to expect',
            completed: false,
          },
          {
            id: 'onboarding-3-3',
            text: 'Outline kick-off call agenda and preparation items',
            completed: false,
          },
          {
            id: 'onboarding-3-4',
            text: 'Share initial access requirements and account information needed',
            completed: false,
          },
          {
            id: 'onboarding-3-5',
            text: 'Set expectations for communication rhythm and reporting',
            completed: false,
          },
        ],
        tips: [
          'Personal touch in the welcome email builds immediate rapport',
          'Give them a preview of the strategy to build excitement',
          'Clear expectations prevent confusion later',
        ],
        resources: [
          {
            title: 'Welcome Email Template',
            url: '#',
            type: 'template',
          },
        ],
      },
      {
        id: 'onboarding-4',
        text: 'Conduct Kick-Off Call - Priorities + Access',
        completed: false,
        description: 'Execute the critical kick-off call to establish priorities and secure access.',
        subTasks: [
          {
            id: 'onboarding-4-1',
            text: 'Make sure you\'re recording the call',
            completed: false,
          },
          {
            id: 'onboarding-4-2',
            text: 'Confirm business priorities and immediate focus areas',
            completed: false,
          },
          {
            id: 'onboarding-4-3',
            text: 'Secure access to all necessary platforms and accounts',
            completed: false,
          },
          {
            id: 'onboarding-4-4',
            text: 'Review and refine the "Dream Case Study" vision together',
            completed: false,
          },
          {
            id: 'onboarding-4-5',
            text: 'Schedule all recurring calls (weekly pulse + monthly strategic)',
            completed: false,
          },
          {
            id: 'onboarding-4-6',
            text: 'Add kick-off call summary to Client Profile conversation history',
            completed: false,
          },
        ],
        tips: [
          'Use this call to get buy-in on priorities and timeline',
          'Co-create the dream case study vision for ownership',
          'Schedule the entire year of monthly calls at the same time',
        ],
        resources: [
          {
            title: 'Client Profile Manager',
            url: '/client-profile',
            type: 'tool',
          },
          {
            title: 'Kick-off Call Agenda Template',
            url: '#',
            type: 'template',
          },
        ],
      },
      {
        id: 'onboarding-5',
        text: 'Schedule Pulse-Check + Strategic Calls',
        completed: false,
        description: 'Establish complete communication calendar for the entire year.',
        subTasks: [
          {
            id: 'onboarding-5-1',
            text: 'Schedule weekly pulse calls (15-30 min check-ins)',
            completed: false,
          },
          {
            id: 'onboarding-5-2',
            text: 'Schedule monthly strategic reporting calls (60 min) - same day, same time, entire year',
            completed: false,
          },
          {
            id: 'onboarding-5-3',
            text: 'Set up calendar invites with recurring meeting links',
            completed: false,
          },
          {
            id: 'onboarding-5-4',
            text: 'Share Growth OS dashboard access with client',
            completed: false,
          },
          {
            id: 'onboarding-5-5',
            text: 'Send calendar summary with all scheduled touchpoints',
            completed: false,
          },
        ],
        tips: [
          'Consistency builds trust - same day/time every month',
          'Weekly pulse calls keep momentum and catch issues early',
          'Send calendar summary so they can see the full year commitment',
        ],
      },
      {
        id: 'onboarding-6',
        text: 'Send Welcome Gift Basket',
        completed: false,
        description: 'Send thoughtful welcome gift to make a memorable first impression.',
        subTasks: [
          {
            id: 'onboarding-6-1',
            text: 'Select appropriate welcome gift based on client preferences',
            completed: false,
          },
          {
            id: 'onboarding-6-2',
            text: 'Include personalized note referencing their goals',
            completed: false,
          },
          {
            id: 'onboarding-6-3',
            text: 'Arrange delivery to business location',
            completed: false,
          },
          {
            id: 'onboarding-6-4',
            text: 'Follow up to confirm receipt and get reaction',
            completed: false,
          },
        ],
        tips: [
          'Personalization shows you were paying attention during sales process',
          'Gift should reflect their business or personal interests when possible',
          'Follow-up call gives you another touchpoint to build relationship',
        ],
        resources: [
          {
            title: 'Welcome Gift Ideas',
            url: '#',
            type: 'template',
          },
        ],
      },
      {
        id: 'onboarding-7',
        text: 'Account Access',
        completed: false,
        description: 'Gain access to all necessary client platforms and systems.',
        subTasks: [
          {
            id: 'onboarding-7-1',
            text: 'Website access obtained',
            completed: false,
          },
          {
            id: 'onboarding-7-2',
            text: 'Google Business Profile access secured',
            completed: false,
          },
          {
            id: 'onboarding-7-3',
            text: 'Meta Ads / Google Ads accounts connected',
            completed: false,
          },
          {
            id: 'onboarding-7-4',
            text: 'Email/SMS platforms (Klaviyo, etc.) integrated',
            completed: false,
          },
          {
            id: 'onboarding-7-5',
            text: 'POS + Reservation Systems connected (if available)',
            completed: false,
          },
        ],
        tips: [
          'Use a shared password manager for secure credential storage',
          'Document which team member has access to what',
          'Set up admin access where possible for future team changes',
        ],
      },
      {
        id: 'onboarding-8',
        text: 'Technical Tracking Setup Complete',
        completed: false,
        description: 'Install all necessary tracking and measurement infrastructure.',
        subTasks: [
          {
            id: 'onboarding-8-1',
            text: 'Install Meta Pixel',
            completed: false,
          },
          {
            id: 'onboarding-8-2',
            text: 'Install Google Ads Tag',
            completed: false,
          },
          {
            id: 'onboarding-8-3',
            text: 'Set up Google Tag Manager with centralized scripts',
            completed: false,
          },
          {
            id: 'onboarding-8-4',
            text: 'Configure GA4 with enhanced measurement + conversions',
            completed: false,
          },
          {
            id: 'onboarding-8-5',
            text: 'Define + track goals (opt-ins, bookings, redemptions, inquiries)',
            completed: false,
          },
        ],
        tips: [
          'Test all tracking with browser extensions before going live',
          'Set up conversion values for ROI calculation',
          'Document all tracking codes for future reference',
        ],
      },
      {
        id: 'onboarding-9',
        text: 'Billing',
        completed: false,
        description: 'Set up billing and payment processing systems.',
        subTasks: [
          {
            id: 'onboarding-9-1',
            text: 'Payment method collected and verified',
            completed: false,
          },
          {
            id: 'onboarding-9-2',
            text: 'Billing schedule confirmed (monthly/quarterly)',
            completed: false,
          },
          {
            id: 'onboarding-9-3',
            text: 'Invoice delivery preferences set',
            completed: false,
          },
          {
            id: 'onboarding-9-4',
            text: 'Auto-billing enabled and tested',
            completed: false,
          },
        ],
        tips: [
          'Set up auto-billing to reduce administrative overhead',
          'Send a test invoice to verify the billing process works',
          'Document payment terms and late fee policies clearly',
        ],
      },
      {
        id: 'onboarding-10',
        text: 'Media Folder Access',
        completed: false,
        description: 'Establish shared media and asset management systems.',
        subTasks: [
          {
            id: 'onboarding-10-1',
            text: 'Create shared Google Drive or Dropbox folder',
            completed: false,
          },
          {
            id: 'onboarding-10-2',
            text: 'Collect existing brand assets (logos, images, guidelines)',
            completed: false,
          },
          {
            id: 'onboarding-10-3',
            text: 'Set up organized folder structure for campaigns',
            completed: false,
          },
          {
            id: 'onboarding-10-4',
            text: 'Grant client access to shared folders',
            completed: false,
          },
        ],
        tips: [
          'Use consistent naming conventions for all assets',
          'Create separate folders for raw files vs. final assets',
          'Set appropriate permissions for client access',
        ],
      },
      {
        id: 'onboarding-11',
        text: 'Mailing Address Collected',
        completed: false,
        description: 'Gather complete business address and contact information.',
        subTasks: [
          {
            id: 'onboarding-11-1',
            text: 'Business address for Google Business Profile',
            completed: false,
          },
          {
            id: 'onboarding-11-2',
            text: 'Billing address (if different from business)',
            completed: false,
          },
          {
            id: 'onboarding-11-3',
            text: 'Primary contact phone number',
            completed: false,
          },
          {
            id: 'onboarding-11-4',
            text: 'Emergency contact information',
            completed: false,
          },
        ],
        tips: [
          'Verify address matches Google Business Profile exactly',
          'Get multiple contact methods for important communications',
          'Update address in all marketing platforms for consistency',
        ],
      },
      {
        id: 'onboarding-12',
        text: 'Restaurant Offers Inventory',
        completed: false,
        description: 'Build a proven offer arsenal - 5 go-to promotions plus bulletproof backup options.',
        subTasks: [
          {
            id: 'onboarding-12-1',
            text: 'Define 5 "Always Ready" offers the restaurant will run anytime',
            completed: false,
          },
          {
            id: 'onboarding-12-2',
            text: 'Document offer terms: minimum purchase, restrictions, expiration rules',
            completed: false,
          },
          {
            id: 'onboarding-12-3',
            text: 'Create seasonal promotion calendar (holidays, local events, slow periods)',
            completed: false,
          },
          {
            id: 'onboarding-12-4',
            text: 'Set up "Proven Offer Library" with tested high-performers for this client',
            completed: false,
          },
          {
            id: 'onboarding-12-5',
            text: 'Configure loyalty program structure and rewards',
            completed: false,
          },
        ],
        tips: [
          'Best restaurant offers: Free appetizer with entree, BOGO deals, "First visit" discounts, Family meal bundles',
          'Always include minimum purchase requirements to protect margins',
          'Create urgency with limited-time offers and exclusive access',
          'Test offers that drive repeat visits, not just one-time transactions',
        ],
        resources: [
          {
            title: 'Restaurant Offer Templates',
            url: '#',
            type: 'template',
          },
          {
            title: 'Proven Offer Library',
            url: '#',
            type: 'tool',
          },
        ],
      },
      {
        id: 'onboarding-13',
        text: 'Campaign Intelligence Infrastructure Ready',
        completed: false,
        description: 'Establish systematic campaign tracking and attribution systems.',
        subTasks: [
          {
            id: 'onboarding-13-1',
            text: 'Create UTM Library (naming conventions + live links)',
            completed: false,
          },
          {
            id: 'onboarding-13-2',
            text: 'Create campaign index doc',
            completed: false,
          },
          {
            id: 'onboarding-13-3',
            text: 'Test events using Pixel Helper / Tag Assistant',
            completed: false,
          },
          {
            id: 'onboarding-13-4',
            text: 'Create "Tracking Snapshot" Doc and verify dashboard links',
            completed: false,
          },
        ],
        tips: [
          'Use consistent UTM naming conventions across all campaigns',
          'Create a master spreadsheet with all UTM links',
          'Set up automated reporting for key metrics',
        ],
      },
    ],
  },
  {
    id: 'magnet',
    title: 'MAGNET - ATTRACT HIGH-INTENT GUESTS',
    emoji: '🧲',
    description: 'Build awareness, capture leads, and increase local visibility (Weeks 2-4)',
    items: [
      {
        id: 'magnet-1',
        text: 'Lead Generation Funnel Built',
        completed: false,
        description: 'Create compelling offers and capture systems to convert interest into actionable leads.',
        subTasks: [
          {
            id: 'magnet-1-1',
            text: 'Build lead gen funnel with compelling offer',
            completed: false,
          },
          {
            id: 'magnet-1-2',
            text: 'Run awareness + offer ads (Meta/IG)',
            completed: false,
          },
          {
            id: 'magnet-1-3',
            text: 'Launch SMS/email list growth campaign',
            completed: false,
          },
          {
            id: 'magnet-1-4',
            text: 'Build content calendar (social posts, reels, stories)',
            completed: false,
          },
        ],
        tips: [
          'Offer value upfront - "Free appetizer" performs better than "10% off"',
          'Test different offer types: percentage off, BOGO, exclusive access',
          'Use social proof in all lead magnets - "Join 1,200+ locals who..."',
        ],
        resources: [
          {
            title: 'Restaurant Lead Magnet Ideas',
            url: '#',
            type: 'template',
          },
          {
            title: 'Facebook Ads for Restaurants Guide',
            url: '#',
            type: 'article',
          },
        ],
      },
      {
        id: 'magnet-2',
        text: 'Google Business Profile Fully Optimized',
        completed: false,
        description: 'Maximize local search visibility and engagement through complete GMB optimization.',
        subTasks: [
          {
            id: 'magnet-2-1',
            text: 'Fully optimize Google Business Profile (GMB)',
            completed: false,
          },
          {
            id: 'magnet-2-2',
            text: 'Post weekly GMB updates (offers, promos, events)',
            completed: false,
          },
          {
            id: 'magnet-2-3',
            text: 'Fix NAP citations (Yelp, TripAdvisor, etc.)',
            completed: false,
          },
          {
            id: 'magnet-2-4',
            text: 'Start local backlink + PR outreach',
            completed: false,
          },
        ],
        tips: [
          'Post to GMB 3-4 times per week minimum for best visibility',
          'Use high-quality photos updated monthly',
          'Respond to all reviews within 24 hours',
          'Include keywords naturally in your business description',
        ],
      },
      {
        id: 'magnet-3',
        text: 'Social Media Content Engine Active',
        completed: false,
        description: 'Establish consistent content creation and publishing systems across platforms.',
        subTasks: [
          {
            id: 'magnet-3-1',
            text: 'Create 30-day content calendar template',
            completed: false,
          },
          {
            id: 'magnet-3-2',
            text: 'Set up content creation workflow',
            completed: false,
          },
          {
            id: 'magnet-3-3',
            text: 'Launch Instagram Stories daily routine',
            completed: false,
          },
          {
            id: 'magnet-3-4',
            text: 'Schedule weekly Reels showcasing food/atmosphere',
            completed: false,
          },
        ],
        tips: [
          'Batch content creation - film multiple posts in one session',
          'Use trending audio in Reels for maximum reach',
          'Behind-the-scenes content performs exceptionally well',
        ],
      },
      {
        id: 'magnet-4',
        text: 'Local Partnership Network Established',
        completed: false,
        description: 'Build strategic partnerships with complementary local businesses for cross-promotion.',
        subTasks: [
          {
            id: 'magnet-4-1',
            text: 'Identify 10 potential local business partners',
            completed: false,
          },
          {
            id: 'magnet-4-2',
            text: 'Create partnership proposal template',
            completed: false,
          },
          {
            id: 'magnet-4-3',
            text: 'Secure 3 active cross-promotion partnerships',
            completed: false,
          },
          {
            id: 'magnet-4-4',
            text: 'Launch first joint promotion/event',
            completed: false,
          },
        ],
        tips: [
          'Target businesses with similar customers but different services',
          'Offer mutual value - not just asking for favors',
          'Track referrals from each partnership for ROI measurement',
        ],
      },
    ],
  },
  {
    id: 'convert',
    title: 'CONVERT - TURN ATTENTION INTO REVENUE',
    emoji: '💰',
    description: 'Optimize conversion flows and build social proof (Weeks 4-6)',
    items: [
      {
        id: 'convert-1',
        text: 'Automated Review Generation System',
        completed: false,
        description: 'Systematically collect and leverage customer reviews for social proof and local SEO.',
        subTasks: [
          {
            id: 'convert-1-1',
            text: 'Set up automated review requests (SMS, email, QR codes)',
            completed: false,
          },
          {
            id: 'convert-1-2',
            text: 'Respond to reviews weekly',
            completed: false,
          },
          {
            id: 'convert-1-3',
            text: 'Repurpose top reviews in ads, emails, website',
            completed: false,
          },
          {
            id: 'convert-1-4',
            text: 'Create review incentive program',
            completed: false,
          },
        ],
        tips: [
          'Ask for reviews within 1-2 hours of visit while experience is fresh',
          'Make review requests personal and specific to their order',
          'Always respond to negative reviews professionally and publicly',
        ],
        resources: [
          {
            title: 'Review Request SMS Templates',
            url: '#',
            type: 'template',
          },
          {
            title: 'Google Review QR Code Generator',
            url: '#',
            type: 'tool',
          },
        ],
      },
      {
        id: 'convert-2',
        text: 'Website Conversion Optimization Complete',
        completed: false,
        description: 'Remove friction and optimize user experience to maximize online orders and reservations.',
        subTasks: [
          {
            id: 'convert-2-1',
            text: 'Audit booking + order flows (desktop + mobile)',
            completed: false,
          },
          {
            id: 'convert-2-2',
            text: 'Test friction points, offers, and copy',
            completed: false,
          },
          {
            id: 'convert-2-3',
            text: 'A/B test conversion pages',
            completed: false,
          },
          {
            id: 'convert-2-4',
            text: 'Add trust signals (social proof, awards, guarantees)',
            completed: false,
          },
        ],
        tips: [
          'Test mobile experience first - most traffic comes from phones',
          'Add customer photos and testimonials throughout the ordering flow',
          'Use urgency carefully - "Limited time" vs "Available today"',
        ],
      },
      {
        id: 'convert-3',
        text: 'Email Marketing System Operational',
        completed: false,
        description: 'Build and nurture your email list with automated sequences and regular campaigns.',
        subTasks: [
          {
            id: 'convert-3-1',
            text: 'Set up welcome email sequence',
            completed: false,
          },
          {
            id: 'convert-3-2',
            text: 'Create monthly newsletter template',
            completed: false,
          },
          {
            id: 'convert-3-3',
            text: 'Launch birthday/anniversary email program',
            completed: false,
          },
          {
            id: 'convert-3-4',
            text: 'Set up abandoned cart email sequence',
            completed: false,
          },
        ],
        tips: [
          'Welcome emails have the highest open rates - make them count',
          'Segment lists by customer behavior and preferences',
          'Include exclusive offers for email subscribers only',
        ],
      },
      {
        id: 'convert-4',
        text: 'Phone Conversion Process Optimized',
        completed: false,
        description: 'Train staff and optimize phone interactions to maximize reservation conversion rates.',
        subTasks: [
          {
            id: 'convert-4-1',
            text: 'Create phone scripts for reservations and inquiries',
            completed: false,
          },
          {
            id: 'convert-4-2',
            text: 'Train staff on upselling techniques',
            completed: false,
          },
          {
            id: 'convert-4-3',
            text: 'Set up call tracking and recording system',
            completed: false,
          },
          {
            id: 'convert-4-4',
            text: 'Create follow-up system for missed calls',
            completed: false,
          },
        ],
        tips: [
          'Always offer alternatives if requested time is unavailable',
          'Capture email addresses during phone reservations',
          'Track conversion rates by staff member for coaching opportunities',
        ],
      },
    ],
  },
  {
    id: 'keep',
    title: 'KEEP - RETAIN & BUILD LOYALTY',
    emoji: '❤️',
    description: 'Ongoing relationship building and loyalty programs (Ongoing)',
    items: [
      {
        id: 'keep-1',
        text: 'Brand Voice & Visual Identity Defined',
        completed: false,
        description: 'Establish consistent brand personality across all customer touchpoints.',
        subTasks: [
          {
            id: 'keep-1-1',
            text: 'Define brand tone, visuals, and language',
            completed: false,
          },
          {
            id: 'keep-1-2',
            text: 'Create brand guidelines document',
            completed: false,
          },
          {
            id: 'keep-1-3',
            text: 'Train staff on brand voice standards',
            completed: false,
          },
          {
            id: 'keep-1-4',
            text: 'Audit all customer touchpoints for consistency',
            completed: false,
          },
        ],
        tips: [
          'Your brand voice should reflect your ideal customer\'s personality',
          'Be consistent across all platforms - social, website, in-person',
          'Document specific phrases and words to use/avoid',
        ],
        resources: [
          {
            title: 'Restaurant Brand Voice Template',
            url: '#',
            type: 'template',
          },
        ],
      },
      {
        id: 'keep-2',
        text: 'Customer Lifecycle Automation Built',
        completed: false,
        description: 'Create automated touchpoints that nurture customers throughout their journey.',
        subTasks: [
          {
            id: 'keep-2-1',
            text: 'Launch welcome automation + nurture flows',
            completed: false,
          },
          {
            id: 'keep-2-2',
            text: 'Send 2–4 monthly campaigns (stories, promos, content)',
            completed: false,
          },
          {
            id: 'keep-2-3',
            text: 'Send birthday or surprise-and-delight SMS',
            completed: false,
          },
          {
            id: 'keep-2-4',
            text: 'Create win-back campaign for lapsed customers',
            completed: false,
          },
        ],
        tips: [
          'Automate based on customer behavior, not just time intervals',
          'Personalize messages with past order history when possible',
          'Test sending times - dinner time emails perform poorly for restaurants',
        ],
      },
      {
        id: 'keep-3',
        text: 'Event & Experience Marketing Active',
        completed: false,
        description: 'Create special events and experiences that drive repeat visits and word-of-mouth.',
        subTasks: [
          {
            id: 'keep-3-1',
            text: 'Build catering/event packages',
            completed: false,
          },
          {
            id: 'keep-3-2',
            text: 'Design event-specific landing pages',
            completed: false,
          },
          {
            id: 'keep-3-3',
            text: 'Promote events monthly',
            completed: false,
          },
          {
            id: 'keep-3-4',
            text: 'Track event inquiries and conversions',
            completed: false,
          },
        ],
        tips: [
          'Start with small, manageable events to build confidence',
          'Partner with local businesses for co-hosted events',
          'Document successful events for replication',
        ],
      },
      {
        id: 'keep-4',
        text: 'Guest Feedback Loop Established',
        completed: false,
        description: 'Systematically collect, analyze, and act on customer feedback for continuous improvement.',
        subTasks: [
          {
            id: 'keep-4-1',
            text: 'Send post-visit "How was it?" emails',
            completed: false,
          },
          {
            id: 'keep-4-2',
            text: 'Monitor and tag guest feedback',
            completed: false,
          },
          {
            id: 'keep-4-3',
            text: 'Share standout guest comments publicly',
            completed: false,
          },
          {
            id: 'keep-4-4',
            text: 'Deliver quarterly "Guest Love Report"',
            completed: false,
          },
        ],
        tips: [
          'Make feedback collection feel personal, not corporate',
          'Act on feedback quickly and let customers know you made changes',
          'Celebrate positive feedback with your team regularly',
        ],
      },
      {
        id: 'keep-5',
        text: 'Loyalty Program & VIP Experience',
        completed: false,
        description: 'Reward repeat customers and create exclusive experiences for your best guests.',
        subTasks: [
          {
            id: 'keep-5-1',
            text: 'Design loyalty program structure',
            completed: false,
          },
          {
            id: 'keep-5-2',
            text: 'Set up loyalty program technology',
            completed: false,
          },
          {
            id: 'keep-5-3',
            text: 'Create VIP customer recognition system',
            completed: false,
          },
          {
            id: 'keep-5-4',
            text: 'Launch exclusive member benefits/events',
            completed: false,
          },
        ],
        tips: [
          'Keep loyalty programs simple - complicated rules reduce participation',
          'Offer experiential rewards, not just discounts',
          'Recognize VIPs publicly to make them feel special',
        ],
      },
    ],
  },
  {
    id: 'grow',
    title: 'GROW - ONGOING VALUE DELIVERY',
    emoji: '📈',
    description: 'Continuous account management and strategic growth initiatives (Monthly+)',
    items: [
      {
        id: 'grow-1',
        text: 'Monthly Performance Reviews & Optimization',
        completed: false,
        description: 'Systematic monthly analysis and optimization of all growth initiatives.',
        subTasks: [
          {
            id: 'grow-1-1',
            text: 'Conduct monthly Growth OS Dashboard review with client',
            completed: false,
          },
          {
            id: 'grow-1-2',
            text: 'Analyze GAC, LTV, repeat rate, and membership growth trends',
            completed: false,
          },
          {
            id: 'grow-1-3',
            text: 'Identify top 3 optimization opportunities for next month',
            completed: false,
          },
          {
            id: 'grow-1-4',
            text: 'Create action plan with specific deadlines and owners',
            completed: false,
          },
          {
            id: 'grow-1-5',
            text: 'Send monthly executive summary report to client leadership',
            completed: false,
          },
        ],
        tips: [
          'Use the Growth OS Dashboard as your single source of truth',
          'Focus on trends and insights, not just raw numbers',
          'Always include specific next steps and accountability',
          'Celebrate wins prominently before discussing challenges',
        ],
        resources: [
          {
            title: 'Monthly Review Template',
            url: '#',
            type: 'template',
          },
          {
            title: 'Executive Summary Format',
            url: '#',
            type: 'template',
          },
        ],
      },
      {
        id: 'grow-2',
        text: 'Bi-Weekly Strategic Pulse Calls',
        completed: false,
        description: 'Regular check-ins to maintain momentum and address challenges quickly.',
        subTasks: [
          {
            id: 'grow-2-1',
            text: 'Schedule recurring 30-min pulse calls every two weeks',
            completed: false,
          },
          {
            id: 'grow-2-2',
            text: 'Prepare pulse call agenda: wins, challenges, priorities, support needed',
            completed: false,
          },
          {
            id: 'grow-2-3',
            text: 'Review progress on previous action items',
            completed: false,
          },
          {
            id: 'grow-2-4',
            text: 'Address any urgent issues or opportunities',
            completed: false,
          },
          {
            id: 'grow-2-5',
            text: 'Send follow-up summary with action items within 24 hours',
            completed: false,
          },
        ],
        tips: [
          'Keep calls focused and time-boxed to respect client time',
          'Always start with wins and positive momentum',
          'Use screen sharing to review actual dashboard data together',
          'End every call with clear next steps and timelines',
        ],
      },
      {
        id: 'grow-3',
        text: 'Campaign Performance Optimization',
        completed: false,
        description: 'Continuous optimization of advertising and marketing campaigns for maximum ROI.',
        subTasks: [
          {
            id: 'grow-3-1',
            text: 'Weekly ad spend and ROAS analysis',
            completed: false,
          },
          {
            id: 'grow-3-2',
            text: 'A/B test new ad creatives, copy, and audiences monthly',
            completed: false,
          },
          {
            id: 'grow-3-3',
            text: 'Optimize campaigns based on cost per lead and conversion rates',
            completed: false,
          },
          {
            id: 'grow-3-4',
            text: 'Scale winning campaigns and pause underperforming ones',
            completed: false,
          },
          {
            id: 'grow-3-5',
            text: 'Test new channels and campaign types quarterly',
            completed: false,
          },
        ],
        tips: [
          'Set clear benchmarks for campaign performance and optimization triggers',
          'Document all tests and learnings for future reference',
          'Focus on quality leads over volume - track through to revenue',
          'Seasonal adjustments are crucial for restaurant campaigns',
        ],
      },
      {
        id: 'grow-4',
        text: 'Data Quality & Tracking Maintenance',
        completed: false,
        description: 'Ensure data accuracy and completeness for informed decision-making.',
        subTasks: [
          {
            id: 'grow-4-1',
            text: 'Monthly audit of tracking setup and data quality scores',
            completed: false,
          },
          {
            id: 'grow-4-2',
            text: 'Fix any broken tracking or attribution issues immediately',
            completed: false,
          },
          {
            id: 'grow-4-3',
            text: 'Work toward improving data quality scores from 3 to 5',
            completed: false,
          },
          {
            id: 'grow-4-4',
            text: 'Implement new tracking for emerging metrics and opportunities',
            completed: false,
          },
          {
            id: 'grow-4-5',
            text: 'Train client team on basic metrics interpretation',
            completed: false,
          },
        ],
        tips: [
          'Use the enablement checklists to systematically improve data quality',
          'Prioritize metrics that most impact the client\'s Dream Case Study goal',
          'Document any data gaps and create plans to fill them',
          'Make data accessible and understandable to the client team',
        ],
      },
      {
        id: 'grow-5',
        text: 'Strategic Growth Initiatives',
        completed: false,
        description: 'Proactive identification and implementation of new growth opportunities.',
        subTasks: [
          {
            id: 'grow-5-1',
            text: 'Quarterly strategic planning sessions with client leadership',
            completed: false,
          },
          {
            id: 'grow-5-2',
            text: 'Research and propose new growth channels or tactics',
            completed: false,
          },
          {
            id: 'grow-5-3',
            text: 'Develop and test new campaigns for seasonal opportunities',
            completed: false,
          },
          {
            id: 'grow-5-4',
            text: 'Identify partnership and collaboration opportunities',
            completed: false,
          },
          {
            id: 'grow-5-5',
            text: 'Create case studies and success stories for client marketing',
            completed: false,
          },
        ],
        tips: [
          'Stay ahead of industry trends and new marketing opportunities',
          'Always tie new initiatives back to core metrics and business goals',
          'Start small with pilot programs before full implementation',
          'Document successes for replication with other clients',
        ],
      },
      {
        id: 'grow-6',
        text: 'Client Success & Retention Management',
        completed: false,
        description: 'Proactive client relationship management and retention strategies.',
        subTasks: [
          {
            id: 'grow-6-1',
            text: 'Monitor client satisfaction and address concerns proactively',
            completed: false,
          },
          {
            id: 'grow-6-2',
            text: 'Identify opportunities for service expansion or upselling',
            completed: false,
          },
          {
            id: 'grow-6-3',
            text: 'Prepare quarterly business reviews with ROI documentation',
            completed: false,
          },
          {
            id: 'grow-6-4',
            text: 'Collect and showcase client testimonials and case studies',
            completed: false,
          },
          {
            id: 'grow-6-5',
            text: 'Plan and execute client appreciation initiatives',
            completed: false,
          },
        ],
        tips: [
          'Be proactive about addressing issues before they become problems',
          'Always have concrete ROI data ready for renewal conversations',
          'Celebrate client wins publicly (with permission) to build credibility',
          'Regular face-to-face meetings strengthen relationships significantly',
        ],
      },
      {
        id: 'grow-7',
        text: 'Industry Leadership & Thought Sharing',
        completed: false,
        description: 'Position client as industry leader through content and thought leadership.',
        subTasks: [
          {
            id: 'grow-7-1',
            text: 'Identify speaking opportunities at industry events for client',
            completed: false,
          },
          {
            id: 'grow-7-2',
            text: 'Create thought leadership content featuring client insights',
            completed: false,
          },
          {
            id: 'grow-7-3',
            text: 'Nominate client for relevant industry awards and recognition',
            completed: false,
          },
          {
            id: 'grow-7-4',
            text: 'Facilitate connections with other industry leaders and partners',
            completed: false,
          },
          {
            id: 'grow-7-5',
            text: 'Share client success in industry publications and podcasts',
            completed: false,
          },
        ],
        tips: [
          'This builds tremendous goodwill and positions you as a true partner',
          'Industry recognition often leads to increased local awareness',
          'Document all PR value and include in ROI calculations',
          'Many clients value recognition more than just revenue growth',
        ],
      },
    ],
  },
]; 