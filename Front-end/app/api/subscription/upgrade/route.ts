import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, userId, billing_cycle = 'monthly', user_email } = body;
    
    if (!plan || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: plan and userId' },
        { status: 400 }
      );
    }
    
    // Mock subscription upgrade - in production this would integrate with a payment processor
    const plans = {
      free: { price: 0, name: 'Free' },
      plus: { price: billing_cycle === 'monthly' ? 19 : 190, name: 'Plus' },
      pro: { price: billing_cycle === 'monthly' ? 49 : 490, name: 'Pro' }
    };
    
    const selectedPlan = plans[plan as keyof typeof plans];
    
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }
    
    // Mock successful upgrade
    const response = {
      success: true,
      plan: plan,
      plan_name: selectedPlan.name,
      billing_cycle: billing_cycle,
      user_id: userId,
      message: `Successfully upgraded to ${selectedPlan.name} plan`
    };
    
    // If it's a paid plan, return checkout URL (mock)
    if (plan !== 'free') {
      response.checkoutUrl = `https://checkout.paypal.com/mock-checkout?plan=${plan}&cycle=${billing_cycle}`;
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade subscription' },
      { status: 500 }
    );
  }
} 