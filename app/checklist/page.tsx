import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';
import { prisma } from '../../lib/prisma';
import { redirect } from 'next/navigation';
import { ChecklistProvider } from '../../components/ChecklistContext';
import ChecklistClient from '../../components/ChecklistClient'; // Will be created next

// This function will fetch the current user's active sub-account
async function getCurrentSubAccount(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subAccounts: {
        // Assuming you have a way to determine the "active" one
        // For now, just taking the first one.
        take: 1,
      },
    },
  });
  return user?.subAccounts[0];
}

async function getChecklistProgress(subAccountId: string) {
  if (!subAccountId) return null;
  const progress = await prisma.checklistProgress.findUnique({
    where: { subAccountId },
  });
  // Ensure progress is a valid JSON object
  return progress?.progress ? JSON.parse(JSON.stringify(progress.progress)) : {};
}

export default async function ChecklistPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return redirect('/api/auth/signin?callbackUrl=/checklist');
  }

  const subAccount = await getCurrentSubAccount(session.user.id);
  
  if (!subAccount) {
    return (
      <div className="flex-1 p-8 text-center">
        <h1 className="text-2xl font-bold">No Sub-Account Found</h1>
        <p className="mt-2 text-gray-600">
          Please select or create a sub-account to view the checklist.
        </p>
      </div>
    );
  }

  const initialProgress = await getChecklistProgress(subAccount.id);

  return (
    <ChecklistProvider
      subAccountId={subAccount.id}
      initialProgress={initialProgress}
    >
      <ChecklistClient />
    </ChecklistProvider>
  );
} 