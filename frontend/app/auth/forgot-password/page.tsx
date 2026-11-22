"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, CircleAlert, CircleCheck, LoaderCircle, ArrowLeft } from "lucide-react";
import { GradientButton } from "../../components/utils/GradientButton";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { default: apiClient } = await import("../../api/interceptor");
      await apiClient.post("/auth/forgot-password", { email: email.trim() });
      setSubmitted(true);
    } catch {
      // Generic message — never confirm whether email exists.
      setError("Something went wrong. Please try again shortly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Background */}
      <div className="fixed inset-0 -z-10 select-none pointer-events-none">
        <Image
          src="/images/login-bg.jpg"
          alt="Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      </div>

      {/* Header */}
      <header className="w-full px-6 py-6 sm:px-12 flex items-center justify-between z-10">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <Image
            src="/logos/red-white.png"
            alt="SwiftPY Logo"
            width={130}
            height={36}
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-12 py-8 flex items-center z-10">
        <div className="w-full max-w-sm">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
            Back to login
          </Link>

          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Forgot password?
          </h2>
          <p className="text-sm text-white/75 mb-6">
            Enter your email and we&apos;ll send you a reset link if an account exists.
          </p>

          {submitted ? (
            <div className="flex items-start gap-3 px-4 py-4 rounded-sm bg-green-500/20 border border-green-400/40 text-green-200 text-sm">
              <CircleCheck className="w-5 h-5 shrink-0 mt-0.5" aria-hidden />
              <span>
                If that email is registered, a reset link is on its way. Please check your inbox.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2 px-4 py-3 rounded-sm bg-red-500/20 border border-red-400/40 text-red-200 text-sm"
                >
                  <CircleAlert className="w-4 h-4 shrink-0" aria-hidden />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-white/95 tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@swiftpy.org"
                    disabled={isLoading}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white text-gray-900 placeholder:text-gray-400 rounded-xs border-0 outline-hidden focus:ring-2 focus:ring-secondary shadow-md transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="pt-1">
                <GradientButton
                  type="submit"
                  size="md"
                  rounded="sm"
                  disabled={isLoading}
                  className="px-7 py-2.5 text-sm font-bold shadow-lg flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </GradientButton>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
