'use client';

import React from 'react';
import { Button } from './button';

interface SubscriptionCardsProps {
  currentPlan: string;
  onUpgrade: (planId: string) => void;
  isLoading?: boolean;
}

export default function SubscriptionCards({
  currentPlan,
  onUpgrade,
  isLoading,
}: SubscriptionCardsProps) {
  const plans = [
    { id: 'free', name: 'Free', price: '$0', features: ['Basic features'] },
    {
      id: 'premium',
      name: 'Premium',
      price: '$9/mo',
      features: ['All features', 'Priority support'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$29/mo',
      features: ['Everything', 'Custom integrations'],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
          <p className="text-3xl font-bold text-blue-400 mb-4">{plan.price}</p>
          <ul className="text-gray-300 space-y-2 mb-6">
            {plan.features.map((feature, idx) => (
              <li key={idx}>• {feature}</li>
            ))}
          </ul>
          <Button
            onClick={() => onUpgrade(plan.id)}
            disabled={isLoading || currentPlan === plan.id}
            className="w-full"
          >
            {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
          </Button>
        </div>
      ))}
    </div>
  );
}
