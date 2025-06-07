import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { prisma } from '../../lib/prisma';
import { redirect } from 'next/navigation';
import DashboardClient from '../../components/DashboardClient';

// ============================================================================
// INTERFACES (These can be shared or moved to a types file)
// ============================================================================
interface MetricData {
  value: string | number;
  change: number;
  dataQuality: 1 | 2 | 3 | 4 | 5;
  trend: 'up' | 'down' | 'stable';
  lastUpdated?: string;
  dataSource: 'api' | 'manual' | 'imported';
  notes?: string;
}
interface ChecklistItem {
  name: string;
  completed: boolean;
  description: string;
}
interface ActionStep {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}
interface MetricWithChecklist {
  metric: MetricData;
  checklist: ChecklistItem[];
  benchmarkCategory: 'excellent' | 'good' | 'average' | 'below-average' | 'poor';
  actionSteps: ActionStep[];
}

// ============================================================================
// SERVER-SIDE DATA FETCHING
// ============================================================================
async function getCurrentClient(userId: string) {
  // This logic needs to be adapted to your actual schema
  // Assuming a user has multiple sub-accounts and one is active
  const subAccount = await prisma.subAccount.findFirst({
    where: { 
      userId: userId,
      // Add a filter for an 'active' or 'selected' client if you have one
    },
  });
  return subAccount;
}


async function getMetricsData(clientId: string): Promise<Record<string, MetricWithChecklist>> {
  console.log(`Fetching metrics for client: ${clientId}`);
  // This is placeholder data. In a real application, you'd fetch this from a database.
  // This should be adapted to use the new ChecklistProgress model.
  return {
    gac: {
      metric: { value: '$12.45', change: -8.2, dataQuality: 4, trend: 'down', lastUpdated: '2025-01-06', dataSource: 'api', notes: 'Pulled from Google Ads API' },
      checklist: [
        { name: 'Meta & Google Pixels installed', completed: true, description: '...' },
        { name: 'UTM parameters on campaigns', completed: true, description: '...' },
        { name: 'Conversion attribution setup', completed: false, description: '...' }
      ],
      benchmarkCategory: 'excellent' as const,
      actionSteps: [
        { title: 'Optimize referral program', description: 'Your $12.45 CAC is excellent...', priority: 'high' as const },
      ]
    },
     ltv: {
      metric: { value: '$156.78', change: 12.3, dataQuality: 3, trend: 'up', lastUpdated: '2025-01-05', dataSource: 'manual', notes: 'Calculated from POS data' },
      checklist: [],
      benchmarkCategory: 'good' as const,
      actionSteps: [
        { title: 'Launch loyalty program', description: '...', priority: 'high' as const },
      ]
    },
     repeatRate: {
      metric: { value: '34.2%', change: 5.1, dataQuality: 2, trend: 'up', lastUpdated: '2025-01-04', dataSource: 'imported', notes: 'Historical data import' },
       checklist: [],
      benchmarkCategory: 'good' as const,
      actionSteps: [
        { title: 'Personalize guest experiences', description: '...', priority: 'high' as const },
      ]
    },
     avgSpend: {
      metric: { value: '$28.50', change: 2.8, dataQuality: 5, trend: 'up', lastUpdated: '2025-01-06', dataSource: 'api', notes: 'Real-time POS integration' },
       checklist: [],
      benchmarkCategory: 'good' as const,
      actionSteps: [
        { title: 'Strategic menu positioning', description: '...', priority: 'high' as const },
      ]
    }
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const currentClient = await getCurrentClient(session.user.id);

  if (!currentClient) {
    return (
      <div className="flex-1 p-8 text-center">
        <h1 className="text-2xl font-bold">No Active Client Selected</h1>
        <p className="mt-2 text-gray-600">Please select a client from the sidebar to view their dashboard.</p>
      </div>
    );
  }

  const metrics = await getMetricsData(currentClient.id);

  return <DashboardClient metrics={metrics} clientName={currentClient.name} />;
} 