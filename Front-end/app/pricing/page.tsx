'use client';

import React from 'react';
import SubscriptionCards from '@/components/ui/SubscriptionCards';
import { useAuth } from '@/components/AuthContext';
import { User } from '@/types';

export default function PricingPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planId,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkoutUrl) {
          // Redirect to Stripe checkout
          window.location.href = data.checkoutUrl;
        } else {
          alert('Upgrade successful!');
          window.location.reload();
        }
      } else {
        const error = await response.json();
        alert(`Upgrade failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Upgrade failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered career optimization. 
            Start free and upgrade as you grow.
          </p>
        </div>

        {/* Current Plan Info */}
        {user && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Current Plan: {user.subscription?.plan?.toUpperCase() || 'FREE'}
              </h3>
              {user.subscription?.plan !== 'free' && (
                <p className="text-gray-400 text-sm">
                  Next billing: {user.subscription?.nextBillingDate || 'N/A'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Subscription Cards */}
        <SubscriptionCards
          currentPlan={user?.subscription?.plan || 'free'}
          onUpgrade={handleUpgrade}
          isLoading={isLoading}
        />

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-300">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-300">
                We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through Stripe.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Is there a free trial?
              </h3>
              <p className="text-gray-300">
                Yes! All paid plans include a 7-day free trial. You can upgrade or cancel at any time during the trial period.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                What's included in the free plan?
              </h3>
              <p className="text-gray-300">
                The free plan includes 5 AI chats per month, basic ATS analysis, and community support. Perfect for getting started!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a custom plan?
            </h3>
            <p className="text-gray-300 mb-6">
              We offer custom enterprise solutions for teams and organizations. 
              Get in touch to discuss your specific needs.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
