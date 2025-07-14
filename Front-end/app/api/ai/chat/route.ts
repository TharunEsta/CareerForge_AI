import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  let body: any = {};
  
  try {
    body = await request.json();
    const { message, userId } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Forward request to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/gpt-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        userId: userId || 'anonymous'
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      response: data.response || data.message || "I'm here to help with your career questions!",
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    
    // Fallback response if backend is unavailable
    const fallbackResponses = [
      "I'd be happy to help you with that! Let me analyze your request and provide some personalized suggestions.",
      "That's a great question! Based on your situation, I recommend focusing on highlighting your most relevant achievements.",
      "I can help you optimize your resume for that specific role. Would you like me to analyze your current resume first?",
      "For interview preparation, I suggest practicing common questions and preparing specific examples from your experience.",
      "Let me help you identify the key skills and keywords that would make your application stand out for this position."
    ];
    
    return NextResponse.json({
      response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      userId: body?.userId || 'anonymous',
      timestamp: new Date().toISOString()
    });
  }
}

