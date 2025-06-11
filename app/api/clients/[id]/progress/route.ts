import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../../../lib/db/database-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
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
    const clientId = params.id;
    const { completedItems, completedSubtasks } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(completedItems) || !Array.isArray(completedSubtasks)) {
      return NextResponse.json(
        { error: 'completedItems and completedSubtasks must be arrays' },
        { status: 400 }
      );
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