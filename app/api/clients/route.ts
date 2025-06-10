import { NextResponse } from 'next/server';
import { DatabaseService } from '../../../lib/db/database-service';

export async function POST(request: Request) {
  try {
    console.log('🔄 API: Creating client...');
    
    const clientData = await request.json();
    console.log('🔍 API: Received client data:', clientData);
    
    // Convert UI Client to DatabaseClient format
    const dbClientData = {
      id: clientData.id, // 🔧 FIX: Include the ID from localStorage
      name: clientData.name,
      type: 'quick-service' as const,
      industry: clientData.industry,
      logo: clientData.logo,
      location: { city: '', state: '', country: 'US' },
      accountManager: '',
      fulfillmentManager: '',
      onboardingDate: new Date().toISOString(),
      currentPhase: 'onboarding' as const,
      googleAdsCustomerId: clientData.googleAdsCustomerId,
      metaAdsAccountId: clientData.metaAdsAccountId,
      dreamCaseStudyGoal: '',
      targetAudience: '',
      topCompetitors: [],
      monthlyRevenue: 0,
      averageOrderValue: 0,
      branding: clientData.branding,
      contact: clientData.contact,
    };
    
    console.log('🔍 API: Calling DatabaseService.createClient...');
    const result = await DatabaseService.createClient(dbClientData);
    console.log('✅ API: Client created successfully:', result);
    
    return NextResponse.json({
      success: true,
      client: result,
      message: 'Client created successfully'
    });
  } catch (error) {
    console.error('❌ API: Failed to create client:', error);
    
    return NextResponse.json({
      success: false,
      error: (error as any)?.message || 'Unknown error',
      code: (error as any)?.code,
    }, { status: 500 });
  }
} 