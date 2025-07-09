'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Users, Crown } from 'lucide-react';

interface Plan {
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

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscription/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return <Zap className="h-6 w-6" />;
      case 'starter':
        return <Users className="h-6 w-6" />;
      case 'pro':
        return <Star className="h-6 w-6" />;
      case 'growth':
        return <Crown className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const getLimitText = (key: string, value: number) => {
    if (value === -1) return 'Unlimited';
    if (value === 0) return 'Not available';
    return `${value} per month`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your career journey. Start free, upgrade when you're ready.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span
              className={`text-sm ${billingCycle === 'monthly' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`text-sm ${billingCycle === 'yearly' ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
            >
              Yearly
              {billingCycle === 'yearly' && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Save up to 17%
                </Badge>
              )}
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all duration-200 hover:shadow-lg ${
                plan.popular
                  ? 'border-blue-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  {getPlanIcon(plan.name)}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatPrice(
                      billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {billingCycle === 'monthly' ? 'per month' : 'per year'}
                  </div>
                  {billingCycle === 'yearly' && plan.savings_percentage > 0 && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      Save {plan.savings_percentage}%
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check
                        className={`h-5 w-5 mt-0.5 ${
                          feature.available ? 'text-green-500' : 'text-gray-300'
                        }`}
                      />
                      <div className="flex-1">
                        <div
                          className={`text-sm ${
                            feature.available ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {feature.name}
                        </div>
                        <div className="text-xs text-gray-500">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Limits */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 font-medium">Usage Limits:</div>
                  {Object.entries(plan.limits).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-gray-900 font-medium">{getLimitText(key, value)}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  variant={plan.popular ? 'default' : 'secondary'}
                >
                  {plan.price_monthly === 0 ? 'Get Started Free' : 'Choose Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect
                immediately.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 text-sm">
                We offer a free plan with basic features. No credit card required to get started.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">
                Absolutely! Cancel your subscription anytime with no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
