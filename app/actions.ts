'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/prisma';

export async function updateChecklistProgress(
  subAccountId: string,
  progress: { [key: string]: string[] }
) {
  if (!subAccountId) {
    throw new Error('Sub-account ID is required.');
  }

  try {
    await prisma.checklistProgress.upsert({
      where: {
        subAccountId: subAccountId,
      },
      update: {
        progress: progress,
      },
      create: {
        subAccountId: subAccountId,
        progress: progress,
      },
    });

    revalidatePath('/checklist');
    // also revalidate dashboard
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to update checklist progress:', error);
    return { success: false, error: 'Failed to update progress.' };
  }
} 