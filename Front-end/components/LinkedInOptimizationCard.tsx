import React, { useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { motion, AnimatePresence } from "framer-motion";

interface LinkedInOptimizationCardProps {
  onOptimize: (result: any) => void;
}

const LinkedInOptimizationCard: React.FC<LinkedInOptimizationCardProps> = ({ onOptimize }) => {
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() || !skills.trim()) return;
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/linkedin-optimization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ summary, skills }),
      });
      if (!res.ok) throw new Error("Failed to optimize LinkedIn profile");
      const data = await res.json();
      onOptimize(data);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible.trackEvent('LinkedIn Optimized');
      }
    } catch (err: any) {
      setError(err.message || "Optimization failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="animate-fade-in bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl p-6 border border-blue-100 my-4"
      >
        <h3 className="text-lg font-bold mb-2 text-blue-700">LinkedIn Optimization</h3>
        <form onSubmit={handleOptimize} className="flex flex-col gap-3">
          <textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="Paste your LinkedIn profile summary here..."
            rows={3}
            className="rounded-lg border border-blue-200 p-2"
          />
          <input
            type="text"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="Skills (comma separated)"
            className="rounded-lg border border-blue-200 p-2"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-800 transition"
            disabled={isLoading || !summary.trim() || !skills.trim()}
          >
            {isLoading ? <Spinner size={20} className="inline-block mr-2 align-middle" /> : null}
            {isLoading ? "Optimizing..." : "Optimize LinkedIn"}
          </button>
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                key="success-check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center text-green-600 font-bold gap-2"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Success!
              </motion.div>
            )}
          </AnimatePresence>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default LinkedInOptimizationCard; 