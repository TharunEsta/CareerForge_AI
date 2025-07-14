'use client';
import React from 'react';
import { Rocket, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
export const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onClose }) => {
  const router = useRouter();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="upgrade-modal"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center relative animate-fade-in"
          >
            <span
              className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600 text-xl"
              onClick={onClose}
            >
              &times;
            </span>
            <div className="flex flex-col items-center mb-4">
              <Rocket className="text-yellow-400 mb-2" size={48} />
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Upgrade to CareerForge Plus</h2>
              <p className="text-gray-600 text-center mb-4">
                Unlock unlimited chats, job tools, and faster AI.
              </p>
            </div>
            <ul className="mb-6 space-y-2 w-full">
              <li className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18} /> Unlimited chats
              </li>
              <li className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18} /> Access to all job tools
              </li>
              <li className="flex items-center gap-2 text-green-600">
                <CheckCircle size={18} /> Priority AI responses
              </li>
            </ul>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded-lg transition"
                onClick={() => router.push('/pricing')}
              >
                View Plans
              </button>
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                onClick={onClose}
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
