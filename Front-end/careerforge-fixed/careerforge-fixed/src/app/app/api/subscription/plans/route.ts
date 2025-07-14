import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price_monthly: 0.0,
        price_yearly: 0.0,
        description: 'Perfect for getting started',
        features: [
          { name: 'AI Chats', available: true },
          { name: 'ATS Analysis', available: true },
          { name: 'Cover Letter Generation', available: true },
        ],
        limits: {
          ai_chats_per_month: 5,
          ats_analyses_per_month: 3,
          cover_letters_per_month: 2,
          resume_parses_per_month: 0,
          job_matches_per_month: 0,
          linkedin_optimizations_per_month: 0,
          voice_assistant_calls_per_month: 0,
          pwa_access: 0,
        },
        popular: false,
        savings_percentage: 0,
      },
      {
        id: 'plus',
        name: 'Plus',
        price_monthly: 19.0,
        price_yearly: 190.0,
        description: 'Great for active job seekers',
        features: [
          { name: 'AI Chats', available: true },
          { name: 'ATS Analysis', available: true },
          { name: 'Cover Letter Generation', available: true },
          { name: 'Resume Parsing', available: true },
          { name: 'Job Matching', available: true },
          { name: 'LinkedIn Optimization', available: true },
        ],
        limits: {
          ai_chats_per_month: 100,
          ats_analyses_per_month: 50,
          cover_letters_per_month: 25,
          resume_parses_per_month: 20,
          job_matches_per_month: 30,
          linkedin_optimizations_per_month: 10,
          voice_assistant_calls_per_month: 0,
          pwa_access: 0,
        },
        popular: true,
        savings_percentage: 17,
      },
      {
        id: 'pro',
        name: 'Pro',
        price_monthly: 49.0,
        price_yearly: 490.0,
        description: 'For power users and professionals',
        features: [
          { name: 'AI Chats', available: true },
          { name: 'ATS Analysis', available: true },
          { name: 'Cover Letter Generation', available: true },
          { name: 'Resume Parsing', available: true },
          { name: 'Job Matching', available: true },
          { name: 'LinkedIn Optimization', available: true },
          { name: 'Voice Assistant', available: true },
          { name: 'Unlimited Usage', available: true },
          { name: 'Priority Support', available: true },
          { name: 'PWA Access', available: true },
        ],
        limits: {
          ai_chats_per_month: -1,
          ats_analyses_per_month: -1,
          cover_letters_per_month: -1,
          resume_parses_per_month: -1,
          job_matches_per_month: -1,
          linkedin_optimizations_per_month: -1,
          voice_assistant_calls_per_month: -1,
          pwa_access: 1,
        },
        popular: false,
        savings_percentage: 17,
      },
    ];
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription plans' }, { status: 500 });
