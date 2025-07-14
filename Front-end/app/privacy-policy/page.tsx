"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg">
            Your privacy is our priority
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
              <Lock className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Information We Collect
                </h2>
                <p className="text-gray-300 mb-4">
                  CareerForge AI ("we," "our," or "us") is committed to protecting your privacy. 
                  We collect personal information such as name, email, phone number, and resume data 
                  solely to deliver our services — including resume analysis, job matching, and 
                  personalized career tools.
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Personal identification information (name, email address, phone number)</li>
                  <li>• Resume and career-related documents</li>
                  <li>• Usage data and interaction with our AI services</li>
                  <li>• Payment information (processed securely through Razorpay)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-gray-300 mb-4">
                  Your data is used exclusively to provide and improve our services:
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Process and analyze your resume for career insights</li>
                  <li>• Match you with relevant job opportunities</li>
                  <li>• Provide personalized AI-powered career recommendations</li>
                  <li>• Process payments and manage your subscription</li>
                  <li>• Send important service updates and notifications</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Database className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Data Protection
                </h2>
                <p className="text-gray-300 mb-4">
                  We do not sell or share your data with third parties. Your data is securely stored 
                  and only used for your interactions on our platform. We implement industry-standard 
                  security measures to protect your information.
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Encryption of data in transit and at rest</li>
                  <li>• Secure cloud infrastructure with regular backups</li>
                  <li>• Access controls and authentication measures</li>
                  <li>• Regular security audits and updates</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Your Rights
                </h2>
                <p className="text-gray-300 mb-4">
                  You have the right to:
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>• Access your personal data</li>
                  <li>• Request correction of inaccurate information</li>
                  <li>• Request deletion of your data</li>
                  <li>• Opt-out of marketing communications</li>
                  <li>• Export your data in a portable format</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-300 mb-4">
                If you have questions about your data or need it deleted, contact us at:
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
                This privacy policy is effective as of the date listed above and will remain in effect 
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
