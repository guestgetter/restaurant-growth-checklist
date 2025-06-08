import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        checklistItems: {
          include: {
            section: true,
            subTasks: true
          }
        }
      }
    })
    
    return NextResponse.json({ success: true, clients })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, logo, googleAdsCustomerId, metaAdsAccountId } = await request.json()
    
    const client = await prisma.client.create({
      data: {
        name,
        logo,
        googleAdsCustomerId,
        metaAdsAccountId
      }
    })
    
    return NextResponse.json({ success: true, client })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    )
  }
} 