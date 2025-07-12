'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

export default function PricingPage() {
  const { user } = useAuth();
  const { plans, currentPlan, upgradePlan, loading } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    setUpgrading(true);
    try {
      const success = await upgradePlan(planId);
      if (success) {
        setSelectedPlan(planId);
        // Show success message
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setUpgrading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Star className="w-6 h-6" />;
      case 'plus':
        return <Zap className="w-6 h-6" />;
      case 'pro':
        return <Crown className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'from-gray-600 to-gray-700';
      case 'plus':
        return 'from-blue-600 to-purple-600';
      case 'pro':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#18181b] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Unlock the full potential of your career with our AI-powered tools. 
            Choose the plan that fits your needs.
          </motion.p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border ${
                plan.id === currentPlan 
                  ? 'border-blue-500/50 ring-2 ring-blue-500/20' 
                  : 'border-gray-700 hover:border-gray-600'
              } transition-all duration-200`}
            >
              {/* Current Plan Badge */}
              {plan.id === currentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${getPlanColor(plan.id)} flex items-center justify-center text-white`}>
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-1">
                  ${plan.price}
                  <span className="text-lg text-gray-400 font-normal">/month</span>
                </div>
                <p className="text-gray-400 text-sm">
                  {plan.price === 0 ? 'Free forever' : 'Billed monthly'}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.id === currentPlan || upgrading}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  plan.id === currentPlan
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : plan.id === 'free'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : `bg-gradient-to-r ${getPlanColor(plan.id)} hover:scale-105 text-white shadow-lg`
                }`}
              >
                {plan.id === currentPlan 
                  ? 'Current Plan' 
                  : plan.id === 'free' 
                  ? 'Get Started' 
                  : upgrading 
                  ? 'Upgrading...' 
                  : 'Upgrade Now'
                }
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-400 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400 text-sm">
                We accept all major credit cards, PayPal, and Apple Pay for secure payments.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-400 text-sm">
                Yes, all paid plans come with a 7-day free trial. No credit card required.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-400 text-sm">
                Absolutely. You can cancel your subscription at any time with no questions asked.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
