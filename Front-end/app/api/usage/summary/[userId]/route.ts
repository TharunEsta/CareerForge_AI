import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userPlan = searchParams.get('user_plan') || 'free';
    
    // Mock usage data - in production this would come from a database
    const usageSummary = {
      user_id: params.userId,
      plan: userPlan,
      features: {
        ai_chats: {
          allowed: true,
          current_usage: 2,
          limit: userPlan === 'free' ? 5 : userPlan === 'plus' ? 100 : -1,
          remaining: userPlan === 'free' ? 3 : userPlan === 'plus' ? 98 : -1
        },
        ats_analysis: {
          allowed: true,
          current_usage: 1,
          limit: userPlan === 'free' ? 3 : userPlan === 'plus' ? 50 : -1,
          remaining: userPlan === 'free' ? 2 : userPlan === 'plus' ? 49 : -1
        },
        cover_letter_generation: {
          allowed: true,
          current_usage: 0,
          limit: userPlan === 'free' ? 2 : userPlan === 'plus' ? 25 : -1,
          remaining: userPlan === 'free' ? 2 : userPlan === 'plus' ? 25 : -1
        },
        resume_parsing: {
          allowed: userPlan !== 'free',
          current_usage: 0,
          limit: userPlan === 'free' ? 0 : userPlan === 'plus' ? 20 : -1,
          remaining: userPlan === 'free' ? 0 : userPlan === 'plus' ? 20 : -1
        },
        job_matching: {
          allowed: userPlan !== 'free',
          current_usage: 0,
          limit: userPlan === 'free' ? 0 : userPlan === 'plus' ? 30 : -1,
          remaining: userPlan === 'free' ? 0 : userPlan === 'plus' ? 30 : -1
        },
        linkedin_optimization: {
          allowed: userPlan !== 'free',
          current_usage: 0,
          limit: userPlan === 'free' ? 0 : userPlan === 'plus' ? 10 : -1,
          remaining: userPlan === 'free' ? 0 : userPlan === 'plus' ? 10 : -1
        },
        voice_assistant: {
          allowed: userPlan === 'pro',
          current_usage: 0,
          limit: userPlan === 'pro' ? -1 : 0,
          remaining: userPlan === 'pro' ? -1 : 0
        }
      }
    };

    return NextResponse.json(usageSummary);
  } catch (error) {
    console.error('Error fetching usage summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage summary' },
      { status: 500 }
    );
  }
} 