import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, feature, userPlan = 'free' } = body;
    if (!userId || !feature) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and feature' },
        { status: 400 }
      );
    // Mock usage tracking - in production this would update a database
    const getFeatureLimit = (feature: string, plan: string) => {
      const limits = {
        free: {
          ai_chats: 5,
          ats_analysis: 3,
          cover_letter_generation: 2,
          resume_parsing: 0,
          job_matching: 0,
          linkedin_optimization: 0,
          voice_assistant: 0,
        },
        plus: {
          ai_chats: 100,
          ats_analysis: 50,
          cover_letter_generation: 25,
          resume_parsing: 20,
          job_matching: 30,
          linkedin_optimization: 10,
          voice_assistant: 0,
        },
        pro: {
          ai_chats: -1,
          ats_analysis: -1,
          cover_letter_generation: -1,
          resume_parsing: -1,
          job_matching: -1,
          linkedin_optimization: -1,
          voice_assistant: -1,
        },
      };
      return limits[plan as keyof typeof limits]?.[feature as keyof typeof limits.free] || 0;
    };
    const limit = getFeatureLimit(feature, userPlan);
    // Mock current usage - in production this would be fetched from database
    const currentUsage = Math.floor(Math.random() * Math.max(1, limit / 2));
    const newUsage = currentUsage + 1;
    const allowed = limit === -1 || newUsage <= limit;
    const response = {
      success: allowed,
      current_usage: newUsage,
      limit: limit,
      remaining: limit === -1 ? -1 : Math.max(0, limit - newUsage),
      plan: userPlan,
      feature: feature,
    };
    if (!allowed) {
      response.success = false;
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error tracking usage:', error);
    return NextResponse.json({ error: 'Failed to track usage' }, { status: 500 });
