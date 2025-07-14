import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';
export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();
    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      );
    const result = await AIService.analyzeATSCompatibility(resumeText, jobDescription);
    return NextResponse.json(result);
  } catch (error) {
    console.error('ATS Analysis API Error:', error);
    return NextResponse.json({ error: 'Failed to analyze ATS compatibility' }, { status: 500 });
