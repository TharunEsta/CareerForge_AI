"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, IndianRupee, Star, Zap, Crown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RazorpayPayment from '@/components/ui/RazorpayPayment';
import { useAuth } from '@/components/AuthContext';
import PayButton from '@/components/ui/PayButton';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    currency: 'INR',
    features: [
      '5 AI messages per month',
      'Basic resume analysis',
      'Community support',
      'Basic job matching'
    ],
    icon: <Star className="w-6 h-6" />
  },
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 499,
    currency: 'INR',
    features: [
      '100 AI messages per month',
      'Advanced resume analysis',
      'Job matching',
      'Email support',
      'Cover letter generation'
    ],
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 899,
    currency: 'INR',
    features: [
      'Unlimited AI messages',
      'Advanced resume analysis',
      'Priority job matching',
      'Voice assistant',
      'LinkedIn optimization',
      'Priority support',
      'All features unlocked'
    ],
    popular: true,
    icon: <Crown className="w-6 h-6" />
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 1299,
    currency: 'INR',
    features: [
      'All Premium features',
      'Custom integrations',
      'API access',
      'Dedicated support',
      'Custom branding',
      'Team management'
    ],
    icon: <Building2 className="w-6 h-6" />
  }
];

export default function PricingPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handlePlanSelect = (plan: Plan) => {
    if (plan.id === 'free') {
      // Handle free plan selection
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    // Handle successful payment
    console.log('Payment successful:', paymentId);
    setShowPayment(false);
    // Redirect or show success message
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
    // Show error message
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 10; // 2 months free for yearly
  };

  const getYearlySavings = (monthlyPrice: number) => {
    const yearlyPrice = getYearlyPrice(monthlyPrice);
    const monthlyEquivalent = yearlyPrice / 12;
    return (monthlyPrice - monthlyEquivalent) * 12;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start your career journey with our AI-powered tools. All plans include a 7-day free trial.
          </p>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-1 flex items-center">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('monthly')}
              className={billingCycle === 'monthly' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingCycle('yearly')}
              className={billingCycle === 'yearly' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}
            >
              Yearly
              {billingCycle === 'yearly' && (
                <Badge className="ml-2 bg-green-600 text-xs">Save 17%</Badge>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {plans.map((plan, index) => {
            const isYearly = billingCycle === 'yearly';
            const displayPrice = plan.id === 'free' ? 0 : isYearly ? getYearlyPrice(plan.price) : plan.price;
            const savings = plan.id === 'free' ? 0 : getYearlySavings(plan.price);
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className={`relative h-full ${
                  plan.popular 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10' 
                    : 'border-gray-700'
                }`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-blue-400">{plan.icon}</div>
                      <CardTitle className="text-white">{plan.name}</CardTitle>
                    </div>
                    
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-6 h-6 text-white" />
                      <span className="text-3xl font-bold text-white">{displayPrice}</span>
                      <span className="text-gray-400">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    
                    {isYearly && plan.id !== 'free' && (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-600 text-xs">
                          Save ₹{savings.toFixed(0)}
                        </Badge>
                        <span className="text-gray-400 text-sm">
                          vs monthly billing
                        </span>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handlePlanSelect(plan)}
                      className={`w-full ${
                        plan.id === 'free'
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {plan.id === 'free' ? 'Get Started' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Payment Modal */}
        {showPayment && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPayment(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <RazorpayPayment
                plan={selectedPlan}
                userEmail={user?.email || 'user@example.com'}
                userName={user?.name || 'User'}
                billingCycle={billingCycle}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </motion.div>
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-400 text-sm">
                  We accept UPI, credit/debit cards, net banking, and digital wallets like Paytm and PhonePe.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">Can I cancel my subscription?</h3>
                <p className="text-gray-400 text-sm">
                  Yes, you can cancel your subscription anytime. You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">Is my data secure?</h3>
                <p className="text-gray-400 text-sm">
                  Yes, we use industry-standard encryption and security measures to protect your data.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-2">Do you offer refunds?</h3>
                <p className="text-gray-400 text-sm">
                  We offer a 7-day money-back guarantee. If you're not satisfied, contact our support team.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <h2>Test Payment</h2>
        <PayButton />
      </div>
    </div>
  );
} 
