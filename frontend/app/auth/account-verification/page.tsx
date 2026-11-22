"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { GradientButton } from "../../components/utils/GradientButton";
import type { AxiosError } from "axios";
import {
  useResendVerification,
  useVerifyAccount,
} from "../hooks/useAccountVerification";

export default function AccountVerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutateAsync: verifyAccount } = useVerifyAccount();
  const { mutateAsync: resendVerification } = useResendVerification();

  const [isVerifying, setIsVerifying] = useState(Boolean(token));
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let mounted = true;

    verifyAccount({ token })
      .then(() => {
        if (mounted) {
          setVerified(true);
          setIsVerifying(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          const data = (err as AxiosError<{ message?: string; detail?: string }>)
            .response?.data;
          const msg = data?.message ??
            data?.detail ??
            "Verification link has expired or is invalid.";
          setVerifyError(msg);
          setIsVerifying(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [token, verifyAccount]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      await resendVerification({ email: resendEmail.trim() });
      setResendSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as AxiosError<{ message?: string; detail?: string }>)
          ?.response?.data?.message ??
        (err as AxiosError<{ detail?: string }>)?.response?.data?.detail ??
        "Failed to resend verification email. Please try again.";
      setResendError(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Background Image with Cinematic Dark Overlay */}
      <div className="fixed inset-0 -z-10 select-none pointer-events-none">
        <Image
          src="/images/login-bg.jpg"
          alt="Snowy mountain sunset background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      </div>

      {/* Top Header Navigation */}
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
        <Link
          href="/"
          className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xs"
        >
          <span>Back to Home</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-6 sm:px-12 py-12 flex items-center z-10">
        <div className="w-full space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-xs">
            Account Verification
          </h1>

          {/* Token-based Auto Verification in progress */}
          {isVerifying && (
            <div className="flex items-center gap-3 px-5 py-4 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm">
              <LoaderCircle className="w-5 h-5 animate-spin text-secondary shrink-0" />
              <span>Verifying your account token, please wait...</span>
            </div>
          )}

          {/* Verification Success */}
          {verified && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 px-5 py-4 rounded-sm bg-green-500/20 border border-green-400/40 text-green-200 text-sm">
                <CircleCheck className="w-5 h-5 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="font-semibold text-white">Email verified successfully!</p>
                  <p className="mt-1 text-green-200/90">
                    Your account has been activated. You can now sign in to your account.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/auth/login">
                  <GradientButton size="md" rounded="sm" className="px-7 py-2.5 text-sm font-bold shadow-lg">
                    Sign in now
                  </GradientButton>
                </Link>
              </div>
            </div>
          )}

          {/* Verification Error */}
          {verifyError && (
            <div className="space-y-4">
              <div
                role="alert"
                className="flex items-start gap-3 px-5 py-4 rounded-sm bg-red-500/20 border border-red-400/40 text-red-200 text-sm"
              >
                <CircleAlert className="w-5 h-5 shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="font-semibold text-white">Verification Failed</p>
                  <p className="mt-1 text-red-200/90">{verifyError}</p>
                </div>
              </div>
            </div>
          )}

          {/* If not verified yet or no token, show instructions and resend form */}
          {!verified && !isVerifying && (
            <div className="space-y-6 pt-2">
              <p className="text-sm sm:text-base text-white/85 font-normal leading-relaxed">
                Please check your inbox for a verification email. Click the verification link
                in that message to activate your SwiftPY account.
              </p>

              <div className="border-t border-white/15 pt-6 space-y-4">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Didn&apos;t receive an email?
                </h3>
                <p className="text-xs sm:text-sm text-white/75">
                  Enter your email address below to request a new verification link.
                </p>

                {resendSuccess && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-sm bg-green-500/20 border border-green-400/40 text-green-200 text-sm">
                    <CircleCheck className="w-4 h-4 shrink-0" aria-hidden />
                    <span>A new verification link has been sent to your email.</span>
                  </div>
                )}

                {resendError && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 px-4 py-3 rounded-sm bg-red-500/20 border border-red-400/40 text-red-200 text-sm"
                  >
                    <CircleAlert className="w-4 h-4 shrink-0" aria-hidden />
                    {resendError}
                  </div>
                )}

                <form onSubmit={handleResend} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="resend-email"
                      className="block text-xs font-semibold text-white/95 tracking-wide"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                        aria-hidden
                      />
                      <input
                        id="resend-email"
                        type="email"
                        required
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        placeholder="developer@swiftpy.org"
                        disabled={isResending}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white text-gray-900 placeholder:text-gray-400 rounded-xs border-0 outline-hidden focus:ring-2 focus:ring-secondary shadow-md transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <GradientButton
                    type="submit"
                    size="md"
                    rounded="sm"
                    disabled={isResending}
                    className="px-6 py-2.5 text-sm font-bold shadow-lg flex items-center gap-2"
                  >
                    {isResending ? (
                      <>
                        <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden />
                        Resending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" aria-hidden />
                        Resend verification email
                      </>
                    )}
                  </GradientButton>
                </form>
              </div>

              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="text-xs sm:text-sm text-white/85 hover:text-white hover:underline transition-colors"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-2 text-[11px] text-white/70 z-10">
        <p className="text-center sm:text-right">
          SwiftPY &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
