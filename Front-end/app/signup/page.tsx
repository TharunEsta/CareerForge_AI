"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Check if server is running
  useEffect(() => {
    const checkServer = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL;
        console.log("Checking server at:", url);
        setApiUrl(url || "Not set");

        const res = await fetch(`${url}/`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });
        
        if (res.ok) {
          setServerStatus("online");
          console.log("Server is online");
        } else {
          setServerStatus("offline");
          console.log("Server returned error status");
        }
      } catch (err) {
        setServerStatus("offline");
        console.error("Server check failed:", err);
      }
    };

    checkServer();
  }, []);

  const signup = async () => {
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("email", form.email);
      formData.append("password", form.password);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/signup`;
      console.log("Attempting to connect to:", url);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Backend error:", err);
        const detail = err.detail ?? "Signup failed";
        throw new Error(Array.isArray(detail) ? JSON.stringify(detail) : detail);
      }

      router.push("/login");
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.message === "Failed to fetch") {
        setError(`Cannot connect to the server at ${apiUrl}. Please make sure the backend is running at http://127.0.0.1:8000`);
      } else {
        setError(err.message || "Unknown signup error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <div className="mb-4 space-y-2">
        <div className="p-2 bg-gray-100 rounded text-sm">
          <p>API URL: {apiUrl}</p>
          <p>Server Status: {
            serverStatus === "checking" ? "Checking..." :
            serverStatus === "online" ? "✅ Online" :
            "❌ Offline"
          }</p>
        </div>
      </div>
      <div className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          disabled={isLoading}
        />
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled={isLoading}
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          disabled={isLoading}
        />
        <button 
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          onClick={signup}
          disabled={isLoading || serverStatus !== "online"}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}
