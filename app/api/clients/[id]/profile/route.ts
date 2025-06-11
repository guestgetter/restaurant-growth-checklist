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
    const clientId = params.id;
    const profileData = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile data is required' },
        { status: 400 }
      );
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