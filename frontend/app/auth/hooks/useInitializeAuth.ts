"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { refreshTokenApi } from "../api/auth.api";
import useAuthStore from "../stores/auth.store";
import type { AuthUser } from "../types/auth.types";

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

        if (!refreshToken || !storedUser) return;

        const user = JSON.parse(storedUser) as AuthUser;
        const tokens = await refreshSession(refreshToken);
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
