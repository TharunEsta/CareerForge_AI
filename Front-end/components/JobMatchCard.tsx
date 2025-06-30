import React, { useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { motion, AnimatePresence } from "framer-motion";

interface JobMatchCardProps {
  onMatch: (result: any) => void;
}

const JobMatchCard: React.FC<JobMatchCardProps> = ({ onMatch }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !jobDescription.trim()) return;
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("job_description", jobDescription);

      // Replace with your backend endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/job-match`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to match jobs");
      const data = await res.json();
      onMatch(data);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);

      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible.trackEvent('Job Match');
      }
    } catch (err: any) {
      setError(err.message || "Job match failed");
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
        <h3 className="text-lg font-bold mb-2 text-blue-700">Job Match</h3>
        <form onSubmit={handleMatch} className="flex flex-col gap-3">
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={4}
            className="rounded-lg border border-blue-200 p-2"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-800 transition"
            disabled={isLoading || !selectedFile || !jobDescription.trim()}
          >
            {isLoading ? <Spinner size={20} className="inline-block mr-2 align-middle" /> : null}
            {isLoading ? "Matching..." : "Find Matches"}
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

export default JobMatchCard; 