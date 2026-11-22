import axios from "axios";

/**
 * Shared Axios instance for all backend API requests.
 * Base URL is read from NEXT_PUBLIC_API_URL (required).
 *
 * Token strategy: Bearer access token in Authorization header.
 * Refresh token is stored in Zustand and sent in the request body
 * to POST /auth/refresh.
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/v1",
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // tokens are managed client-side (bearer)
});

export default apiClient;
