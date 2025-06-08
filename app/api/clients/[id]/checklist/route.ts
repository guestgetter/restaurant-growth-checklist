import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    
    const checklistItems = await prisma.checklistItem.findMany({
      where: { clientId },
      include: {
        section: true,
        subTasks: true
      },
      orderBy: {
        section: {
          id: 'asc'
        }
      }
    })
    
    return NextResponse.json({ success: true, checklistItems })
  } catch (error) {
    console.error('Error fetching checklist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch checklist' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id
    const { itemId, subtaskId, completed } = await request.json()
    
    if (subtaskId) {
      // Update subtask
      await prisma.checklistSubTask.update({
        where: { id: subtaskId },
        data: { completed }
      })
    } else {
      // Update main item
      await prisma.checklistItem.update({
        where: { id: itemId },
        data: { completed }
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating checklist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update checklist' },
      { status: 500 }
    )
  }
} 