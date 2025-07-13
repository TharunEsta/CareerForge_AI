'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Mail, BookOpen, Video, FileText, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I upload my resume?",
    answer: "Click on the 'Resume Analysis' card on the dashboard or drag and drop your PDF, DOC, or DOCX file into the upload area. Our AI will automatically parse and analyze your resume.",
    category: "Getting Started"
  },
  {
    question: "What file formats are supported?",
    answer: "We support PDF, DOC, and DOCX files. For best results, we recommend using PDF format as it preserves formatting better.",
    category: "Getting Started"
  },
  {
    question: "How does job matching work?",
    answer: "After uploading your resume, our AI analyzes your skills and experience to find relevant job opportunities. You can also manually search for jobs based on your criteria.",
    category: "Features"
  },
  {
    question: "Can I upgrade my plan anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you'll only be charged for the difference.",
    category: "Billing"
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from your account settings. You'll continue to have access until the end of your billing period.",
    category: "Billing"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties.",
    category: "Security"
  },
  {
    question: "How accurate is the AI analysis?",
    answer: "Our AI is trained on millions of resumes and job descriptions, providing highly accurate analysis. However, we always recommend reviewing and customizing the results.",
    category: "Features"
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Getting Started', 'Features', 'Billing', 'Security'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#18181b] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Help & Support
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Find answers to common questions and get the support you need to make the most of CareerForge AI.
          </motion.p>
        </div>

        {/* Search and Categories */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  {category === 'all' ? 'All Topics' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Live Chat</h3>
                <p className="text-gray-400 text-sm">Get instant help from our support team</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Email Support</h3>
                <p className="text-gray-400 text-sm">Send us a detailed message</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Documentation</h3>
                <p className="text-gray-400 text-sm">Browse our detailed guides</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Frequently Asked Questions
            {filteredFAQs.length > 0 && (
              <span className="text-gray-400 text-lg font-normal ml-2">
                ({filteredFAQs.length} results)
              </span>
            )}
          </h2>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-gray-400">
                Try adjusting your search terms or browse all categories.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                      <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you get the most out of CareerForge AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <MessageCircle size={20} />
                <span>Start Live Chat</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                <Mail size={20} />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 