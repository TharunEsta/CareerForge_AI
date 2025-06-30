import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Providers from "../components/Providers";
import { useEffect } from "react";
// @ts-ignore
import plausibleImport from "plausible-tracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSync AI",
  description: "AI-powered resume matcher and job assistant",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // @ts-ignore
    const plausibleInstance = plausibleImport({ domain: "careerforge.ai" });
    plausibleInstance.trackPageview();
    // @ts-ignore
    window.plausible = plausibleInstance;
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={cn(inter.className)}>
        <Providers>
          <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-colors duration-500 relative">
            <main role="main">
              {children}
            </main>
            {/* Global floating mic button */}
            <button
              className="fixed bottom-6 right-6 z-50 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-2xl p-5 flex items-center justify-center transition-all duration-300 animate-mic-float focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label="Activate Voice Assistant"
              style={{ boxShadow: '0 8px 32px 0 rgba(34, 139, 230, 0.18)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v1.5m0 0h3m-3 0H9m6-7.5a3 3 0 11-6 0v-3a3 3 0 116 0v3z" />
              </svg>
            </button>
          </div>
        </Providers>
        <style jsx global>{`
          .animate-mic-float {
            animation: micFloat 2.5s ease-in-out infinite alternate;
          }
          @keyframes micFloat {
            from { transform: translateY(0); }
            to { transform: translateY(-10px); }
          }
        `}</style>
      </body>
    </html>
  );
}
