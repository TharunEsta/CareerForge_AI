import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { plan, billing_cycle, user_id } = await request.json();

    // Mock PayPal API call
    const paypalResponse = await fetch('https://api-m.sandbox.paypal.com/v1/billing/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        product_id: 'PROD-123456789',
        name: plan,
        billing_cycles: [
          {
            frequency: {
              interval_unit: billing_cycle === 'monthly' ? 'MONTH' : 'YEAR',
              interval_count: 1,
            },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: plan === 'plus' ? '9.99' : '19.99',
                currency_code: 'USD',
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee: {
            value: '0',
            currency_code: 'USD',
          },
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3,
        },
      }),
    });

    if (!paypalResponse.ok) {
      throw new Error('Failed to create PayPal subscription plan');
    }

    const paypalData = await paypalResponse.json();

    // Mock response for development
    const response = {
      success: true,
      plan,
      plan_name: plan,
      billing_cycle: billing_cycle,
      user_id: user_id,
      message: 'Subscription upgrade initiated',
      checkoutUrl: `https://checkout.paypal.com/mock-checkout?plan=${plan}&cycle=${billing_cycle}`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Subscription upgrade error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upgrade subscription' },
      { status: 500 }
    );
  }
} 