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
    } finally {
      setLoading(false);
    }
  };

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