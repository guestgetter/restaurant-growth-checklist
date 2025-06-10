import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Your original clients from the migration logs
const originalClients = [
  {
    id: 'koma-restaurant',
    name: 'KOMA Restaurant',
    type: 'fine-dining',
    industry: 'restaurant',
    location: { city: '', state: '', country: 'US' },
    accountManager: '',
    fulfillmentManager: '',
    onboardingDate: new Date().toISOString(),
    currentPhase: 'onboarding',
    dreamCaseStudyGoal: '',
    targetAudience: '',
    topCompetitors: [],
    monthlyRevenue: 0,
    averageOrderValue: 0,
    branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', fontFamily: 'Inter' },
    contact: { email: '', phone: '', address: '' },
    status: 'active'
  },
  {
    id: 'pizza-palace',
    name: 'Pizza Palace',
    type: 'casual-dining',
    industry: 'restaurant',
    location: { city: '', state: '', country: 'US' },
    accountManager: '',
    fulfillmentManager: '',
    onboardingDate: new Date().toISOString(),
    currentPhase: 'onboarding',
    dreamCaseStudyGoal: '',
    targetAudience: '',
    topCompetitors: [],
    monthlyRevenue: 0,
    averageOrderValue: 0,
    branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', fontFamily: 'Inter' },
    contact: { email: '', phone: '', address: '' },
    status: 'active'
  },
  {
    id: 'toboggan-brewing-company',
    name: 'Toboggan Brewing Company',
    type: 'brewery',
    industry: 'restaurant',
    location: { city: '', state: '', country: 'US' },
    accountManager: '',
    fulfillmentManager: '',
    onboardingDate: new Date().toISOString(),
    currentPhase: 'onboarding',
    dreamCaseStudyGoal: '',
    targetAudience: '',
    topCompetitors: [],
    monthlyRevenue: 0,
    averageOrderValue: 0,
    branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', fontFamily: 'Inter' },
    contact: { email: '', phone: '', address: '' },
    status: 'active'
  }
]

async function restoreClients() {
  try {
    console.log('🔄 Restoring your original clients...')
    
    for (const client of originalClients) {
      await prisma.client.upsert({
        where: { id: client.id },
        update: client,
        create: client
      })
      console.log(`✅ Restored: ${client.name}`)
    }
    
    console.log('🎉 All clients restored to database!')
    console.log('📝 You may need to refresh your browser to see them in the UI')
  } catch (error) {
    console.error('❌ Restore failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

restoreClients() 