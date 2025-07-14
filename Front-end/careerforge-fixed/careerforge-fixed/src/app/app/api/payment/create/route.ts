import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      currency,
      user_id,
      user_email,
      user_name,
      description,
      plan_id,
      billing_cycle,
      payment_method,
    } = body;
    if (!amount || !currency || !user_email) {
      return NextResponse.json(
        { error: 'Amount, currency, and user email are required' },
        { status: 400 }
      );
    // Forward to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        user_id: user_id,
        user_email: user_email,
        user_name: user_name,
        description: description,
        plan_id: plan_id,
        billing_cycle: billing_cycle || 'monthly',
        payment_method: payment_method || 'upi',
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Backend responded with status: ${response.status}`);
    const data = await response.json();
    return NextResponse.json({
      success: true,
      payment_url: data.payment_url,
      payment_id: data.payment_id,
      message: 'Payment created successfully',
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      {
        error: 'Failed to create payment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
