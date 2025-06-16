"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (form.new_password !== form.confirm_password) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("token", token || "");
      formData.append("new_password", form.new_password);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to reset password");
      }

      setSuccess(data.message);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Invalid Reset Link</h2>
        <p className="text-red-600 mb-4">This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="text-blue-500 hover:underline">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="New Password"
            value={form.new_password}
            onChange={(e) => setForm({ ...form, new_password: e.target.value })}
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="Confirm New Password"
            value={form.confirm_password}
            onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <p className="text-center">
          <Link href="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
