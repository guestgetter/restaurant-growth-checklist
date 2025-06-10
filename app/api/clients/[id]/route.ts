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
    console.log('🔍 API: Update data received:', updateData);
    
    const updatedClient = await DatabaseService.updateClient(params.id, updateData);
    
    if (!updatedClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }
    
    console.log('✅ API: Client updated successfully:', params.id);
    return NextResponse.json({ success: true, client: updatedClient });
  } catch (error) {
    console.error('❌ API: Failed to update client:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
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