import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { DatabaseService } from '../../../../lib/db/database-service';
import { validateClientId, validateClientUpdate, checkRateLimit, createErrorResponse } from '../../../../lib/validation';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Authentication required', 401);
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`get-client-${clientIp}`, 100, 60000)) {
      return createErrorResponse('Rate limit exceeded', 429);
    }

    // Validate client ID
    if (!validateClientId(params.id)) {
      return createErrorResponse('Invalid client ID format', 400);
    }

    const client = await DatabaseService.getClient(params.id);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Check if user has access to this client
    if (client.userId && client.userId !== session.user.id) {
      return createErrorResponse('Access denied', 403);
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Authentication required', 401);
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`update-client-${clientIp}`, 30, 60000)) {
      return createErrorResponse('Rate limit exceeded', 429);
    }

    // Validate client ID
    if (!validateClientId(params.id)) {
      return createErrorResponse('Invalid client ID format', 400);
    }

    console.log('🔄 API: Updating client:', params.id);

    let updateData;
    try {
      const rawData = await request.json();
      updateData = validateClientUpdate(rawData);
    } catch (validationError) {
      console.error('❌ API: Validation failed:', validationError);
      return createErrorResponse(`Invalid input: ${(validationError as Error).message}`, 400);
    }

    console.log('🔍 API: Update data received:', JSON.stringify(updateData, null, 2));
    console.log('🔍 API: About to call DatabaseService.updateClientInDatabase');
    
    // Check if user has access to this client
    const existingClient = await DatabaseService.getClient(params.id);
    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    if (existingClient.userId && existingClient.userId !== session.user.id) {
      return createErrorResponse('Access denied', 403);
    }
    
    const updatedClient = await DatabaseService.updateClientInDatabase(params.id, updateData);
    console.log('🔍 API: DatabaseService.updateClientInDatabase completed');
    
    if (!updatedClient) {
      console.log('❌ API: updatedClient is null/undefined');
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    
    console.log('✅ API: Client updated successfully:', params.id);
    return NextResponse.json({ success: true, client: updatedClient });
  } catch (error) {
    console.error('❌ API: Failed to update client - DETAILED ERROR:');
    console.error('❌ API: Error message:', (error as Error).message);
    console.error('❌ API: Error stack:', (error as Error).stack);
    console.error('❌ API: Full error object:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update client', 
        details: (error as Error).message,
        clientId: params.id
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createErrorResponse('Authentication required', 401);
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`delete-client-${clientIp}`, 10, 60000)) {
      return createErrorResponse('Rate limit exceeded', 429);
    }

    // Validate client ID
    if (!validateClientId(params.id)) {
      return createErrorResponse('Invalid client ID format', 400);
    }

    // Check if user has access to this client
    const existingClient = await DatabaseService.getClient(params.id);
    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    if (existingClient.userId && existingClient.userId !== session.user.id) {
      return createErrorResponse('Access denied', 403);
    }

    await DatabaseService.deleteClient(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 