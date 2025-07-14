"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './logo';

interface SplashScreenProps {
  show: boolean;
}

const gradientBg =
  'bg-gradient-to-br from-blue-700 via-purple-700 to-cyan-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900';

export const SplashScreen = ({ show }: SplashScreenProps) => {
  return show ? (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${gradientBg}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6 } }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'backOut' }}
          className="mb-6"
        >
          <img src="/ai-doc-logo.svg" alt="CareerForge Logo" className="h-32 w-auto" draggable={false} />
        </motion.div>
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        >
          <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
            CareerForge AI
          </span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-blue-100 font-medium mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          AI-Powered Career Mastery
        </motion.p>
        {/* Spinner */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <svg className="animate-spin h-10 w-10 text-white/80" viewBox="0 0 50 50">
            <circle
              className="opacity-30"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="5"
              fill="none"
            />
            <path
              className="opacity-80"
              fill="currentColor"
              d="M25 5a20 20 0 0 1 20 20h-5a15 15 0 0 0-15-15V5z"
            />
          </svg>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ) : null;
};

export default SplashScreen;
