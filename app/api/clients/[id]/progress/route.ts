import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth';
import { DatabaseService } from '../../../../../lib/db/database-service';
import { validateClientId, validateClientProgress, checkRateLimit, createErrorResponse } from '../../../../../lib/validation';

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
    if (!checkRateLimit(`get-progress-${clientIp}`, 100, 60000)) {
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

    const progress = await DatabaseService.getClientProgress(clientId);
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error getting client progress:', error);
    return NextResponse.json(
      { error: 'Failed to get progress' },
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
    if (!checkRateLimit(`update-progress-${clientIp}`, 50, 60000)) {
      return createErrorResponse('Rate limit exceeded', 429);
    }

    let progressData;
    try {
      const rawData = await request.json();
      progressData = validateClientProgress(rawData);
    } catch (validationError) {
      console.error('❌ API: Validation failed:', validationError);
      return createErrorResponse(`Invalid input: ${(validationError as Error).message}`, 400);
    }

    const { completedItems, completedSubtasks } = progressData;

    // Check if user has access to this client
    const client = await DatabaseService.getClient(clientId);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    if (client.userId && client.userId !== session.user.id) {
      return createErrorResponse('Access denied', 403);
    }

    await DatabaseService.saveClientProgress(clientId, completedItems, completedSubtasks);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Progress saved successfully' 
    });
  } catch (error) {
    console.error('Error saving client progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
} 