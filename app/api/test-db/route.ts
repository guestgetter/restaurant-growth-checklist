import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test the database connection
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      result 
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 