import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { DatabaseService } from '../../../../../lib/db/database-service';
import { validateClientId, validateClientProfile, checkRateLimit, createErrorResponse } from '../../../../../lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Authentication required', 401);
    }

    const clientId = params.id;

    if (!clientId || !validateClientId(clientId)) {
      return createErrorResponse('Invalid client ID', 400);
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`get-profile-${clientIp}`, 100, 60000)) {
      return createErrorResponse('Rate limit exceeded', 429);
    }

    // Check if user has access to this client
    const client = await DatabaseService.getClient(clientId);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    if (client.userId && client.userId !== session.user.id) {
      return createErrorResponse('Access denied', 403);
    }

    const profile = await DatabaseService.getClientProfile(clientId);
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error getting client profile:', error);
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Authentication required', 401);
    }

    const clientId = params.id;

    if (!clientId || !validateClientId(clientId)) {
      return createErrorResponse('Invalid client ID', 400);
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`update-profile-${clientIp}`, 30, 60000)) {
      return createErrorResponse('Rate limit exceeded', 429);
    }

    let profileData;
    try {
      const rawData = await request.json();
      profileData = validateClientProfile(rawData);
    } catch (validationError) {
      console.error('❌ API: Validation failed:', validationError);
      return createErrorResponse(`Invalid input: ${(validationError as Error).message}`, 400);
    }

    // Check if user has access to this client
    const client = await DatabaseService.getClient(clientId);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    if (client.userId && client.userId !== session.user.id) {
      return createErrorResponse('Access denied', 403);
    }

    await DatabaseService.saveClientProfile(clientId, profileData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile saved successfully' 
    });
  } catch (error) {
    console.error('Error saving client profile:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
} 