"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield, CreditCard, Download, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { currentPlan, userSubscription } = useSubscription();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#18181b] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account</h1>
          <p className="text-gray-400">Manage your account and subscription</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Account Overview</h2>
                    
                    {/* User Info */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{user?.name || 'User'}</h3>
                            <p className="text-gray-400 text-sm">{user?.email || 'user@example.com'}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">{user?.email || 'user@example.com'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">
                              Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">Current Plan</h3>
                            <p className="text-gray-400 text-sm">{currentPlan.toUpperCase()} Plan</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">Status</span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                              Active
                            </span>
                          </div>
                          {userSubscription?.nextBillingDate && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">Next Billing</span>
                              <span className="text-gray-300 text-sm">
                                {formatDate(userSubscription.nextBillingDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="bg-gray-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {userSubscription?.currentUsage.ai_chats || 0}
                          </div>
                          <div className="text-gray-400 text-sm">AI Chats</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {userSubscription?.currentUsage.resume_parsing || 0}
                          </div>
                          <div className="text-gray-400 text-sm">Resume Analysis</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {userSubscription?.currentUsage.job_matching || 0}
                          </div>
                          <div className="text-gray-400 text-sm">Job Matches</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'billing' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Billing & Subscription</h2>
                    
                    <div className="space-y-6">
                      {/* Current Plan */}
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xl font-bold text-white">{currentPlan.toUpperCase()} Plan</div>
                            <div className="text-gray-400 text-sm">
                              {currentPlan === 'free' ? 'Free forever' : '$19/month'}
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            {currentPlan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                          </button>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                        {currentPlan === 'free' ? (
                          <p className="text-gray-400">No payment method required for free plan</p>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-white font-medium">•••• •••• •••• 4242</div>
                                <div className="text-gray-400 text-sm">Expires 12/25</div>
                              </div>
                            </div>
                            <button className="text-blue-400 hover:text-blue-300 text-sm">
                              Update
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Billing History */}
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
                        {currentPlan === 'free' ? (
                          <p className="text-gray-400">No billing history for free plan</p>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-600">
                              <div>
                                <div className="text-white font-medium">Plus Plan - Monthly</div>
                                <div className="text-gray-400 text-sm">January 2024</div>
                              </div>
                              <div className="text-right">
                                <div className="text-white font-medium">$19.00</div>
                                <div className="text-green-400 text-sm">Paid</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      {/* Password */}
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Password</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">Password</div>
                            <div className="text-gray-400 text-sm">Last changed 30 days ago</div>
                          </div>
                          <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                            Change
                          </button>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">2FA Status</div>
                            <div className="text-gray-400 text-sm">Not enabled</div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            Enable
                          </button>
                        </div>
                      </div>

                      {/* Login Sessions */}
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 border-b border-gray-600">
                            <div>
                              <div className="text-white font-medium">Current Session</div>
                              <div className="text-gray-400 text-sm">Chrome on Windows • Active now</div>
                            </div>
                            <span className="text-green-400 text-sm">Current</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-700 mt-8">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors">
                    <Download size={16} />
                    <span>Export Data</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 size={16} />
                    <span>Delete Account</span>
                  </button>
                </div>

                <button
                  onClick={logout}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 