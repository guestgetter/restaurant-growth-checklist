import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDatabase() {
  try {
    console.log('🗑️ Cleaning up database...')
    
    // Delete all client progress first (due to foreign key constraints)
    const progressDeleted = await prisma.clientProgress.deleteMany({})
    console.log(`✅ Deleted ${progressDeleted.count} progress records`)
    
    // Delete all clients
    const clientsDeleted = await prisma.client.deleteMany({})
    console.log(`✅ Deleted ${clientsDeleted.count} clients`)
    
    console.log('🎉 Database cleanup complete!')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDatabase() 