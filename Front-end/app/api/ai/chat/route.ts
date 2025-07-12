import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Mock AI response - in production this would call an actual AI service
    const responses = [
      "I'd be happy to help you with that! Let me analyze your request and provide some personalized suggestions.",
      "That's a great question! Based on your situation, I recommend focusing on highlighting your most relevant achievements.",
      "I can help you optimize your resume for that specific role. Would you like me to analyze your current resume first?",
      "For interview preparation, I suggest practicing common questions and preparing specific examples from your experience.",
      "Let me help you identify the key skills and keywords that would make your application stand out for this position.",
      "I can assist you with creating a compelling cover letter that matches the job requirements and your background.",
      "Based on your experience, I'd recommend emphasizing your technical skills and quantifiable achievements.",
      "For networking, I suggest reaching out to professionals in your target companies and attending industry events.",
      "I can help you prepare for behavioral questions by using the STAR method to structure your responses.",
      "Let's work on making your resume more ATS-friendly by incorporating relevant keywords and optimizing the format."
    ];
    
    // Select a response based on the message content
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Add some context-aware responses
    if (message.toLowerCase().includes('resume')) {
      response = "I can help you optimize your resume! Let me analyze it for ATS compatibility and suggest improvements to make it stand out to recruiters.";
    } else if (message.toLowerCase().includes('interview')) {
      response = "Great! For interview preparation, I recommend practicing common questions, preparing specific examples from your experience, and researching the company thoroughly.";
    } else if (message.toLowerCase().includes('cover letter')) {
      response = "I'd be happy to help you write a compelling cover letter! Let me know the specific job and company, and I'll help you tailor it perfectly.";
    } else if (message.toLowerCase().includes('job')) {
      response = "I can help you find relevant job opportunities and optimize your application materials for specific positions. What type of role are you targeting?";
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({
      response: response,
      userId: userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
