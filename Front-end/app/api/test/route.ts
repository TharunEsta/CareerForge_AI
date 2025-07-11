import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'success',
      message: 'API endpoint is working correctly!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Test API endpoint failed',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: 'success',
      message: 'POST request received successfully!',
      data: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test API POST Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'POST request failed',
      },
      { status: 500 }
    );
  }
}
