"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { refreshTokenApi } from "../api/auth.api";
import useAuthStore from "../stores/auth.store";
import type { AuthUser } from "../types/auth.types";

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== "object" || value === null) return false;

  const user = value as Record<string, unknown>;
  return (
    typeof user.id === "number" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.is_admin === "boolean"
  );
}

export const useInitializeAuth = (): void => {
  const initialized = useRef(false);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const setSession = useAuthStore((s) => s.setSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const { mutateAsync: refreshSession } = useMutation({
    mutationFn: refreshTokenApi,
  });

  useEffect(() => {
    if (initialized.current || isInitialized) return;
    initialized.current = true;

    const initialize = async (): Promise<void> => {
      try {
        const refreshToken = localStorage.getItem("swiftpy_refresh_token");
        const storedUser = localStorage.getItem("swiftpy_user");

        if (!refreshToken) return;

        const cachedUser: unknown = storedUser ? JSON.parse(storedUser) : null;
        const tokens = await refreshSession(refreshToken);
        const user =
          tokens.user && isAuthUser(tokens.user)
            ? tokens.user
            : isAuthUser(cachedUser)
              ? cachedUser
              : null;

        if (!user) throw new Error("Unable to restore the authenticated user.");

        setSession(user, tokens.access_token, tokens.refresh_token);
      } catch {
        clearAuth();
      } finally {
        setInitialized(true);
      }
    };

    void initialize();
  }, [
    clearAuth,
    isInitialized,
    refreshSession,
    setInitialized,
    setSession,
  ]);
};
