import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <span className="text-4xl font-bold">CareerForge AI</span>
      </div>
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="text-lg text-gray-300">Loading your career tools...</p>
    </motion.div>
  );
} 
