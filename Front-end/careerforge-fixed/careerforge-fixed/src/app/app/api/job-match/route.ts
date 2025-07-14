import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skills, experience, jobDescription } = body;
    if (!skills && !experience) {
      return NextResponse.json({ error: 'Skills or experience data is required' }, { status: 400 });
    // Forward to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/job_match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skills: skills || [],
        experience: experience || [],
        job_description: jobDescription || '',
        top_n: 5,
      }),
    });
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    const data = await response.json();
    return NextResponse.json({
      success: true,
      jobs: data.jobs || data.matches || [],
      message: 'Job matches found successfully',
    });
  } catch (error) {
    console.error('Error matching jobs:', error);
    return NextResponse.json({ error: 'Failed to find job matches' }, { status: 500 });
