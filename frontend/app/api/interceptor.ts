import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import apiClient from "./api-client";
import useAuthStore from "../auth/stores/auth.store";
import type { ApiResponse, RefreshResponse } from "../auth/types/auth.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

// Extend the config type so we can mark a request as already retried.
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ─── Single-flight refresh state ──────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || token === null) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

function isAdminClaimDenied(error: AxiosError): boolean {
  if (error.response?.status !== 403) return false;

  const body = error.response.data;
  if (typeof body !== "object" || body === null) return false;

  const responseBody = body as Record<string, unknown>;
  const message = responseBody.message ?? responseBody.detail;
  return (
    typeof message === "string" &&
    message.includes("Administrator access required")
  );
}

// ─── Request interceptor — attach access token ────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle 401 / trigger refresh ─────────────────────

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const isAdminPermissionError = isAdminClaimDenied(error);

    // Refresh on expired access tokens and the backend's explicit stale-admin-claim response.
    if (
      !error.response ||
      (error.response.status !== 401 && !isAdminPermissionError) ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    if (isAdminPermissionError && !useAuthStore.getState().refreshToken) {
      return Promise.reject(error);
    }

    // Never retry the refresh endpoint itself — that would loop.
    if (originalRequest.url?.includes("/auth/refresh")) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }

    // Prevent retrying the same request more than once.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another refresh is already in flight — queue this request.
      originalRequest._retry = true;
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            }
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    // Start a new refresh.
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const store = useAuthStore.getState();
      const refreshToken = store.refreshToken;

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Call the refresh endpoint directly (bypass the interceptor loop).
      const { data: response } = await apiClient.post<ApiResponse<RefreshResponse>>(
        "/api/auth/refresh",
        { refresh_token: refreshToken }
      );

      const newAccess = response.data.access_token;
      const newRefresh = response.data.refresh_token;

      store.setSession(response.data.user, newAccess, newRefresh);

      // Retry all queued requests with the new token.
      processQueue(null, newAccess);

      // Retry the original request.
      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      useAuthStore.getState().clearAuth();

      if (typeof window !== "undefined") {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/auth/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
