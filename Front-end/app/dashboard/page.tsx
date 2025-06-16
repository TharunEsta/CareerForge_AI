"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";

import Link from "next/link";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [token, router]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Resume Analysis</h2>
          <p className="text-gray-600">
            Get detailed feedback on your resume's strengths and areas for improvement.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Job Matching</h2>
          <p className="text-gray-600">
            Find jobs that match your skills and experience.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Resume Rewriting</h2>
          <p className="text-gray-600">
            Get a professionally rewritten resume optimized for ATS systems.
          </p>
        </div>
      </div>
    </div>
  );
}
