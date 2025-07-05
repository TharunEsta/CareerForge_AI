import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription, companyName, position } = await request.json();

    if (!resumeText || !jobDescription || !companyName || !position) {
      return NextResponse.json(
        { error: 'All fields are required: resumeText, jobDescription, companyName, position' },
        { status: 400 }
      );
    }

    const result = await AIService.generateCoverLetter(resumeText, jobDescription, companyName, position);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cover Letter API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
} 