import { prisma } from './prisma'
import { checklistData } from '@/app/data/checklist-data'

export async function seedChecklistData() {
  try {
    // First, ensure sections exist
    for (const section of checklistData) {
      await prisma.checklistSection.upsert({
        where: { id: section.id },
        update: {
          title: section.title,
          emoji: section.emoji,
          description: section.description
        },
        create: {
          id: section.id,
          title: section.title,
          emoji: section.emoji,
          description: section.description
        }
      })
    }

    console.log('Checklist sections seeded successfully')
  } catch (error) {
    console.error('Error seeding checklist data:', error)
    throw error
  }
}

export async function initializeClientChecklist(clientId: string) {
  try {
    // Create checklist items for the client based on the master checklist
    for (const section of checklistData) {
      for (const item of section.items) {
        const checklistItem = await prisma.checklistItem.create({
          data: {
            originalId: item.id,
            text: item.text,
            description: item.description,
            completed: false,
            clientId,
            sectionId: section.id
          }
        })

        // Create subtasks if they exist
        if (item.subTasks) {
          for (const subtask of item.subTasks) {
            await prisma.checklistSubTask.create({
              data: {
                originalId: subtask.id,
                text: subtask.text,
                completed: false,
                checklistItemId: checklistItem.id
              }
            })
          }
        }
      }
    }

    console.log(`Checklist initialized for client ${clientId}`)
  } catch (error) {
    console.error('Error initializing client checklist:', error)
    throw error
  }
} 