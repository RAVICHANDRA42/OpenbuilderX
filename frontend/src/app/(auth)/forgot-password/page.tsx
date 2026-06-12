"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { post } from "@/lib/api-client";

function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address");
      return;
    }
    setIsLoading(true);
    try {
      await post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setError(axiosErr?.response?.data?.detail || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">OpenBuilder</span>
          </Link>
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            {sent
              ? "Check your email for a reset link"
              : "Enter your email and we'll send you a reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="rounded-full bg-green-500/10 p-3 mx-auto w-fit">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                If an account exists with {email}, you will receive a password
                reset email shortly.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Back to Sign In</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                error={error}
                icon={<Mail className="h-4 w-4" />}
              />
              {error && (
                <p className="text-xs text-destructive text-center">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button variant="ghost" className="w-full gap-2" asChild>
                <Link href="/login">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
