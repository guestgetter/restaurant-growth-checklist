'use server';

import { getServerSession } from 'next-auth/next';
import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/prisma';
import { authOptions } from './api/auth/[...nextauth]/route';

export async function updateChecklistProgress(
  subAccountId: string,
  progress: { [key: string]: string[] }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('You must be logged in to update checklist progress.');
  }

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