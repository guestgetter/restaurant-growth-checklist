import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envStatus = {
      META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
      META_APP_ID: !!process.env.META_APP_ID,
      META_APP_SECRET: !!process.env.META_APP_SECRET,
      GOOGLE_ADS_CUSTOMER_ID: !!process.env.GOOGLE_ADS_CUSTOMER_ID,
      GOOGLE_ADS_DEVELOPER_TOKEN: !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    };

    return NextResponse.json(envStatus);
  } catch (error) {
    console.error('Error checking environment variables:', error);
    return NextResponse.json({ error: 'Failed to check environment variables' }, { status: 500 });
  }
} 