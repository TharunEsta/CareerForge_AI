'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, Mail, CheckCircle, AlertCircle } from 'lucide-react';
export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <Truck className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Shipping and Delivery Policy</h1>
          <p className="text-gray-400 text-lg">
            Understanding how our digital services are delivered
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
              <AlertCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Digital Service Delivery</h2>
                <p className="text-gray-300 mb-4">
                  All services provided by CareerForge AI are digital. No physical products will be
                  shipped.
                </p>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-300 text-sm">
                    📱 Our services are delivered instantly through our web platform and mobile app.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Delivery Timeline</h2>
                <p className="text-gray-300 mb-4">
                  You will receive access to your AI-generated reports and recommendations directly
                  on the platform or via email, usually within minutes to a few hours after payment.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <h3 className="text-green-300 font-semibold mb-2">⚡ Instant Delivery</h3>
                    <ul className="text-green-300 text-sm space-y-1">
                      <li>• Resume analysis results</li>
                      <li>• Job matching suggestions</li>
                      <li>• AI chat responses</li>
                      <li>• Account activation</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <h3 className="text-yellow-300 font-semibold mb-2">⏱️ Within Hours</h3>
                    <ul className="text-yellow-300 text-sm space-y-1">
                      <li>• Detailed career reports</li>
                      <li>• Personalized learning plans</li>
                      <li>• LinkedIn optimization</li>
                      <li>• Email notifications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Delivery Methods</h2>
                <p className="text-gray-300 mb-4">
                  We deliver our services through multiple channels to ensure you receive everything
                  you need:
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>
                    • <strong>Web Platform:</strong> Access all features through your dashboard
                  </li>
                  <li>
                    • <strong>Email Notifications:</strong> Receive updates and reports via email
                  </li>
                  <li>
                    • <strong>Mobile App:</strong> Use our mobile application for on-the-go access
                  </li>
                  <li>
                    • <strong>API Access:</strong> Enterprise users can integrate via API
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">What You'll Receive</h2>
                <p className="text-gray-300 mb-4">After payment, you'll have access to:</p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• AI-powered resume analysis and scoring</li>
                  <li>• Personalized job matching recommendations</li>
                  <li>• Career development insights and reports</li>
                  <li>• Learning path suggestions and resources</li>
                  <li>• Real-time AI chat support</li>
                  <li>• Progress tracking and analytics</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
                <p className="text-gray-300 mb-4">
                  Our digital services are available 24/7, with some considerations:
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Platform maintenance: Scheduled during off-peak hours</li>
                  <li>• AI processing: May take longer during high traffic</li>
                  <li>• Support hours: Mon-Sat, 10:00 AM to 6:00 PM IST</li>
                  <li>• Emergency support: Available for critical issues</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Need Help?</h2>
              <p className="text-gray-300 mb-4">
                For assistance with service delivery or access issues:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <p className="text-white font-medium">Email: support@careerforge.info</p>
                </div>
                <p className="text-gray-300 text-sm">
                  We typically respond within 2-4 hours during business hours.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                <strong>Last updated:</strong> December 2024
              </p>
              <p className="text-gray-400 text-sm mt-2">
                This shipping and delivery policy is effective as of the date listed above and will
                remain in effect except with respect to any changes in its provisions in the future,
                which will be in effect immediately after being posted on this page.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
