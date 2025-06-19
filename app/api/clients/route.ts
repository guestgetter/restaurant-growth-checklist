import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { DatabaseService } from '../../../lib/db/database-service';
import { validateClientCreate, checkRateLimit, createErrorResponse } from '../../../lib/validation';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Authentication required', 401);
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`get-clients-${clientIp}`, 50, 60000)) {
      return createErrorResponse('Rate limit exceeded', 429);
    }

    const clients = await DatabaseService.getClients(session.user.id);
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Authentication required', 401);
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`create-client-${clientIp}`, 20, 60000)) {
      return createErrorResponse('Rate limit exceeded', 429);
    }

    console.log('🔄 API: Creating client...');
    
    let clientData;
    try {
      const rawData = await request.json();
      clientData = validateClientCreate(rawData);
    } catch (validationError) {
      console.error('❌ API: Validation failed:', validationError);
      return createErrorResponse(`Invalid input: ${(validationError as Error).message}`, 400);
    }
    
    console.log('🔍 API: Received validated client data:', clientData);
    
    // Convert UI Client to DatabaseClient format
    const dbClientData = {
      id: clientData.id || `client_${Date.now()}`, // Ensure ID is always present
      name: clientData.name,
      type: clientData.type || 'quick-service',
      industry: clientData.industry,
      logo: clientData.logo,
      location: clientData.location || { city: '', state: '', country: 'US' },
      accountManager: clientData.accountManager || '',
      fulfillmentManager: clientData.fulfillmentManager || '',
      onboardingDate: clientData.onboardingDate || new Date().toISOString(),
      currentPhase: clientData.currentPhase || 'onboarding',
      googleAdsCustomerId: clientData.googleAdsCustomerId,
      metaAdsAccountId: clientData.metaAdsAccountId,
      dreamCaseStudyGoal: clientData.dreamCaseStudyGoal || '',
      targetAudience: clientData.targetAudience || '',
      topCompetitors: clientData.topCompetitors || [],
      monthlyRevenue: clientData.monthlyRevenue || 0,
      averageOrderValue: clientData.averageOrderValue || 0,
      branding: clientData.branding,
      contact: clientData.contact,
      userId: session.user.id,
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