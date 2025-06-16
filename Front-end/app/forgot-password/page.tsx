"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Failed to process request");
      }

      setSuccess(data.message);
      // In development, show the token
      if (data.token) {
        setSuccess(`${data.message}\nReset Token: ${data.token}`);
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            className="w-full p-2 border rounded"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600 whitespace-pre-line">{success}</p>}
        <p className="text-center">
          <Link href="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
} 