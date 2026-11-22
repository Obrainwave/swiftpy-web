# Auth Flow Plan — SwiftPY Website

> Derived from [`auth_implementation_plan.md`](./auth_implementation_plan.md)

---

## Overview

This document visualizes every authentication flow as step-by-step sequences and decision diagrams. Use it alongside the implementation plan as a living reference during development and code review.

---

## 1. App Boot — Session Initialization

```mermaid
flowchart TD
    A([App Mounts]) --> B[Call initializeAuth]
    B --> C{Already initializing?\nStrict-mode guard}
    C -- Yes --> Z1([Skip — no-op])
    C -- No --> D[Set isLoading = true]
    D --> E[Call GET /auth/refresh or /auth/me]
    E --> F{Response}
    F -- 200 OK --> G[Set user in Zustand\nisAuthenticated = true\nisInitialized = true]
    F -- 401 / Network Error --> H[clearAuth\nisAuthenticated = false\nisInitialized = true]
    G --> I([App renders — guards can decide])
    H --> I
```

> [!IMPORTANT]
> `isInitialized` must be `true` before any guard makes a redirect decision. Guards render a neutral loading UI while `isInitialized === false`.

---

## 2. Login Flow

```mermaid
flowchart TD
    A([User submits login form]) --> B{Fields valid?}
    B -- No --> C[Show inline validation errors]
    C --> A
    B -- Yes --> D[Disable submit — set isLoggingIn = true]
    D --> E[POST /auth/login — email + password]
    E --> F{Response}
    F -- 401 / 422 --> G[Display backend error message\nisLoggingIn = false]
    G --> A
    F -- 200 OK --> H[Store access token\nSet user in Zustand\nisAuthenticated = true]
    H --> I{user.is_admin?}
    I -- true --> J[Redirect to /admin]
    I -- false --> K{returnTo param\nvalid and same-origin?}
    K -- Yes --> L[Redirect to returnTo]
    K -- No --> M[Redirect to /default-home]
```

> [!NOTE]
> `is_admin` is read from the backend-verified user object — never from a form field, query parameter, or client guess.

---

## 3. Register Flow

```mermaid
flowchart TD
    A([User submits register form]) --> B{Fields valid?}
    B -- No --> C[Show validation errors]
    C --> A
    B -- Yes --> D[Disable submit — show loader]
    D --> E[POST /auth/register]
    E --> F{Response}
    F -- 422 Validation error --> G[Display field errors\nRe-enable form]
    G --> A
    F -- 201 Created --> H{Auto-login or\nverification required?}
    H -- Auto-login --> I[Set user in Zustand\nRedirect to /default-home or /admin]
    H -- Email verification --> J[Redirect to /auth/account-verification\nShow instructions]
```

---

## 4. Forgot Password Flow

```mermaid
flowchart TD
    A([User enters email]) --> B[POST /auth/forgot-password]
    B --> C{Response}
    C -- Success 200 --> D[Show success message\nDo not confirm email existence]
    C -- Error --> E[Show generic error\nDo not reveal user existence]
    D --> F([User checks email])
    F --> G[User clicks reset link]
    G --> H["POST /auth/reset-password\ntoken + new password"]
    H --> I{Response}
    I -- 200 OK --> J[Redirect to /auth/login\nShow success toast]
    I -- 400 / Expired --> K[Show error — request new link]
```

---

## 5. Account Verification Flow

```mermaid
flowchart TD
    A([User clicks verification email link]) --> B[Extract token from URL params]
    B --> C[POST /auth/verify — token]
    C --> D{Response}
    D -- 200 OK --> E[Show success\nRedirect to /auth/login]
    D -- 400 / Expired --> F[Show error message]
    F --> G{User wants\nnew link?}
    G -- Yes --> H[POST /auth/resend-verification]
    H --> I[Show confirmation — check email]
    G -- No --> J([Stay on page])
```

---

## 6. Token Refresh & 401 Interceptor (Single-Flight)

```mermaid
flowchart TD
    A([API request fails with 401]) --> B{Is this the\nrefresh endpoint?}
    B -- Yes --> C[Do NOT retry\nclearAuth and redirect /auth/login]
    B -- No --> D{Already refreshing?}
    D -- Yes --> E[Queue this request\nwait for refresh result]
    D -- No --> F[Set isRefreshing = true\nStore refresh promise]
    F --> G[POST /auth/refresh]
    G --> H{Response}
    H -- 200 OK --> I[Store new access token\nFlush queue — retry all\nisRefreshing = false]
    H -- 401 / Error --> J[Reject entire queue\nclearAuth\nRedirect to /auth/login\nisRefreshing = false]
    E --> K{Refresh resolved}
    K -- Success --> L[Retry original request]
    K -- Failure --> M[Reject original request]
    I --> L
```

> [!CAUTION]
> Never retry a request more than once after a 401. Mark retried requests with `_retry = true` to prevent infinite loops.

---

## 7. Logout Flow

```mermaid
flowchart TD
    A([User clicks Logout]) --> B[Set isLoggingOut = true]
    B --> C[POST /auth/logout]
    C --> D{Response}
    D -- Success --> E[Backend revokes refresh token]
    D -- Network error --> F[Continue local logout anyway]
    E --> G[clearAuth in Zustand\nDelete access token\nClear user-specific cache]
    F --> G
    G --> H[Redirect to /auth/login]
    H --> I{User presses\nbrowser Back?}
    I -- Yes --> J[Guard detects isAuthenticated = false\nRedirect back to /auth/login]
```

> [!WARNING]
> Even if the backend logout call fails, the frontend MUST clear all local auth state. Never leave a user appearing authenticated after they initiate logout.

---

## 8. GuestGuard — Auth Page Protection

```mermaid
flowchart TD
    A(["User navigates to /auth/* page"]) --> B{isInitialized?}
    B -- false --> C[Render neutral loading UI\nDo not render auth form]
    C --> B
    B -- true --> D{isAuthenticated?}
    D -- false --> E[Render auth page normally]
    D -- true --> F{user.is_admin?}
    F -- true --> G[Redirect to /admin]
    F -- false --> H[Redirect to /default-home]
```

**Pages covered by GuestGuard:**
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/account-verification`
- `/auth/reset-password`
- `/auth/resend-verification`

> [!IMPORTANT]
> The auth form must **never flash** before a redirect. The guard must hold render until `isInitialized === true`.

---

## 9. AuthGuard / AdminGuard — Admin Route Protection

```mermaid
flowchart TD
    A(["User navigates to /admin/*"]) --> B{isInitialized?}
    B -- false --> C[Render neutral loading UI]
    C --> B
    B -- true --> D{isAuthenticated?}
    D -- false --> E["Redirect to /auth/login\nPreserve returnTo param"]
    D -- true --> F{"user.is_admin === true?"}
    F -- false --> G[Redirect to /unauthorized\nor /default-home]
    F -- true --> H[Render admin page]
```

**Admin routes covered:**
- `/admin` (dashboard)
- `/admin/docs`
- `/admin/settings`
- `/admin/api`
- All nested `/admin/**` routes

---

## 10. returnTo Redirect Handling

```mermaid
flowchart TD
    A([Unauthenticated user hits protected route]) --> B[Guard captures current URL as returnTo]
    B --> C["Redirect to /auth/login?returnTo=encoded-url"]
    C --> D([User logs in successfully])
    D --> E{returnTo param present\nand valid?}
    E -- No --> F{is_admin?}
    E -- Yes --> G{"URL is same-origin\nand not an auth page?"}
    G -- No --> F
    G -- Yes --> H[Redirect to returnTo]
    F -- true --> I[Redirect to /admin]
    F -- false --> J[Redirect to /default-home]
```

> [!CAUTION]
> Always validate `returnTo` to prevent open redirects. Only allow same-origin paths. Reject any URL starting with `http://`, `https://`, or `//`.

---

## 11. Zustand Auth Store — State Machine

```mermaid
stateDiagram-v2
    [*] --> Uninitialized : App mounts

    Uninitialized --> Initializing : initializeAuth()
    Initializing --> Authenticated : Session restored (200)
    Initializing --> Unauthenticated : No session / error

    Unauthenticated --> LoggingIn : login()
    LoggingIn --> Authenticated : Login success
    LoggingIn --> Unauthenticated : Login failure

    Authenticated --> LoggingOut : logout()
    LoggingOut --> Unauthenticated : Logout complete

    Authenticated --> Refreshing : 401 triggers refresh
    Refreshing --> Authenticated : Refresh success
    Refreshing --> Unauthenticated : Refresh failure — clearAuth
```

---

## 12. Component & Layer Dependency Map

```mermaid
flowchart LR
    UI["UI Pages\nlogin / register / etc."]
    Hooks["Hooks\nuseLogin · useLogout\nuseRegister · useAuth"]
    Store["Zustand Store\nauth.store.ts"]
    API["Auth API\nauth.api.ts"]
    Axios["Shared Axios\napi-client.ts"]
    Interceptor["Interceptors\ninterceptor.ts"]
    Backend["Backend API"]

    UI --> Hooks
    Hooks --> Store
    Hooks --> API
    API --> Axios
    Axios --> Interceptor
    Interceptor --> Backend
    Interceptor -->|"401 triggers refresh"| Store
    Store -->|"user / isAuthenticated"| UI
```

---

## 13. Guards & Layout Hierarchy

```mermaid
flowchart TD
    RootLayout["Root Layout\napp/layout.tsx"]
    AuthInit["AuthInitializer\ninitializeAuth on mount"]
    GuestLayout["Auth Layout\napp/auth/layout.tsx\nWrapped in GuestGuard"]
    AdminLayout["Admin Layout\napp/admin/layout.tsx\nWrapped in AdminGuard"]
    AuthPages["Auth Pages\nlogin · register\nforgot-password · verify"]
    AdminPages["Admin Pages\ndashboard · docs\nsettings · api"]

    RootLayout --> AuthInit
    RootLayout --> GuestLayout
    RootLayout --> AdminLayout
    GuestLayout --> AuthPages
    AdminLayout --> AdminPages
```

---

## 14. Test Scenario Checklist

| # | Scenario | Expected Result | Phase |
|---|----------|----------------|-------|
| 1 | Valid login — non-admin | Redirect to default home | 7 |
| 2 | Valid login — admin | Redirect to `/admin` | 7 |
| 3 | Invalid credentials | Show error, no redirect | 7 |
| 4 | Duplicate submit | Second submit blocked | 7 |
| 5 | Authenticated user visits `/auth/login` | Redirect away, no form flash | 5 |
| 6 | Authenticated user visits `/auth/register` | Redirect away | 5 |
| 7 | Unauthenticated user visits `/admin` | Redirect to login with `returnTo` | 6 |
| 8 | Non-admin visits `/admin` | Redirect to unauthorized | 6 |
| 9 | Admin visits `/admin/settings` directly | Access granted | 6 |
| 10 | Expired access token mid-session | Refresh triggered, request retried | 2 |
| 11 | Two concurrent 401s | Only one refresh request fired | 2 |
| 12 | Refresh token expired | clearAuth → redirect to login | 2 |
| 13 | Logout — API available | Backend revokes token, state cleared | 7 |
| 14 | Logout — API down | State cleared anyway, redirect to login | 7 |
| 15 | Page reload while authenticated | Session restored via refresh endpoint | 4 |
| 16 | Page reload while unauthenticated | Clean unauthenticated state | 4 |
| 17 | Register with duplicate email | Backend 422 displayed | 7 |
| 18 | Verification link expired | Show error + resend option | — |
| 19 | Open redirect via `returnTo` | Blocked — safe default used | 7 |
| 20 | No TypeScript/lint errors | Build passes | 8 |

---

## 15. Implementation Phase Summary

| Phase | Deliverable | Key Files |
|-------|------------|-----------|
| **1** | Inspect & findings report | _(read-only)_ |
| **2** | Axios + interceptors + single-flight refresh | `api/api-client.ts`, `api/interceptor.ts` |
| **3** | Zustand auth store | `auth/stores/auth.store.ts` |
| **4** | Session restoration on boot | `auth/stores/auth.store.ts` → `initializeAuth` |
| **5** | GuestGuard | `auth/components/GuestGuard.tsx`, `auth/layout.tsx` |
| **6** | AdminGuard | `auth/components/AuthGuard.tsx`, `admin/layout.tsx` |
| **7** | Login · Logout UI wired | `auth/hooks/useLogin.ts`, `useLogout.ts`, login page |
| **8** | Regression & security testing | All flows |
