import { NextResponse } from 'next/server';
import { DatabaseService } from '../../../../lib/db/database-service';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 API: Deleting client:', params.id);
    
    await DatabaseService.deleteClient(params.id);
    console.log('✅ API: Client deleted successfully:', params.id);
    
    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('❌ API: Failed to delete client:', error);
    
    return NextResponse.json({
      success: false,
      error: (error as any)?.message || 'Unknown error',
      code: (error as any)?.code,
    }, { status: 500 });
  }
} 