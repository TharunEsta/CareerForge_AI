"use client";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function MatchResume() {
  const { token } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!token) {
      setError("Please log in to use this feature");
      router.push("/login");
      return;
    }

    if (!file || !jd) {
      setError("Please select a file and enter a job description");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jd);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job_match`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401) {
        setError("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to match resume");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!token && (
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded">
          Please log in to use this feature
        </div>
      )}
      
      <input 
        type="file" 
        onChange={e => setFile(e.target.files?.[0] || null)} 
        className="mb-4"
        disabled={!token}
      />
      <textarea
        placeholder="Paste job description here"
        className="w-full border mt-2 p-2 h-32"
        onChange={e => setJd(e.target.value)}
        disabled={!token}
      />
      <button 
        className="btn mt-2" 
        onClick={handleUpload} 
        disabled={loading || !token}
      >
        {loading ? "Processing..." : "Match Resume"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <p><strong>Match Score:</strong> {result.match_score || 0}%</p>
          <p><strong>Missing Skills:</strong> {(result.missing_skills || []).join(", ") || "None"}</p>
          <p><strong>Learning Plan:</strong></p>
          <pre className="bg-white p-2 rounded">{result.learning_plan || "No learning plan available"}</pre>
        </div>
      )}
    </div>
  );
}
