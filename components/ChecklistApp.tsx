import { getServerSession } from 'next-auth/next';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { prisma } from '../lib/prisma';
import { checklistData, ChecklistProgress as ChecklistProgressType } from '../app/data/checklist-data';
import ChecklistClient from './ChecklistClient';

async function getChecklistProgress(userId: string, clientId: string) {
  try {
    const progress: ChecklistProgressType[] = await prisma.checklistProgress.findMany({
      where: {
        userId,
        clientId,
      },
      select: {
        itemId: true,
        subTaskIds: true,
      },
    });

    const completedItems = new Set(progress.map((p: ChecklistProgressType) => p.itemId));
    const completedSubTasks = new Set(progress.flatMap((p: ChecklistProgressType) => p.subTaskIds));
    
    return { completedItems, completedSubTasks };
  } catch (error) {
    console.error('Error fetching checklist progress:', error);
    return { completedItems: new Set(), completedSubTasks: new Set() };
  }
}

async function getCurrentClient(userId: string) {
    // This function should contain the logic to determine the user's currently selected client.
    // For now, we'll fetch the first client associated with the user as a placeholder.
    // This needs to be replaced with robust logic for fetching the *active* client.
    const clientAccount = await prisma.clientAccount.findFirst({
        where: {
            users: {
                some: {
                    id: userId
                }
            }
        },
        select: {
            id: true
        }
    });
    return clientAccount;
}

export default async function ChecklistApp() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Please log in to view the checklist.</div>;
  }
  
  const currentClient = await getCurrentClient(session.user.id);

  if (!currentClient) {
    return <div>No client account associated. Please create or select one.</div>
  }

  const { completedItems, completedSubTasks } = await getChecklistProgress(session.user.id, currentClient.id);

  const sectionsWithProgress = checklistData.map(section => ({
    ...section,
    items: section.items.map(item => ({
      ...item,
      completed: completedItems.has(item.id),
      subTasks: item.subTasks?.map(subTask => ({
        ...subTask,
        completed: completedSubTasks.has(subTask.id),
      })),
    })),
  }));

  return (
    <ChecklistClient 
      sections={sectionsWithProgress} 
      initialCompletedItems={Array.from(completedItems)}
      initialCompletedSubTasks={Array.from(completedSubTasks)}
      currentClientId={currentClient.id}
    />
  );
} 