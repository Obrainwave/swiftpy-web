"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, LockKeyhole, CircleAlert, LoaderCircle } from "lucide-react";
import { GradientButton } from "../../components/utils/GradientButton";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  ArrowRightIcon,
} from "../../components/utils/Icons";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const { email, setEmail, password, setPassword, error, isLoggingIn, handleSubmit } =
    useLogin();
  const [showPassword, setShowPassword] = useState(false);

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
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-12 py-8 flex items-center z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Welcome Back Banner & Socials */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black text-white tracking-tight leading-[0.98] drop-shadow-md">
              Welcome <br />
              Back
            </h1>

            <p className="text-sm sm:text-base text-white/85 max-w-md font-normal leading-relaxed drop-shadow-xs">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The point
              of using SwiftPY is to build high-performance web applications with confidence.
            </p>

            {/* Social Icons Row */}
            <div className="pt-2 flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-xs transition-all duration-150 cursor-pointer">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-xs transition-all duration-150 cursor-pointer">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-xs transition-all duration-150 cursor-pointer">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-xs transition-all duration-150 cursor-pointer">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Sign in Form Card */}
          <div className="lg:col-span-5 w-full max-w-md lg:max-w-none">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-xs">
                Sign in
              </h2>

              {/* Error banner */}
              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2 px-4 py-3 rounded-sm bg-red-500/20 border border-red-400/40 text-red-200 text-sm"
                >
                  <CircleAlert className="w-4 h-4 shrink-0" aria-hidden />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Address */}
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
                      disabled={isLoggingIn}
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white text-gray-900 placeholder:text-gray-400 rounded-xs border-0 outline-hidden focus:ring-2 focus:ring-secondary shadow-md transition-all disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold text-white/95 tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      disabled={isLoggingIn}
                      className="w-full pl-9 pr-10 py-2.5 text-sm bg-white text-gray-900 placeholder:text-gray-400 rounded-xs border-0 outline-hidden focus:ring-2 focus:ring-secondary shadow-md transition-all disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4" aria-hidden />
                        : <Eye className="w-4 h-4" aria-hidden />}
                    </button>
                  </div>
                </div>

                {/* Gradient Submit Button */}
                <div className="pt-2">
                  <GradientButton
                    type="submit"
                    size="md"
                    rounded="sm"
                    disabled={isLoggingIn}
                    className="flex-row px-7 py-2.5 text-sm font-bold shadow-lg flex items-center gap-2"
                  >
                    {isLoggingIn ? (
                      <div className="flex items-center justify-center gap-1">
                        <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign in now"
                    )}
                  </GradientButton>
                </div>

                {/* Lost Password Link */}
                <div className="pt-1">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs sm:text-sm text-white/85 hover:text-white hover:underline transition-colors"
                  >
                    Lost your password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Legal Terms */}
      <footer className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-2 text-[11px] text-white/70 z-10">
        <p className="text-center sm:text-right">
          By clicking on &ldquo;Sign in now&rdquo; you agree to{" "}
          <Link href="/terms" className="underline hover:text-white">
            Terms of Service
          </Link>{" "}
          |{" "}
          <Link href="/privacy" className="underline hover:text-white">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
