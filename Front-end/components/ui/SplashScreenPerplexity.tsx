import React, { useEffect, useState } from 'react';

export default function SplashScreenPerplexity() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18181b] transition-opacity duration-700 animate-fadeOut">
      <div className="flex flex-col items-center">
        <svg width="80" height="80" viewBox="0 0 32 32" fill="none"><path d="M16 2L20.09 11.26L30 12.27L22 19.14L24.18 29.02L16 23.77L7.82 29.02L10 19.14L2 12.27L11.91 11.26L16 2Z" fill="#fff"/></svg>
        <span className="mt-4 text-3xl font-bold text-white tracking-wide">perplexity</span>
      </div>
    </div>
  );
}

// Add this to your global CSS or Tailwind config:
// @keyframes fadeOut { to { opacity: 0; } }
// .animate-fadeOut { animation: fadeOut 1.5s 1.2s forwards; } 