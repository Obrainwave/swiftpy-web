"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "../stores/auth.store";
import AuthLoading from "./AuthLoading";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard — protects all /admin/** routes.
 *
 * Behavior:
 *  - isInitialized false         → show neutral loading
 *  - not authenticated           → redirect to /auth/login?returnTo=<path>
 *  - authenticated, not admin    → redirect to / (unauthorized)
 *  - authenticated admin         → render children
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAdmin = user?.is_admin ?? false;

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      const returnTo = encodeURIComponent(pathname);
      router.replace(`/auth/login?returnTo=${returnTo}`);
      return;
    }

    if (!isAdmin) {
      router.replace("/");
    }
  }, [isAuthenticated, isAdmin, isInitialized, pathname, router]);

  if (!isInitialized) return <AuthLoading />;
  if (!isAuthenticated) return <AuthLoading />;
  if (!isAdmin) return <AuthLoading />;

  return <>{children}</>;
}
