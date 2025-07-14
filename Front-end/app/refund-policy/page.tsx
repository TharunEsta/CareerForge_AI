"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, AlertCircle, CheckCircle, Mail } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <RotateCcw className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Cancellation and Refund Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Understanding our refund and cancellation terms
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert max-w-none"
        >
          <div className="bg-gray-800/50 rounded-lg p-8 space-y-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Important Notice
                </h2>
                <p className="text-gray-300 mb-4">
                  We offer digital services which are delivered instantly or within a short processing 
                  window. Therefore, payments made for AI-generated resume analysis, job matching, 
                  or learning plans are <strong>non-refundable</strong> once the service has been delivered.
                </p>
                <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                  <p className="text-orange-300 text-sm">
                    ⚠️ Due to the digital nature of our services, refunds are limited to specific circumstances only.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Refund Eligibility
                </h2>
                <p className="text-gray-300 mb-4">
                  If you are dissatisfied with the service or made a payment in error, contact us 
                  at support@careerforge.info within 24 hours. We will evaluate cases on an individual basis.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <h3 className="text-green-300 font-semibold mb-2">✅ Eligible for Refund</h3>
                    <ul className="text-green-300 text-sm space-y-1">
                      <li>• Duplicate payments</li>
                      <li>• Technical errors on our end</li>
                      <li>• Service not delivered within 24 hours</li>
                      <li>• Unauthorized transactions</li>
                    </ul>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <h3 className="text-red-300 font-semibold mb-2">❌ Not Eligible for Refund</h3>
                    <ul className="text-red-300 text-sm space-y-1">
                      <li>• Service already delivered</li>
                      <li>• Change of mind after 24 hours</li>
                      <li>• Dissatisfaction with AI results</li>
                      <li>• Account suspension due to policy violation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Refund Process
                </h2>
                <p className="text-gray-300 mb-4">
                  If your refund request is approved, here's what happens:
                </p>
                <ol className="text-gray-300 space-y-2 ml-4">
                  <li>1. Contact us within 24 hours of payment</li>
                  <li>2. Provide your order details and reason for refund</li>
                  <li>3. We review your request within 48 hours</li>
                  <li>4. If approved, refund is processed within 5-7 business days</li>
                  <li>5. You'll receive confirmation via email</li>
                </ol>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Cancellation Policy
                </h2>
                <p className="text-gray-300 mb-4">
                  No automatic cancellations apply. You can cancel your subscription at any time:
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Cancel through your account dashboard</li>
                  <li>• Contact support to cancel</li>
                  <li>• Cancellation takes effect at the end of current billing period</li>
                  <li>• No refunds for partial months</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Contact Information
              </h2>
              <p className="text-gray-300 mb-4">
                For refund requests or questions about our policy:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <p className="text-white font-medium">Email: support@careerforge.info</p>
                </div>
                <p className="text-gray-300 text-sm">
                  Please include your order ID and reason for refund in your email.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                <strong>Last updated:</strong> December 2024
              </p>
              <p className="text-gray-400 text-sm mt-2">
                This refund policy is effective as of the date listed above and will remain in effect 
                except with respect to any changes in its provisions in the future, which will be in 
                effect immediately after being posted on this page.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
