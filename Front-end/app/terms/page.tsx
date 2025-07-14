"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Shield, Users, Clock } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <FileText className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-400 text-lg">
            Please read these terms carefully before using our services
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
              <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Acceptance of Terms
                </h2>
                <p className="text-gray-300 mb-4">
                  By accessing and using CareerForge AI, you agree to comply with our terms. 
                  Our platform offers services like resume parsing, job matching, AI-based scoring, 
                  and personalized upskilling suggestions.
                </p>
                <p className="text-gray-300">
                  If you do not agree with any part of these terms, please do not use our services.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  User Responsibilities
                </h2>
                <p className="text-gray-300 mb-4">
                  You are responsible for providing accurate information. We reserve the right to 
                  suspend accounts that misuse our services.
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Provide accurate and truthful information</li>
                  <li>• Maintain the security of your account credentials</li>
                  <li>• Use the service for lawful purposes only</li>
                  <li>• Not attempt to reverse engineer or hack our systems</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• Not share your account with others</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Intellectual Property
                </h2>
                <p className="text-gray-300 mb-4">
                  All content on this site is the intellectual property of CareerForge AI. 
                  Unauthorized use is prohibited.
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Our AI algorithms and technology are proprietary</li>
                  <li>• Website design and content are protected by copyright</li>
                  <li>• You retain ownership of your uploaded content</li>
                  <li>• You grant us license to process your data for service delivery</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Service Limitations
                </h2>
                <p className="text-gray-300 mb-4">
                  Our services are provided "as is" and we make no warranties about their accuracy 
                  or reliability.
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• AI recommendations are suggestions, not guarantees</li>
                  <li>• Job matching results may vary</li>
                  <li>• Service availability may be subject to maintenance</li>
                  <li>• We are not responsible for third-party job postings</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Subscription and Payments
                </h2>
                <p className="text-gray-300 mb-4">
                  Subscription terms and payment processing are handled through secure payment gateways.
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Payments are processed securely through Razorpay</li>
                  <li>• Subscriptions auto-renew unless cancelled</li>
                  <li>• Refunds are subject to our refund policy</li>
                  <li>• Price changes will be communicated in advance</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Contact Information
              </h2>
              <p className="text-gray-300 mb-4">
                For concerns or questions about these terms, email us at:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-white font-medium">Email: support@careerforge.info</p>
                <p className="text-gray-300 text-sm mt-1">
                  We typically respond within 24-48 hours
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                <strong>Last updated:</strong> December 2024
              </p>
              <p className="text-gray-400 text-sm mt-2">
                These terms and conditions are effective as of the date listed above and will remain 
                in effect except with respect to any changes in its provisions in the future, which 
                will be in effect immediately after being posted on this page.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
