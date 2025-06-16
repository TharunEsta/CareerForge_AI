"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MatchResume from "@/components/MatchResume";
import { useAuth } from "@/components/AuthContext";


export default function JobMatchPage() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Job Matcher</h1>
      <MatchResume />
    </div>
  );
} 