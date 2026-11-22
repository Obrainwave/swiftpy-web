"use client";

import React from "react";
import GuestGuard from "./components/GuestGuard";

/**
 * Auth layout — wraps all /auth/* pages with GuestGuard.
 * Authenticated users are redirected away before the page renders.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GuestGuard>{children}</GuestGuard>;
}
