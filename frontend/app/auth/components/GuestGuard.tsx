"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../stores/auth.store";
import AuthLoading from "./AuthLoading";

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * GuestGuard — blocks authenticated users from accessing auth pages.
 *
 * Behavior:
 *  - isInitialized false  → show neutral loading (never flash the form)
 *  - unauthenticated      → render children (the auth page)
 *  - authenticated admin  → redirect to /admin
 *  - authenticated user   → redirect to /
 */
export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAdmin = user?.is_admin ?? false;

  useEffect(() => {
    if (!isInitialized) return;
    if (isAuthenticated) {
      router.replace(isAdmin ? "/admin" : "/");
    }
  }, [isAuthenticated, isAdmin, isInitialized, router]);

  if (!isInitialized) return <AuthLoading />;
  if (isAuthenticated) return <AuthLoading />; // show loader while redirect happens

  return <>{children}</>;
}
