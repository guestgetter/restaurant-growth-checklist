export const DATA_QUALITY_GUIDE = {
  1: { label: 'Unknown', description: 'No data available', color: 'red' },
  2: { label: 'Limited', description: 'Some data, low confidence', color: 'orange' },
  3: { label: 'Directional', description: 'Estimates or proxies available', color: 'yellow' },
  4: { label: 'Good', description: 'Reliable data with minor gaps', color: 'blue' },
  5: { label: 'Dialed', description: 'Fully reliable & synced', color: 'green' }
};

export const SAMPLE_PHASES = [
  {
    id: 'onboarding',
    name: 'Onboarding & Setup',
    description: 'Foundation setting, tracking setup, and client alignment',
    estimatedDuration: 'Weeks 1-2',
    status: 'in-progress',
    metrics: ['dataQualityScore'],
    checklists: [
      {
        id: 'internal-alignment',
        title: 'Internal Alignment',
        category: 'Setup',
        assignedTo: 'Account Manager',
        priority: 'high',
        completionPercentage: 50,
        items: [
          {
            id: 'assign-leads',
            description: 'Assign account lead + fulfillment manager',
            completed: true
          },
          {
            id: 'review-intake',
            description: 'Review intake form + discovery notes',
            completed: false
          }
        ]
      }
    ]
  }
]; 