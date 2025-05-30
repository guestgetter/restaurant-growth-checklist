export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChecklistSection {
  id: string;
  title: string;
  emoji: string;
  description: string;
  items: ChecklistItem[];
}

export const checklistData: ChecklistSection[] = [
  {
    id: 'foundation',
    title: 'FOUNDATION',
    emoji: '🏗️',
    description: 'These pieces establish leverage, clarity, and readiness for growth.',
    items: [
      {
        id: 'foundation-1',
        text: 'Clear Concept + Niche Positioning (e.g. who it\'s for)',
        completed: false,
      },
      {
        id: 'foundation-2',
        text: 'Menu Optimized for Margin, Volume, or Signature Item Hook',
        completed: false,
      },
      {
        id: 'foundation-3',
        text: 'Cost Per Guest Acquisition Target Defined',
        completed: false,
      },
      {
        id: 'foundation-4',
        text: 'Annual Revenue Per Guest Target Defined',
        completed: false,
      },
      {
        id: 'foundation-5',
        text: 'Local SEO Fully Set Up (Google Business Profile + Keywords)',
        completed: false,
      },
      {
        id: 'foundation-6',
        text: 'CRM Connected (SMS, Email, Birthday, Offers)',
        completed: false,
      },
      {
        id: 'foundation-7',
        text: 'Signature Offer Engineered (BOGO, $20 GC, etc.)',
        completed: false,
      },
      {
        id: 'foundation-8',
        text: 'Tracking Dashboard (Sales, Reviews, Database Growth)',
        completed: false,
      },
      {
        id: 'foundation-9',
        text: 'Staff Incentives Aligned with Growth KPIs',
        completed: false,
      },
      {
        id: 'foundation-10',
        text: 'Guest-Getting KPI Board Visible Weekly',
        completed: false,
      },
    ],
  },
  {
    id: 'fill-funnel',
    title: 'FILL THE FUNNEL',
    emoji: '🔥',
    description: 'These actions consistently drive first-time guests into the restaurant.',
    items: [
      {
        id: 'funnel-1',
        text: 'Local Search Heatmap Created & Target Zones Defined',
        completed: false,
      },
      {
        id: 'funnel-2',
        text: 'Meta Ads Campaign(s) Running to Signature Offer',
        completed: false,
      },
      {
        id: 'funnel-3',
        text: 'Review Campaign Live (QR or Post-Visit Email Flow)',
        completed: false,
      },
      {
        id: 'funnel-4',
        text: 'Geo-Targeted Offer Flyers / Cards / Packaging in Circulation',
        completed: false,
      },
      {
        id: 'funnel-5',
        text: 'Local Partnerships / Cross-Promos Launched',
        completed: false,
      },
      {
        id: 'funnel-6',
        text: 'Birthday Club Acquisition Campaign Active',
        completed: false,
      },
      {
        id: 'funnel-7',
        text: 'Event / Catering Offer Ads Live (if applicable)',
        completed: false,
      },
      {
        id: 'funnel-8',
        text: '5+ "Whale Bait" Evergreen Video Assets Deployed',
        completed: false,
      },
      {
        id: 'funnel-9',
        text: 'Google Ads / Waze / Maps Offers Tested',
        completed: false,
      },
      {
        id: 'funnel-10',
        text: 'Weekly Social Reels Posted (Strategy > Food Porn)',
        completed: false,
      },
    ],
  },
  {
    id: 'convert-capture',
    title: 'CONVERT & CAPTURE',
    emoji: '🎯',
    description: 'These ensure first-time visitors become repeat guests and members.',
    items: [
      {
        id: 'convert-1',
        text: 'Offer Redemption Process Smooth + Measured',
        completed: false,
      },
      {
        id: 'convert-2',
        text: 'Database Growth Hitting Weekly Targets',
        completed: false,
      },
      {
        id: 'convert-3',
        text: 'Automated Follow-Up Flows (Post-Visit, Birthday, Winback)',
        completed: false,
      },
      {
        id: 'convert-4',
        text: 'Loyalty Program or VIP Club Promoted in Venue',
        completed: false,
      },
      {
        id: 'convert-5',
        text: 'Email + SMS Calendar Scheduled Weekly',
        completed: false,
      },
      {
        id: 'convert-6',
        text: 'Staff Trained to Invite Guests into Offers / Database',
        completed: false,
      },
      {
        id: 'convert-7',
        text: '3-Visit Habit Campaign Live',
        completed: false,
      },
      {
        id: 'convert-8',
        text: 'Offer Attribution + ROI Reporting Working',
        completed: false,
      },
      {
        id: 'convert-9',
        text: '"Reinvitation Matrix" Being Used Monthly',
        completed: false,
      },
      {
        id: 'convert-10',
        text: '30K Contact Goal Set + Tracked',
        completed: false,
      },
    ],
  },
  {
    id: 'deliver-compound',
    title: 'DELIVER & COMPOUND',
    emoji: '📈',
    description: 'These drive long-term value, reviews, referrals, and brand momentum.',
    items: [
      {
        id: 'deliver-1',
        text: 'Reviews Growing Weekly (50-100+/mo Target)',
        completed: false,
      },
      {
        id: 'deliver-2',
        text: 'Weekly CRM Report (Opens, Clicks, Sales, Revenue)',
        completed: false,
      },
      {
        id: 'deliver-3',
        text: '1x Monthly Appreciation Event / Activation',
        completed: false,
      },
      {
        id: 'deliver-4',
        text: 'Brand Story + Guest Stories Filmed & Shared',
        completed: false,
      },
      {
        id: 'deliver-5',
        text: 'Catering / Events Pipeline System Running',
        completed: false,
      },
      {
        id: 'deliver-6',
        text: 'Offer + Content Library Building Weekly',
        completed: false,
      },
      {
        id: 'deliver-7',
        text: 'Weekly/Monthly Video Shot for CRM or Ads',
        completed: false,
      },
      {
        id: 'deliver-8',
        text: 'Team Trained on Growth Mindset (Cost vs. Asset Mentality)',
        completed: false,
      },
      {
        id: 'deliver-9',
        text: 'Profit from Marketing > Spend (3:1 Minimum Goal)',
        completed: false,
      },
      {
        id: 'deliver-10',
        text: 'Marketing Assets Compounding (not replaced weekly)',
        completed: false,
      },
    ],
  },
]; 