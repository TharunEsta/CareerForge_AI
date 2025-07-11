"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/ui/Sidebar";
import { SplashScreen } from "../components/ui/SplashScreen";
import "../globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex dark">
        {showSplash && <SplashScreen />}
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
} 