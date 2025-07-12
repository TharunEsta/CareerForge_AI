'use client';

import { useState, useEffect, useCallback } from 'react';
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
  price_monthly: number;
  price_yearly: number;
  description: string;
  features: Array<{
    name: string;
    description: string;
    available: boolean;
  }>;
  limits: Record<string, number>;
  popular: boolean;
  savings_percentage: number;
}

export function useSubscription() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [usageSummary, setUsageSummary] = useState<UsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription plans
  const fetchPlans = useCallback(async () => {
    try {
      const response = await fetch('/api/subscription/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        setError('Failed to fetch subscription plans');
      }
    } catch (err) {
      setError('Error fetching subscription plans');
      console.error('Error fetching plans:', err);
    }
  }, []);

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

  // Upgrade subscription
  const upgradeSubscription = useCallback(async (planId: string, billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    if (!user?.id) {
      setError('User not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId,
          userId: user.id,
          billing_cycle: billingCycle,
          user_email: user.email || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkoutUrl) {
          // Redirect to PayPal checkout
          window.location.href = data.checkoutUrl;
          return true;
        } else {
          // Plan updated successfully
          setCurrentPlan(planId);
          await fetchUsageSummary();
          return true;
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Upgrade failed');
        return false;
      }
    } catch (err) {
      setError('Upgrade failed. Please try again.');
      console.error('Error upgrading subscription:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.email, fetchUsageSummary]);

  // Check if user can use a feature
  const canUseFeature = useCallback((feature: string): boolean => {
    if (!usageSummary) return false;
    
    const featureInfo = usageSummary.features[feature];
    return featureInfo?.allowed || false;
  }, [usageSummary]);

  // Get remaining usage for a feature
  const getRemainingUsage = useCallback((feature: string): number => {
    if (!usageSummary) return 0;
    
    const featureInfo = usageSummary.features[feature];
    return featureInfo?.remaining || 0;
  }, [usageSummary]);

  // Get current usage for a feature
  const getCurrentUsage = useCallback((feature: string): number => {
    if (!usageSummary) return 0;
    
    const featureInfo = usageSummary.features[feature];
    return featureInfo?.current_usage || 0;
  }, [usageSummary]);

  // Get limit for a feature
  const getLimit = useCallback((feature: string): number => {
    if (!usageSummary) return 0;
    
    const featureInfo = usageSummary.features[feature];
    return featureInfo?.limit || 0;
  }, [usageSummary]);

  // Initialize subscription data
  useEffect(() => {
    if (user?.subscription?.plan) {
      setCurrentPlan(user.subscription.plan);
    }
  }, [user?.subscription?.plan]);

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Fetch usage summary when user or plan changes
  useEffect(() => {
    if (user?.id) {
      fetchUsageSummary();
    }
  }, [user?.id, currentPlan, fetchUsageSummary]);

  return {
    // State
    plans,
    currentPlan,
    usageSummary,
    isLoading,
    error,
    
    // Actions
    fetchPlans,
    fetchUsageSummary,
    checkUsage,
    trackUsage,
    upgradeSubscription,
    
    // Utility functions
    canUseFeature,
    getRemainingUsage,
    getCurrentUsage,
    getLimit,
    
    // Clear error
    clearError: () => setError(null),
  };
} 