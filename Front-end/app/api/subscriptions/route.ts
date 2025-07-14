import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';

    // Mock subscription plans
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'USD',
        interval: 'month',
        features: [
          '5 AI chats per month',
          'Basic resume analysis',
          'Community support',
          'Standard response time'
        ],
        limits: {
          ai_chats: 5,
          resume_parsing: 1,
          job_matching: 1
        }
      },
      {
        id: 'plus',
        name: 'Plus',
        price: 19,
        currency: 'USD',
        interval: 'month',
        features: [
          '100 AI chats per month',
          'Advanced resume analysis',
          'Job matching',
          'Priority support',
          'Faster response time'
        ],
        limits: {
          ai_chats: 100,
          resume_parsing: 10,
          job_matching: 10
        }
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 49,
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited AI chats',
          'Unlimited resume analysis',
          'Unlimited job matching',
          'Premium support',
          'Fastest response time',
          'Advanced analytics'
        ],
        limits: {
          ai_chats: -1, // Unlimited
          resume_parsing: -1, // Unlimited
          job_matching: -1 // Unlimited
        }
      }
    ];

    // Mock user subscription status
    const userSubscription = {
      userId: userId,
      plan: 'free',
      status: 'active',
      currentUsage: {
        ai_chats: 2,
        resume_parsing: 0,
        job_matching: 0
      },
      nextBillingDate: null,
      createdAt: '2024-01-01T00:00:00Z'
    };

    return NextResponse.json({
      plans,
      userSubscription,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Subscriptions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, planId } = await request.json();

    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'User ID and plan ID are required' },
        { status: 400 }
      );
    }

    // Mock subscription upgrade
    const updatedSubscription = {
      userId: userId,
      plan: planId,
      status: 'active',
      currentUsage: {
        ai_chats: 0,
        resume_parsing: 0,
        job_matching: 0
      },
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      message: `Successfully upgraded to ${planId} plan`
    });

  } catch (error) {
    console.error('Subscription upgrade error:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade subscription' },
      { status: 500 }
    );
  }
} 
