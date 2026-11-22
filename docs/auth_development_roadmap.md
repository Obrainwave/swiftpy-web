# Authentication Development Roadmap — SwiftPY Website

> **Reference plan:** [`auth_implementation_plan.md`](./auth_implementation_plan.md)
> **Last updated:** 2026-11-19

---

## Current State

| Area | Files present | Status |
|------|--------------|--------|
| Login page UI | `auth/login/page.tsx` | ✅ Fully wired to Zustand `login`, `isLoggingIn`, `returnTo`, error states & `lucide-react` icons |
| Forgot password page | `auth/forgot-password/page.tsx` | ✅ Full form with error/success feedback, `lucide-react` icons & generic security responses |
| Register page | `auth/register/page.tsx` | ✅ Full form matching cinematic design with validation, confirm password, field errors, redirect |
| Account verification | `auth/account-verification/page.tsx` | ✅ Token extraction from URL, auto-verify, error state, resend link form |
| Auth API layer | `auth/api/auth.api.ts` | ✅ All endpoint calls (`login`, `register`, `logout`, `refresh`, `getMe`, `forgotPassword`, `resetPassword`, `verifyAccount`, `resendVerification`) |
| Axios client | `api/api-client.ts` | ✅ Shared client with timeout, base URL & headers |
| Interceptor | `api/interceptor.ts` | ✅ Bearer injection, 401 interceptor, single-flight refresh queue, loop prevention (`_retry`) |
| Hooks | `auth/hooks/` | ✅ `useLogin`, `useRegister`, `useLogout`, `useAuth` fully typed & exported via `index.ts` |
| Zustand store | `auth/stores/auth.store.ts` | ✅ Central store with session init, login, register, logout, tokens & user state |
| Types | `auth/types/auth.types.ts` | ✅ Fully typed payload, response, user, and store interfaces |
| Guards | `auth/components/` | ✅ `GuestGuard`, `AdminGuard`, `AuthLoading` with no-flash protection |
| App Root session init | `app/components/AuthInitializer.tsx` | ✅ Mounted in root layout (`app/layout.tsx`) |
| Auth layout guard | `app/auth/layout.tsx` | ✅ Protected with `<GuestGuard>` |
| Admin layout guard | `app/admin/layout.tsx` | ✅ Protected with `<AdminGuard>` |
| Admin header logout | `admin/layouts/Header.tsx` | ✅ Logout action, spinner loading, profile initials |

---

## Roadmap

### Phase 1 — Foundation: Inspect & Contracts
**Goal:** Know exactly what the backend gives you before writing a single line of auth logic.

- [x] Read all backend auth routes and confirm endpoints, HTTP methods, payloads, and response shapes
- [x] Confirm token strategy: bearer header vs. `HttpOnly` cookie (Bearer tokens via `Authorization` header, refresh in body)
- [x] Confirm access token and refresh token lifetime (Access: 900s / 15m, Refresh: 604800s / 7d)
- [x] Confirm logout endpoint and whether it revokes the refresh token (POST `/auth/logout` blacklists JTI)
- [x] Confirm error response format (field names, status codes)
- [x] Confirm whether registration triggers immediate login or email verification
- [x] Document findings in API layer and contracts

**Output:** Verified API contract.

---

### Phase 2 — Axios & Interceptors
**Goal:** One shared Axios instance used by all API calls. 401s trigger a single refresh, never multiple.

**Files:**

| File | Task | Status |
|------|------|--------|
| `app/api/api-client.ts` | Create shared Axios instance with `baseURL`, `timeout`, `withCredentials` | [x] |
| `app/api/interceptor.ts` | Request interceptor: attach access token (if bearer). Response interceptor: catch 401, trigger single-flight refresh, queue concurrent requests, retry on success, clearAuth on failure | [x] |

**Checklist:**
- [x] Single Axios instance exported from `api-client.ts`
- [x] Request interceptor attaches token (or skips for cookie-based auth)
- [x] Response interceptor catches `401`
- [x] `isRefreshing` flag prevents multiple simultaneous refresh calls
- [x] Failed requests queue while refresh is in flight
- [x] On refresh success → flush queue → retry each request
- [x] On refresh failure → reject queue → clearAuth → redirect to login
- [x] Refresh endpoint itself is never retried on 401
- [x] `_retry` flag prevents an infinite retry loop

---

### Phase 3 — Types
**Goal:** Shared TypeScript types for the entire auth feature.

**File:** `auth/types/auth.types.ts`

- [x] `AuthUser` interface (`id`, `email`, `is_admin`, `name`, `username`, `phone`, etc.)
- [x] `LoginPayload` and `LoginResponse`
- [x] `RegisterPayload` and `RegisterResponse`
- [x] `ForgotPasswordPayload`, `ResetPasswordPayload`, `VerifyAccountPayload`, `ResendVerificationPayload`
- [x] `AuthStore` state and action interface

---

### Phase 4 — Zustand Auth Store
**Goal:** Single source of truth for all auth state.

**File:** `auth/stores/auth.store.ts`

**State:**
- [x] `user: AuthUser | null`
- [x] `accessToken: string | null`
- [x] `refreshToken: string | null`
- [x] `isAuthenticated: boolean`
- [x] `isInitialized: boolean`
- [x] `isLoading: boolean`
- [x] `isLoggingIn: boolean`
- [x] `isLoggingOut: boolean`
- [x] `isRefreshing: boolean`

**Actions:**
- [x] `initializeAuth()` — restores session on app boot (call once, guard against Strict Mode double-call)
- [x] `login(payload)` — calls API, sets user, sets tokens, sets `isAuthenticated`
- [x] `register(payload)` — calls API, sets state on auto-login
- [x] `logout()` — calls API, clears all state
- [x] `setUser(user)` — set/update authenticated user
- [x] `setTokens(access, refresh)` — update tokens
- [x] `clearAuth()` — reset all state to unauthenticated

**Rules:**
- [x] `isInitialized` is `false` until the first `initializeAuth()` resolves (success or failure)
- [x] No component reads auth state from localStorage directly
- [x] No duplicate auth state in other stores

---

### Phase 5 — Auth API Layer
**Goal:** All backend auth calls in one place, using the shared Axios instance.

**File:** `auth/api/auth.api.ts`

- [x] `loginApi(payload)` → POST `/auth/login`
- [x] `logoutApi()` → POST `/auth/logout`
- [x] `registerApi(payload)` → POST `/auth/register`
- [x] `refreshTokenApi(refreshToken)` → POST `/auth/refresh`
- [x] `getMeApi()` → GET `/auth/me`
- [x] `forgotPasswordApi(payload)` → POST `/auth/forgot-password`
- [x] `resetPasswordApi(payload)` → POST `/auth/reset-password`
- [x] `verifyAccountApi(payload)` → POST `/auth/verify`
- [x] `resendVerificationApi(payload)` → POST `/auth/resend-verification`

---

### Phase 6 — Auth Hooks
**Goal:** Lightweight hooks that expose store actions to components.

**Files:**

| Hook | Responsibility | Status |
|------|---------------|--------|
| `useLogin.ts` | Form state, call `authStore.login()`, handle errors, redirect on role / returnTo | [x] |
| `useRegister.ts` | Form state, client validation, call `authStore.register()`, handle 422 errors, redirect | [x] |
| `useLogout.ts` | Call `authStore.logout()`, redirect to login | [x] |
| `useAuth.ts` | Re-export `user`, `isAuthenticated`, `isAdmin`, `isInitialized`, `login`, `register`, `logout` | [x] |

- [x] `isAdmin` derived from `user?.is_admin`, not stored separately
- [x] Hooks do not duplicate store logic

---

### Phase 7 — Session Initialization
**Goal:** Restore the session on every page load/refresh without forcing re-login.

- [x] Create `AuthInitializer` component (`app/components/AuthInitializer.tsx`) mounted in `app/layout.tsx`
- [x] `initializeAuth` calls refresh endpoint with stored refresh token
- [x] On success: set user + `isAuthenticated = true` + `isInitialized = true`
- [x] On failure: clear state + `isInitialized = true`
- [x] Guards render `AuthLoading` until `isInitialized === true`

---

### Phase 8 — Guards
**Goal:** Reusable components that enforce access rules at the layout level.

**Files in `auth/components/`:**

#### `GuestGuard.tsx`
- [x] Blocks authenticated users from auth pages
- [x] Never renders the auth form before `isInitialized` resolves (no flash)
- [x] Admins redirected to `/admin`, non-admins to `/`

#### `AdminGuard.tsx`
- [x] Blocks unauthenticated users from `/admin/**` → redirects to `/auth/login?returnTo=...`
- [x] Blocks non-admins (`is_admin === false`) → redirects to unauthorized/home
- [x] Admins (`is_admin === true`) → allowed

#### `AuthLoading.tsx`
- [x] Neutral loading UI shown while `isInitialized === false`

---

### Phase 9 — Layout Wiring
**Goal:** Guards applied at the layout level so every nested route is protected automatically.

- [x] Wrapped `app/auth/layout.tsx` with `<GuestGuard>` — covers all `/auth/*` pages
- [x] Wrapped `app/admin/layout.tsx` with `<AdminGuard>` — covers all `/admin/**` pages
- [x] Added `<AuthInitializer />` to `app/layout.tsx` (root) so session init runs on every mount

---

### Phase 10 — Login Page: Wire to Real Backend
**Goal:** Replace the fake `setTimeout` in `login/page.tsx` with real auth logic.

- [x] Imported `useAuthStore` / `useLogin`
- [x] Real backend error message banner (`CircleAlert`)
- [x] Disabled submit while `isLoggingIn === true` with spinner
- [x] Password visibility toggle with `Eye` / `EyeOff` from `lucide-react`
- [x] Form inputs with `Mail`, `LockKeyhole` icons
- [x] Redirect on success: admin → `/admin`, non-admin → `/` (respecting valid `returnTo`)

---

### Phase 11 — Register Page
**Goal:** Build the register page from scratch in `auth/register/page.tsx`.

- [x] Created page matching cinematic theme and layout
- [x] Fields: Full Name, Email, Password, Confirm Password
- [x] `lucide-react` icons: `UserRound`, `Mail`, `LockKeyhole`, `Eye`, `EyeOff`
- [x] Field-level error validation messages from backend 422 response
- [x] Client password confirmation and minimum length validation
- [x] On success: auto-redirects or sends to `/auth/account-verification`

---

### Phase 12 — Forgot Password Page
**Goal:** Replace the stub in `auth/forgot-password/page.tsx` with a real form.

- [x] Form with Email input, validation, loading spinner
- [x] Calls `POST /auth/forgot-password`
- [x] On success: displays generic safe confirmation (does not confirm whether email exists)
- [x] `lucide-react` icons: `Mail`, `CircleCheck`, `CircleAlert`, `ArrowLeft`
- [x] Link back to login

---

### Phase 13 — Account Verification Page
**Goal:** Create `auth/account-verification/page.tsx`.

- [x] Created `auth/account-verification/page.tsx`
- [x] Reads `token` from search params on mount
- [x] Auto-submits verification to `POST /auth/verify`
- [x] Displays success / error states
- [x] Includes resend verification link form calling `POST /auth/resend-verification`

---

### Phase 14 — Logout
**Goal:** Wire logout throughout the app.

- [x] Added logout button to admin header (`app/admin/layouts/Header.tsx`)
- [x] Connected to `useLogout` hook
- [x] Spinner loading state while `isLoggingOut === true`
- [x] Even if backend call fails: local state and storage cleared, redirect to `/auth/login`
- [x] User initials dynamically computed from authenticated user name

---

### Phase 15 — `returnTo` Redirect Support
**Goal:** Return users to the page they were trying to reach after login.

- [x] `AdminGuard` preserves destination: `/auth/login?returnTo=${encodeURIComponent(pathname)}`
- [x] Login page inspects `returnTo`
- [x] Validates same-origin: starts with `/`, does not start with `//`, does not loop back to `/auth`
- [x] Falls back to role-based default when `returnTo` is absent or invalid

---

### Phase 16 — Regression & Security Testing
**Goal:** Verify every scenario from the implementation plan before marking complete.

- [x] No TypeScript errors (`npx tsc --noEmit` passed with 0 errors)
- [x] No ESLint errors (`npm run lint` passed with 0 errors, 0 warnings)
- [x] Next.js production build passes (`npm run build` compiled all 12 routes successfully)

---

## File Checklist Summary

| File | Action | Phase | Status |
|------|--------|-------|--------|
| `app/api/api-client.ts` | Shared Axios instance | 2 | ✅ Complete |
| `app/api/interceptor.ts` | Request/response/refresh interceptors | 2 | ✅ Complete |
| `auth/types/auth.types.ts` | All auth types & interfaces | 3 | ✅ Complete |
| `auth/stores/auth.store.ts` | Zustand store with session init & tokens | 4 | ✅ Complete |
| `auth/api/auth.api.ts` | All endpoint functions | 5 | ✅ Complete |
| `auth/hooks/useLogin.ts` | Login hook | 6 | ✅ Complete |
| `auth/hooks/useRegister.ts` | Register hook | 6 | ✅ Complete |
| `auth/hooks/useLogout.ts` | Logout hook | 6 | ✅ Complete |
| `auth/hooks/useAuth.ts` | Primary auth state hook | 6 | ✅ Complete |
| `auth/components/GuestGuard.tsx` | Protects auth routes from auth users | 8 | ✅ Complete |
| `auth/components/AdminGuard.tsx` | Protects `/admin/**` from non-admins | 8 | ✅ Complete |
| `auth/components/AuthLoading.tsx` | Neutral loading indicator | 8 | ✅ Complete |
| `app/layout.tsx` | Root layout with `AuthInitializer` | 9 | ✅ Complete |
| `app/auth/layout.tsx` | Layout wrapped in `GuestGuard` | 9 | ✅ Complete |
| `app/admin/layout.tsx` | Layout wrapped in `AdminGuard` | 9 | ✅ Complete |
| `auth/login/page.tsx` | Full login form wired to backend | 10 | ✅ Complete |
| `auth/register/page.tsx` | Full register form with validation | 11 | ✅ Complete |
| `auth/forgot-password/page.tsx` | Full forgot password form | 12 | ✅ Complete |
| `auth/account-verification/page.tsx` | Account verification & resend form | 13 | ✅ Complete |
| `admin/layouts/Header.tsx` | Logout action and avatar initials | 14 | ✅ Complete |
