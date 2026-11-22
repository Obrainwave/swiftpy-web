// ─── User ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  is_admin: boolean;
  address?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// ─── Auth API payloads ────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type LogoutResponse = null;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  username?: string;
  phone?: string;
}

export interface RegisterResponse {
  message?: string;
  user?: AuthUser;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  password_confirmation?: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyAccountPayload {
  token: string;
}

export interface VerifyAccountResponse {
  message: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

// ─── Zustand store shape ──────────────────────────────────────────────────────

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface AuthActions {
  setSession: (user: AuthUser, access: string, refresh: string) => void;
  setInitialized: (initialized: boolean) => void;
  setUser: (user: AuthUser) => void;
  setTokens: (access: string, refresh: string) => void;
  clearAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;
