"use client";

import { AuthProvider } from "@/components/AuthContext"; // ✅ Add this line

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
