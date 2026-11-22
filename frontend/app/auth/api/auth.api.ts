/**
 * Auth API — all authentication endpoint calls.
 * Uses the shared Axios instance with interceptors attached.
 */
import apiClient from "../../api/interceptor";
import type {
  LoginPayload,
  LoginResponse,
  RefreshResponse,
  LogoutResponse,
  RegisterPayload,
  RegisterResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyAccountPayload,
  VerifyAccountResponse,
  ResendVerificationPayload,
  ResendVerificationResponse,
  AuthUser,
  ApiResponse,
} from "../types/auth.types";

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    "/api/auth/login",
    payload
  );
  return data.data;
}

// ─── Register ─────────────────────────────────────────────────────────────────

export async function registerApi(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await apiClient.post<ApiResponse<RegisterResponse>>(
    "/api/auth/register",
    payload
  );
  return data.data;
}

// ─── Refresh ──────────────────────────────────────────────────────────────────

export async function refreshTokenApi(refreshToken: string): Promise<RefreshResponse> {
  const { data } = await apiClient.post<ApiResponse<RefreshResponse>>(
    "/api/auth/refresh",
    { refresh_token: refreshToken }
  );
  return data.data;
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutApi(): Promise<LogoutResponse> {
  const { data } = await apiClient.post<ApiResponse<LogoutResponse>>(
    "/account/logout"
  );
  return data.data;
}

// ─── Current User ─────────────────────────────────────────────────────────────

export async function getMeApi(): Promise<AuthUser> {
  const { data } = await apiClient.get<ApiResponse<AuthUser>>(
    "/account/profile"
  );
  return data.data;
}

// ─── Password Recovery ────────────────────────────────────────────────────────

export async function forgotPasswordApi(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  const { data } = await apiClient.post<ApiResponse<ForgotPasswordResponse>>(
    "/auth/forgot-password",
    payload
  );
  return data.data;
}

export async function resetPasswordApi(
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  const { data } = await apiClient.post<ApiResponse<ResetPasswordResponse>>(
    "/auth/reset-password",
    payload
  );
  return data.data;
}

// ─── Account Verification ─────────────────────────────────────────────────────

export async function verifyAccountApi(
  payload: VerifyAccountPayload
): Promise<VerifyAccountResponse> {
  const { data } = await apiClient.post<ApiResponse<VerifyAccountResponse>>(
    "/auth/verify",
    payload
  );
  return data.data;
}

export async function resendVerificationApi(
  payload: ResendVerificationPayload
): Promise<ResendVerificationResponse> {
  const { data } = await apiClient.post<ApiResponse<ResendVerificationResponse>>(
    "/auth/resend-verification",
    payload
  );
  return data.data;
}
