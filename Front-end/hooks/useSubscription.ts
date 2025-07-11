'use client';

import { useState } from 'react';

interface SubscriptionHook {
  currentPlan: string;
  usageSummary: any;
  trackUsage: (feature: string) => Promise<boolean>;
  canUseFeature: (feature: string) => boolean;
  getRemainingUsage: (feature: string) => number;
  getCurrentUsage: (feature: string) => number;
  getLimit: (feature: string) => number;
  upgradeSubscription: (planId: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useSubscription(): SubscriptionHook {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    currentPlan: 'free',
    usageSummary: { ai_chats: { used: 2, limit: 10 } },
    trackUsage: async (feature: string) => {
      // Stub implementation
      return true;
    },
    canUseFeature: (feature: string) => {
      // For demo purposes, allow all features
      return true;
    },
    getRemainingUsage: (feature: string) => 8,
    getCurrentUsage: (feature: string) => 2,
    getLimit: (feature: string) => 10,
    upgradeSubscription: async (planId: string) => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      return true;
    },
    isLoading,
    error,
  };
}
