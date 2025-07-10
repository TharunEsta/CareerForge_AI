'use client';

import React from 'react';
import { Button } from './button';
import { Check, Crown, Zap, Star } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  yearlyPrice?: string;
  yearlySavings?: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  selected?: boolean;
  icon: React.ReactNode;
  description: string;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'forever',
    features: [
      '5 AI chats per month',
      'Basic ATS analysis',
      'Basic cover letter generator',
      'Community support'
    ],
    buttonText: 'Current Plan',
    selected: true,
    icon: <Star className="w-5 h-5" />
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$19',
    yearlyPrice: '$190',
    yearlySavings: '2 months free!',
    description: 'month',
    features: [
      'Resume parsing',
      'ATS analysis',
      'Cover letter generation',
      'AI chat (GPT-powered)',
      'Job matching',
      'LinkedIn optimization (basic)'
    ],
    buttonText: 'Upgrade to Plus',
    popular: true,
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49',
    yearlyPrice: '$490',
    yearlySavings: 'Save $98 annually!',
    description: 'month',
    features: [
      'All Plus features',
      'Voice Assistant 🎙️',
      'Unlimited usage (no monthly cap)',
      'Priority support',
      'Access to PWA (Install App)'
    ],
    buttonText: 'Go Pro',
    icon: <Crown className="w-5 h-5" />
  }
];

interface SubscriptionCardsProps {
  currentPlan?: string;
  onUpgrade?: (planId: string) => void;
  isLoading?: boolean;
}

export default function SubscriptionCards({ 
  currentPlan = 'free', 
  onUpgrade,
  isLoading = false 
}: SubscriptionCardsProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = (planId: string) => {
    if (onUpgrade) {
      onUpgrade(planId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPlan === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPlan === 'yearly'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
              Save
            </span>
          </button>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-gray-900/80 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
              plan.popular
                ? 'border-blue-500/50 shadow-lg shadow-blue-500/20'
                : 'border-gray-700/50'
            } ${plan.selected ? 'ring-2 ring-blue-500/50' : ''}`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="text-blue-400 mr-2">{plan.icon}</div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              </div>
              
              <div className="mb-2">
                <span className="text-3xl font-bold text-white">
                  {selectedPlan === 'yearly' && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                </span>
                <span className="text-gray-400 ml-1">
                  {selectedPlan === 'yearly' ? '/ year' : `/${plan.description}`}
                </span>
              </div>

              {selectedPlan === 'yearly' && plan.yearlySavings && (
                <div className="text-sm text-green-400 font-medium">
                  {plan.yearlySavings}
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action Button */}
            <Button
              onClick={() => handleUpgrade(plan.id)}
              disabled={isLoading || plan.selected}
              className={`w-full ${
                plan.selected
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : plan.popular
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                plan.buttonText
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-8 text-gray-400 text-sm">
        <p>All plans include a 7-day free trial. Cancel anytime.</p>
        <p className="mt-2">
          Need a custom plan? <a href="/contact" className="text-blue-400 hover:text-blue-300">Contact us</a>
        </p>
      </div>
    </div>
  );
} 