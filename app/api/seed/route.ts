import { NextResponse } from 'next/server'
import { seedChecklistData, initializeClientChecklist } from '@/lib/seed-checklist'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // First seed the checklist sections
    await seedChecklistData()
    
    // Create a demo client if none exist
    const existingClients = await prisma.client.count()
    
    if (existingClients === 0) {
      const demoClient = await prisma.client.create({
        data: {
          name: "Demo Restaurant",
          logo: "/api/placeholder/40/40"
        }
      })
      
      // Initialize checklist for demo client
      await initializeClientChecklist(demoClient.id)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully' 
    })
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 