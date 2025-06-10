import { NextResponse } from 'next/server';
import { DatabaseService } from '../../../../lib/db/database-service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await DatabaseService.getClient(params.id);
    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
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
    console.log('🔄 API: Updating client:', params.id);
    const updateData = await request.json();
    console.log('🔍 API: Update data received:', JSON.stringify(updateData, null, 2));
    console.log('🔍 API: About to call DatabaseService.updateClient');
    
    const updatedClient = await DatabaseService.updateClient(params.id, updateData);
    console.log('🔍 API: DatabaseService.updateClient completed');
    
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
    await DatabaseService.deleteClient(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 