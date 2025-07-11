import React from "react";
import { Sparkles } from "lucide-react";

const suggestions = [
  "Summarize this PDF",
  "Improve my resume",
  "Write a cover letter",
  "Suggest interview questions",
  "Find job matches"
];

export function PromptSuggestions({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex gap-2 mb-4">
      {suggestions.map((s, i) => (
        <button
          key={i}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-blue-100 text-gray-800 rounded-full text-sm font-medium shadow transition"
          onClick={() => onSelect(s)}
        >
          <Sparkles size={16} />
          {s}
        </button>
      ))}
    </div>
  );
} 