import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Simple database test
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // Try to get client count
    const clientCount = await prisma.client.count()
    
    console.log('✅ Database test successful')
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      testQuery: result,
      clientCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: (error as any)?.message || 'Unknown error',
      code: (error as any)?.code,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 