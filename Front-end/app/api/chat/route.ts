import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, userId } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Simulate AI response with streaming
    const aiResponse = await generateAIResponse(prompt);
    
    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous'
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateAIResponse(prompt: string): Promise<string> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const responses = [
    `I understand you're asking about "${prompt}". Here's my professional advice: Always tailor your resume to the specific job description, use action verbs, and quantify your achievements with numbers when possible.`,
    `Great question about "${prompt}"! For career success, focus on continuous learning, networking, and building transferable skills. Consider getting certifications in your field to stand out.`,
    `Regarding "${prompt}", here's what I recommend: Build a strong online presence on LinkedIn, create a portfolio showcasing your work, and stay updated with industry trends.`,
    `For "${prompt}", my advice is to: 1) Research the company thoroughly, 2) Prepare specific examples of your achievements, 3) Practice common interview questions, 4) Follow up after interviews.`,
    `About "${prompt}": The key is to demonstrate value. Show how your skills solve problems, improve processes, or generate revenue. Use the STAR method in interviews.`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
} 
