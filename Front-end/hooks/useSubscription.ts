<<<<<<< HEAD
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthContext';
import { User } from '@/types';

interface UsageInfo {
  current_usage: number;
  limit: number;
  remaining: number;
  allowed: boolean;
}

interface UsageSummary {
  user_id: string;
  plan: string;
  features: Record<string, {
    name: string;
    available: boolean;
    current_usage: number;
    limit: number;
    remaining: number;
    allowed: boolean;
  }>;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limits: {
    ai_chats: number;
    resume_parsing: number;
    job_matching: number;
  };
  popular?: boolean;
  selected?: boolean;
  yearlyPrice?: string;
  yearlySavings?: string;
  description?: string;
  buttonText?: string;
  icon?: React.ReactNode;
}

interface UserSubscription {
  userId: string;
  plan: string;
  status: string;
  currentUsage: {
    ai_chats: number;
    resume_parsing: number;
    job_matching: number;
  };
  nextBillingDate: string | null;
  createdAt: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Remove the problematic useEffect
    useEffect(() => {
      setCurrentPlan('free'); // Default to free plan
       }, []);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch(`/api/subscriptions?userId=${user?.id || 'anonymous'}`);
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans);
        setUserSubscription(data.userSubscription);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
=======
import { useState, useEffect } from 'react';
import { User } from '@/types';

export interface Subscription {
  id: string;
  plan: 'free' | 'plus' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export const useSubscription = (user: User | null) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock subscription data - replace with actual API call
        const mockSubscription: Subscription = {
          id: 'sub_123',
          plan: 'free',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
        };
        
        setSubscription(mockSubscription);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const cancelSubscription = async () => {
    if (!subscription) return;
    
    try {
      setLoading(true);
      // Mock API call to cancel subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscription(prev => prev ? {
        ...prev,
        cancelAtPeriodEnd: true
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const currentPlan = userSubscription?.plan || 'free';

  const canUseFeature = (feature: 'ai_chats' | 'resume_parsing' | 'job_matching'): boolean => {
    if (!userSubscription) return false;
    
    const plan = plans.find((p: SubscriptionPlan) => p.id === currentPlan);
    if (!plan) return false;

    const limit = plan.limits[feature];
    const usage = userSubscription.currentUsage[feature];

    // Unlimited features
    if (limit === -1) return true;

    return usage < limit;
  };

  const getCurrentUsage = (feature: 'ai_chats' | 'resume_parsing' | 'job_matching'): number => {
    return userSubscription?.currentUsage[feature] || 0;
  };

  const getLimit = (feature: 'ai_chats' | 'resume_parsing' | 'job_matching'): number => {
    const plan = plans.find((p: SubscriptionPlan) => p.id === currentPlan);
    return plan?.limits[feature] || 0;
  };

  const upgradePlan = async (planId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || 'anonymous',
          planId
        }),
      });

      if (response.ok) {
        await fetchSubscriptionData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      return false;
    }
  };

  // Fetch usage summary
  const fetchUsageSummary = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/usage/summary/${user.id}?user_plan=${currentPlan}`);
      if (response.ok) {
        const data = await response.json();
        setUsageSummary(data);
      } else {
        setError('Failed to fetch usage summary');
      }
    } catch (err) {
      setError('Error fetching usage summary');
      console.error('Error fetching usage summary:', err);
    }
  }, [user?.id, currentPlan]);

  // Check usage for a specific feature
  const checkUsage = useCallback(async (feature: string): Promise<UsageInfo | null> => {
    if (!user?.id) return null;

    try {
      const response = await fetch(`/api/usage/check/${user.id}/${feature}?user_plan=${currentPlan}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (err) {
      console.error('Error checking usage:', err);
      return null;
    }
  }, [user?.id, currentPlan]);

  // Track usage for a feature
  const trackUsage = useCallback(async (feature: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const response = await fetch('/api/usage/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          feature,
          user_plan: currentPlan,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Refresh usage summary
          await fetchUsageSummary();
          return true;
        } else {
          setError(result.message || 'Usage limit exceeded');
          return false;
        }
      }
      return false;
    } catch (err) {
      console.error('Error tracking usage:', err);
      return false;
    }
  }, [user?.id, currentPlan, fetchUsageSummary]);

  // Initialize subscription data
  useEffect(() => {
    if (user?.subscription?.plan) {
      // Plan is already set via currentPlan variable
    }
  }, [user?.subscription?.plan]);

  // Fetch usage summary when user or plan changes
  useEffect(() => {
    if (user?.id) {
      fetchUsageSummary();
    }
  }, [user?.id, currentPlan, fetchUsageSummary]);

  return {
    plans,
    userSubscription,
    currentPlan,
    loading,
    usageSummary,
    isLoading,
    error,
    canUseFeature,
    getCurrentUsage,
    getLimit,
    upgradePlan,
    fetchUsageSummary,
    checkUsage,
    trackUsage,
    refresh: fetchSubscriptionData,
    clearError: () => setError(null),
  };
} 
=======
  const reactivateSubscription = async () => {
    if (!subscription) return;
    
    try {
      setLoading(true);
      // Mock API call to reactivate subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscription(prev => prev ? {
        ...prev,
        cancelAtPeriodEnd: false
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate subscription');
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    loading,
    error,
    cancelSubscription,
    reactivateSubscription,
  };
}; 
>>>>>>> db48806bba7dc7d49b870a101db6c2e90a7d7be6
