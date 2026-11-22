import { create } from "zustand";
import type { AuthStore } from "../types/auth.types";

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,

  setSession: (user, accessToken, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("swiftpy_refresh_token", refreshToken);
      localStorage.setItem("swiftpy_user", JSON.stringify(user));
    }

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  setInitialized: (isInitialized) => set({ isInitialized }),

  setUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("swiftpy_user", JSON.stringify(user));
    }
    set({ user });
  },

  setTokens: (accessToken, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("swiftpy_refresh_token", refreshToken);
    }
    set({ accessToken, refreshToken });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("swiftpy_refresh_token");
      localStorage.removeItem("swiftpy_user");
    }
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));

/**
 * Synchronous getter for use outside React (e.g. Axios interceptors).
 * Never call this inside a component — use the hook instead.
 */
export const getAuthStore = () => useAuthStore.getState();

export default useAuthStore;
