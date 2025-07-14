"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  // Handle Google login
  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (e: any) {
      setError("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP send (signup)
  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call your /api/auth/send-otp endpoint
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (e: any) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verify (login)
  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use NextAuth credentials provider
      const res = await signIn("credentials", {
        email,
        otp,
        redirect: false,
      });
      if (res?.ok) {
        router.push("/dashboard");
      } else {
        setError(res?.error || "Invalid OTP");
      }
    } catch (e: any) {
      setError("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl bg-white/90 dark:bg-[#18181b] text-foreground">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold mb-2">Welcome to CareerForge</CardTitle>
          <div className="text-gray-500 dark:text-gray-400 text-sm">Sign in or create an account</div>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={v => setTab(v as "login" | "signup")} className="w-full">
            <TabsList className="w-full flex mb-6">
              <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-4"
                onClick={handleGoogle}
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block"><g><circle fill="#fff" cx="24" cy="24" r="24"/><path fill="#4285F4" d="M35.3 24.2c0-.7-.1-1.4-.2-2H24v4.1h6.4c-.3 1.4-1.3 2.6-2.7 3.4v2.8h4.4c2.6-2.4 4.2-5.9 4.2-10.3z"/><path fill="#34A853" d="M24 36c3.6 0 6.6-1.2 8.8-3.2l-4.4-2.8c-1.2.8-2.7 1.3-4.4 1.3-3.4 0-6.2-2.3-7.2-5.4h-4.5v3.1C15.2 33.8 19.3 36 24 36z"/><path fill="#FBBC05" d="M16.8 26.9c-.3-.8-.5-1.7-.5-2.9s.2-2.1.5-2.9v-3.1h-4.5C11.5 21.2 12 23.5 12 24s-.5 2.8-1.2 4.1l4.5-3.2z"/><path fill="#EA4335" d="M24 18.6c1.9 0 3.6.6 4.9 1.7l3.7-3.7C30.6 14.2 27.6 13 24 13c-4.7 0-8.8 2.2-11.3 5.7l4.5 3.1c1-3.1 3.8-5.4 7.2-5.4z"/></g></svg>
                Continue with Google
              </Button>
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                <span className="mx-2 text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
              </div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
                className="mb-3"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit code"
                className="mb-3 tracking-widest text-lg"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                autoComplete="one-time-code"
                disabled={loading}
              />
              <Button
                className="w-full bg-primary hover:bg-primary/90 mb-2"
                onClick={handleVerifyOtp}
                disabled={loading || !email || otp.length !== 6}
              >
                {loading ? <span className="animate-spin mr-2">⏳</span> : null}
                Verify
              </Button>
            </TabsContent>
            <TabsContent value="signup">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-4"
                onClick={handleGoogle}
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block"><g><circle fill="#fff" cx="24" cy="24" r="24"/><path fill="#4285F4" d="M35.3 24.2c0-.7-.1-1.4-.2-2H24v4.1h6.4c-.3 1.4-1.3 2.6-2.7 3.4v2.8h4.4c2.6-2.4 4.2-5.9 4.2-10.3z"/><path fill="#34A853" d="M24 36c3.6 0 6.6-1.2 8.8-3.2l-4.4-2.8c-1.2.8-2.7 1.3-4.4 1.3-3.4 0-6.2-2.3-7.2-5.4h-4.5v3.1C15.2 33.8 19.3 36 24 36z"/><path fill="#FBBC05" d="M16.8 26.9c-.3-.8-.5-1.7-.5-2.9s.2-2.1.5-2.9v-3.1h-4.5C11.5 21.2 12 23.5 12 24s-.5 2.8-1.2 4.1l4.5-3.2z"/><path fill="#EA4335" d="M24 18.6c1.9 0 3.6.6 4.9 1.7l3.7-3.7C30.6 14.2 27.6 13 24 13c-4.7 0-8.8 2.2-11.3 5.7l4.5 3.1c1-3.1 3.8-5.4 7.2-5.4z"/></g></svg>
                Continue with Google
              </Button>
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                <span className="mx-2 text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
              </div>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@email.com"
                className="mb-3"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
              <Button
                className="w-full bg-primary hover:bg-primary/90 mb-2"
                onClick={handleSendOtp}
                disabled={loading || !email}
              >
                {loading ? <span className="animate-spin mr-2">⏳</span> : null}
                Get OTP
              </Button>
              {otpSent && (
                <>
                  <Label htmlFor="signup-otp">Enter OTP</Label>
                  <Input
                    id="signup-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit code"
                    className="mb-3 tracking-widest text-lg"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                    autoComplete="one-time-code"
                    disabled={loading}
                  />
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 mb-2"
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? <span className="animate-spin mr-2">⏳</span> : null}
                    Verify
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
          {error && <Alert variant="destructive" className="mt-4">{error}</Alert>}
        </CardContent>
        <CardFooter className="flex flex-col items-center mt-2">
          <div className="text-xs text-gray-400 text-center">
            By continuing, you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy-policy" className="underline">Privacy Policy</a>.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 