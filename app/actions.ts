'use server';

import { getServerSession } from 'next-auth/next';
import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/prisma';
import { authOptions } from './api/auth/[...nextauth]/route';

export async function updateChecklistProgress(
  clientId: string,
  itemId: string,
  subTaskId: string | null
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('You must be logged in to update checklist progress.');
  }
  const userId = session.user.id;

  try {
    const existingProgress = await prisma.checklistProgress.findUnique({
      where: {
        userId_clientId_itemId: {
          userId,
          clientId,
          itemId,
        },
      },
    });

    if (subTaskId) {
      // Handle sub-task update
      const currentSubTasks = new Set(existingProgress?.subTaskIds || []);
      if (currentSubTasks.has(subTaskId)) {
        currentSubTasks.delete(subTaskId);
      } else {
        currentSubTasks.add(subTaskId);
      }
      
      await prisma.checklistProgress.upsert({
        where: {
          userId_clientId_itemId: { userId, clientId, itemId },
        },
        update: {
          subTaskIds: Array.from(currentSubTasks),
        },
        create: {
          userId,
          clientId,
          itemId,
          subTaskIds: Array.from(currentSubTasks),
        },
      });

    } else {
      // Handle main item update (toggle completion status)
      // For now, we assume toggling a main item doesn't affect the subtasks in the DB
      // The `completed` status is derived on read.
      // We just need to ensure a record exists.
      if (!existingProgress) {
        await prisma.checklistProgress.create({
          data: {
            userId,
            clientId,
            itemId,
            subTaskIds: [],
          }
        });
      }
      // If we wanted to mark an item as "incomplete" we might delete the record
      // if no subtasks are completed. That logic can be added here.
    }

    revalidatePath('/checklist');
    return { success: true };

  } catch (error) {
    console.error('Failed to update checklist progress:', error);
    return { success: false, error: 'Failed to update progress.' };
  }
} 