import React from "react";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";

export function MessageBubble({ role, content, onCopy, showCopy }: { role: "user" | "ai"; content: string; onCopy?: () => void; showCopy?: boolean }) {
  return (
    <motion.div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className={`rounded-xl px-4 py-2 max-w-[80%] shadow-md ${role === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-900"} relative group`}>
        {content}
        {showCopy && (
          <button
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200"
            onClick={onCopy}
            title="Copy"
          >
            <Copy size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
} 