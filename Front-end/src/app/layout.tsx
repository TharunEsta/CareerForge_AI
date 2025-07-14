"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/ui/Sidebar";
import "../globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex dark">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
} 
