import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; feature: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userPlan = searchParams.get('user_plan') || 'free';
    
    // Mock usage check - in production this would check against a database
    const getFeatureLimit = (feature: string, plan: string) => {
      const limits = {
        free: {
          ai_chats: 5,
          ats_analysis: 3,
          cover_letter_generation: 2,
          resume_parsing: 0,
          job_matching: 0,
          linkedin_optimization: 0,
          voice_assistant: 0
        },
        plus: {
          ai_chats: 100,
          ats_analysis: 50,
          cover_letter_generation: 25,
          resume_parsing: 20,
          job_matching: 30,
          linkedin_optimization: 10,
          voice_assistant: 0
        },
        pro: {
          ai_chats: -1,
          ats_analysis: -1,
          cover_letter_generation: -1,
          resume_parsing: -1,
          job_matching: -1,
          linkedin_optimization: -1,
          voice_assistant: -1
        }
      };
      
      return limits[plan as keyof typeof limits]?.[feature as keyof typeof limits.free] || 0;
    };
    
    const limit = getFeatureLimit(params.feature, userPlan);
    const currentUsage = Math.floor(Math.random() * Math.max(1, limit / 2)); // Mock current usage
    
    const usageInfo = {
      allowed: limit === -1 || currentUsage < limit,
      current_usage: currentUsage,
      limit: limit,
      remaining: limit === -1 ? -1 : Math.max(0, limit - currentUsage),
      plan: userPlan
    };

    return NextResponse.json(usageInfo);
  } catch (error) {
    console.error('Error checking usage:', error);
    return NextResponse.json(
      { error: 'Failed to check usage' },
      { status: 500 }
    );
  }
} 