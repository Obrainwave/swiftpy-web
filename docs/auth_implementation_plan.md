# **Implementation Plan: Frontend Authentication & Admin Access — SwiftPY Website**

## **Objective**

Implement a complete, production-conscious authentication flow in the Next.js frontend using **Axios, Zustand, and lucide-react**, following the existing directory structure rather than introducing a new architecture.

The implementation must cover:

- Login
- Register
- Forgot password
- Account verification
- Authenticated user state persistence
- Access restriction for authentication pages when already logged in
- Admin detection using `is_admin`
- Redirecting admins to the admin dashboard
- Token refresh and session recovery
- Logout
- Protected admin routes
- Loading, error, and session-expiration states

The AI agent must inspect the existing frontend and backend API contracts before implementation. It must reuse existing conventions and avoid unnecessarily restructuring the application.

## **1. Existing frontend structure**

Follow the structure already present in the project.

Keep the current app structure. Do not create a second authentication architecture.

```
src/
└── app/
    ├── admin/
    │   ├── api/
    │   ├── components/
    │   ├── docs/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── settings/
    │   ├── layout.tsx
    │   └── page.tsx
    │
    ├── api/
    │   └── interceptor.ts
    │
    └── auth/
        ├── api/
        ├── components/
        ├── forgot-password/
        ├── hooks/
        ├── login/
        ├── register/
        ├── stores/
        └── types/
```

Use the existing `auth` directory as the central authentication feature. Extend the existing `api/interceptor.ts` rather than duplicating Axios configuration.

## **2. Proposed authentication architecture**

Keep authentication responsibilities separated into API communication, state management, hooks, types, and UI.

```
src/app/
├── api/
│   ├── api-client.ts                  # Shared Axios instance
│   └── interceptor.ts             # Request/response interceptors
│
└── auth/
    ├── api/
    │   └── auth.api.ts            # Auth endpoint calls
    │
    ├── components/
    │   ├── AuthGuard.tsx
    │   ├── GuestGuard.tsx
    │   └── AuthLoading.tsx
    │
    ├── hooks/
    │   ├── useLogin.ts
    |   ├── useLogout.ts
    │   └── useRegister.ts
    │
    ├── stores/
    │   └── auth.store.ts           # Zustand auth state
    │
    ├── types/
    │   └── auth.types.ts
    │
    ├── login/
    ├── register/
    ├── forgot-password/
    ├── account-verification/
    └── ...
```

This is a proposed extension to the existing structure. The agent must inspect what already exists and adapt to it instead of blindly creating duplicate files.

## **3. Backend API contract discovery**

Before writing implementation code, inspect the existing backend authentication endpoints, response structures, validation errors, and token mechanism.

Confirm the following:

| Requirement      | Must establish                                   |
| ---------------- | ------------------------------------------------ |
| Login            | HTTP method, endpoint, payload, response         |
| Current user     | Endpoint for retrieving authenticated user       |
| User structure   | Fields, including `is_admin`                     |
| Access token     | Where issued and how it is sent                  |
| Refresh token    | Where issued, how stored, how renewed            |
| Refresh endpoint | Request format and response                      |
| Logout           | Endpoint, token invalidation, refresh revocation |
| Register         | Request/response and post-registration state     |
| Forgot password  | Endpoint and expected response                   |
| Verification     | Endpoint and required parameters                 |
| Error response   | Backend validation/error format                  |
| Token expiry     | Access and refresh token lifetime                |

Do not assume endpoint URLs or request fields. Use the actual backend implementation.

The user object must expose at minimum the relevant fields in a correctly typed structure:

```
export interface AuthUser {
    id: number | string;
    name?: string;
    email: string;
    is_admin: boolean;
    // Preserve additional fields from the existing backend contract.
}
```

Adapt this type to the real API response.

## **4. Zustand authentication store**

Create or extend the central Zustand auth store.

### **State**

The store should manage:

- `user`
- `isAuthenticated`
- `isLoading`
- `isInitialized`
- `isLoggingIn`
- `isLoggingOut`
- `isRefreshing`
- Authentication initialization/session restoration state

### **Actions**

Implement:

- `login()`
- `logout()`
- `setUser()`
- `initializeAuth()`
- `refreshSession()` or equivalent centralized refresh behavior
- `clearAuth()`
- `setLoading()` where appropriate

### **Rules**

1. The store must be the single source of truth for frontend authentication state.
2. Components must not independently determine authentication by checking local storage.
3. Avoid storing duplicate user/auth state in multiple stores.
4. Do not allow concurrent refresh operations to create multiple refresh requests.
5. Authentication initialization must run only once per intended lifecycle, with protection against React Strict Mode duplicate initialization.
6. `isInitialized` must prevent guards from making redirect decisions before session restoration is complete.
7. All auth state transitions must be predictable and centralized.

Use Zustand selectors so components only subscribe to the state they need.

## **5. Axios configuration and interceptors**

Use a shared Axios instance for all backend communication.

### **Axios instance**

Configure:

- Backend base URL from the existing environment configuration.
- Appropriate request timeout.
- JSON headers where applicable.
- Cookie credentials (`withCredentials`) if the backend authentication mechanism relies on cookies.
- Consistent error handling.

Do not create a new Axios instance in every API file.

### **Request interceptor**

The request interceptor should:

- Attach the access token if the backend uses bearer-token authentication.
- Avoid attaching tokens to public requests unnecessarily.
- Handle cookie-based authentication correctly if tokens are not exposed to the frontend.

### **Response interceptor**

Handle authentication-related errors, particularly `401 Unauthorized`.

### **Refresh concurrency**

Implement a single-flight refresh mechanism:

- Only one refresh request may run at a time.
- Concurrent failed requests must wait for the same refresh result.
- On successful refresh, queued requests retry with the renewed credentials.
- On failed refresh, reject all queued requests, clear the session and redirect appropriately.
- Prevent an infinite retry loop.
- Never attempt to refresh the refresh endpoint itself.
- Never retry the same request indefinitely after another `401`.

Keep the interceptor implementation in the existing `src/app/api/interceptor.ts` if that is already the intended entry point.

## **6. Token storage and security**

The AI agent must inspect how the backend issues and validates tokens before deciding how the frontend handles them.

**Preferred approach where supported by the backend:**

- Access token: short-lived.
- Refresh token: secure, `HttpOnly`, `Secure`, appropriately configured `SameSite` cookie.
- Refresh token must not be accessible to JavaScript.
- Avoid storing refresh tokens in `localStorage` or `sessionStorage`.
- If bearer access tokens must be managed client-side, minimize their persistence and exposure.
- Never log tokens or authentication credentials.
- Logout must revoke/invalidate refresh credentials on the backend if supported.
- Cookie-based refresh requests must use the correct credentials and CSRF protections for the backend's configuration.

If the existing backend uses a different token strategy, implement according to that contract while avoiding unnecessary security regressions.

## **7. Login flow**

Implement the login form using the existing login page, components and hooks.

### **Login requirements**

- Validate required fields before submission.
- Disable the submit button while the request is processing.
- Show a loading state.
- Display backend validation errors appropriately.
- Prevent duplicate submissions.
- On successful login, store the authenticated user in Zustand.
- Update the authentication state immediately.
- Redirect based on the authenticated user's `is_admin` field.

### **Redirect rules**

| User                        | Redirect destination                                   |
| --------------------------- | ------------------------------------------------------ |
| Admin (`is_admin === true`) | `/admin`                                               |
| Authenticated non-admin     | Existing authenticated destination or agreed default   |
| Unauthenticated             | Remain on login or return to requested protected route |

Admin detection must be based on the authenticated user returned/verified by the backend, not a form value, query parameter, client-side role selection, or guessed value.

## **8. Guest-only authentication pages**

Implement a reusable `GuestGuard` (or equivalent middleware/layout pattern) for all authentication pages.

Authenticated users must not be able to access:

- Login
- Register
- Forgot password
- Account verification
- Reset password
- Resend verification
- Any other guest-only authentication page

### **Expected behavior**

| State                           | Behavior                                                     |
| ------------------------------- | ------------------------------------------------------------ |
| Auth initialization in progress | Display loading UI                                           |
| Not authenticated               | Allow access to guest/auth page                              |
| Authenticated admin             | Redirect to `/admin`                                         |
| Authenticated non-admin         | Redirect to the authenticated user's appropriate destination |

### **Implementation**

Create a reusable guard instead of duplicating logic in every page.

Example conceptual usage:

```
<GuestGuard>
    {children}
</GuestGuard>
```

Or implement a shared auth layout that protects the complete guest-only route group, if compatible with the existing routing structure.

The agent must inspect the current routing structure and apply the guard consistently across all auth pages, including nested pages.

**Important:** A user must not briefly see the login or register form before the redirect occurs. The guard must wait for authentication initialization and render a neutral loading state while determining the session.

## **9. Admin route protection**

The `/admin` area must be accessible only to authenticated admin users.

Use a reusable `AuthGuard` / `AdminGuard` for the admin layout, rather than protecting each admin page independently.

### **Access rules**

| Authentication   | `is_admin` | Result                                                               |
| ---------------- | ---------- | -------------------------------------------------------------------- |
| Not initialized  | Unknown    | Show loading                                                         |
| No valid session | —          | Redirect to login                                                    |
| Authenticated    | `false`    | Redirect to an authorized non-admin destination or show unauthorized |
| Authenticated    | `true`     | Allow admin access                                                   |

The guard must ensure the user is authenticated and `user.is_admin === true`.

### **Admin layout**

Integrate the guard at the admin layout level where possible, so all nested pages are covered, including:

- Admin dashboard
- Documentation management
- Settings
- Admin API-related screens
- Other nested admin routes

Do not rely solely on hiding menu items. A user must not be able to load an admin page by typing its URL directly.

Client-side guards are for navigation and UX. The backend must independently enforce admin authorization on protected API endpoints.

## **10. Session initialization and restoration**

Implement authentication restoration when the application loads or the browser is refreshed.

Requirements:

- Restore the session without forcing users to log in after every page reload.
- Use the backend's actual refresh mechanism.
- Fetch the authenticated user where required to verify the session and retrieve `is_admin`.
- Ensure the initialization process doesn't create redirect loops.
- Avoid showing guest pages or admin content while the session is still being resolved.
- Handle backend downtime gracefully.
- A failed session restoration should result in a clean unauthenticated state, not a broken application.

## **11. Logout**

Wire up logout throughout the frontend using the Zustand auth store and backend logout API.

### **Logout flow**

1. User clicks the logout button.
2. Set `isLoggingOut` to true.
3. Call the backend logout endpoint.
4. Revoke or invalidate refresh credentials if the backend supports it.
5. Clear Zustand authentication state.
6. Clear any client-side access token.
7. Clear user-specific cached data that could leak between sessions.
8. Redirect to the login page.
9. Ensure the user cannot return to protected pages using browser back navigation.

### **Logout failure**

Even if the backend logout request fails due to network issues, the frontend should clear its local authenticated state and complete the logout UX.

Do not leave the user appearing authenticated after they initiate logout.

Logout must also ensure that stale refresh credentials are not silently reused to re-authenticate the user after local logout.

## **12. Authentication hooks**

Expose auth functionality through reusable hooks, following existing conventions.

### `useAuth()`

Provide access to:

- Current user
- Authentication status
- Admin status
- Initialization status
- Login action
- Logout action
- Refresh action

Example API shape:

```
const {
    user,
    isAuthenticated,
    isAdmin,
    isInitialized,
    login,
    logout,
} = useAuth();
```

`isAdmin` should be derived from `user?.is_admin`, not maintained as a separate potentially inconsistent state.

Hooks must remain lightweight and should not duplicate the store's authentication logic.

## **13. UI integration with lucide-react**

Use `lucide-react` for authentication-related UI icons wherever appropriate, while respecting the existing design system.

Suggested icons:

| UI element    | Icon           |
| ------------- | -------------- |
| Email         | `Mail`         |
| Password      | `LockKeyhole`  |
| Show password | `Eye`          |
| Hide password | `EyeOff`       |
| Loading       | `LoaderCircle` |
| Logout        | `LogOut`       |
| User account  | `UserRound`    |
| Admin         | `ShieldCheck`  |
| Error         | `CircleAlert`  |
| Success       | `CircleCheck`  |

Requirements:

- Avoid unnecessary redesign of the existing authentication pages.
- Reuse existing inputs, buttons, layouts and styling.
- Password visibility toggle should work.
- Icons must have appropriate accessibility labels where they are interactive.
- Loading indicators should be consistent.
- Error messages must be clear and accessible.

## **14. Redirect handling**

Implement intelligent redirects without creating security or routing problems.

### `returnTo`**&#x20;support**

If an unauthenticated user attempts to access a protected route:

```
/admin/settings
```

Redirect them to login while preserving the intended destination, if the existing routing conventions support this.

After successful login:

- Admin → `/admin` by default.
- Admin with a valid intended admin destination → optionally return to that destination.
- Non-admin → their configured authenticated destination.
- Invalid, external or unauthorized destinations → safe default.

Validate redirect URLs to prevent open redirects. Do not blindly redirect to arbitrary URLs supplied through query parameters.

## **15. Implementation phases**

## **Recommended execution order**

Phase 1

**Inspect existing frontend and backend auth**

Inspect routes, API responses, current components, environment variables, token strategy and dependencies. Produce a short findings summary before changing code.

Phase 2

**Axios and interceptor setup**

Configure shared Axios instance, request handling, 401 handling, refresh logic, single-flight queue and retry protection.

Phase 3

**Zustand authentication store**

Implement authentication state, initialization, login, logout, refresh, user state and cleanup.

Phase 4

**Session restoration**

Restore the user on page reload, verify the session and handle expired access tokens using the backend refresh contract.

Phase 5

**Guest guard**

Prevent authenticated users from accessing login, registration, verification, forgot-password and other guest-only pages.

Phase 6

**Admin protection**

Protect admin layouts and nested pages; allow only authenticated users with is_admin === true.

Phase 7

**Wire login and logout UI**

Connect existing forms, loading states, error handling, password toggle, admin redirect and logout controls.

Phase 8

**Regression and security testing**

Test all auth routes, token refresh, redirect rules, admin access, failures, race conditions and logout.

## **16. Required test scenarios**

The agent must verify these scenarios before considering the implementation complete.

### **Login**

- Valid credentials log in successfully.
- Admin users redirect to `/admin`.
- Non-admin users redirect to the appropriate destination.
- Invalid credentials display a proper error.
- Backend validation errors are displayed correctly.
- Duplicate login submissions are prevented.
- User state is updated in Zustand immediately after success.

### **Guest route protection**

- Authenticated users cannot access `/login`.
- Authenticated users cannot access `/register`.
- Authenticated users cannot access `/forgot-password`.
- Authenticated users cannot access `/account-verification`.
- Other auth pages are protected consistently.
- Redirects happen only after auth initialization.
- No auth page content flashes before redirect.

### **Admin protection**

- Unauthenticated users cannot access `/admin`.
- Authenticated non-admins cannot access `/admin`.
- Admins can access `/admin`.
- Direct URL navigation is protected.
- Nested admin routes are protected.
- `is_admin` is determined from the backend-authenticated user.

### **Refresh token**

- Expired access token triggers refresh.
- Successful refresh retries the original request.
- Concurrent `401` responses produce only one refresh request.
- Refresh failure clears authentication.
- No infinite refresh loop.
- Refresh survives a page reload where expected.
- Revoked or expired refresh tokens are handled.

### **Logout**

- Logout calls the backend.
- Local auth state is cleared.
- User is redirected to login.
- Protected pages cannot be accessed after logout.
- Refresh cannot silently restore a logged-out session.
- Logout remains effective if the API is temporarily unavailable.

### **Regression**

- Register flow still works.
- Forgot-password flow still works.
- Verification flow still works.
- Existing frontend pages and layouts are unaffected.
- No duplicate Axios instances or auth stores are introduced.
- No TypeScript errors.
- No lint errors.

## **17. Definition of done**

The implementation is complete only when:

- Authentication is centralized through Zustand.
- Axios and interceptors are correctly wired.
- Login works against the real backend.
- Admin redirect works using `user.is_admin`.
- All guest-only auth pages are inaccessible to authenticated users.
- Admin routes are protected.
- Refresh tokens work correctly, including concurrency.
- Logout invalidates the session as supported by the backend.
- Session restoration works after reload.
- Existing registration, verification and password recovery flows remain functional.
- Loading, errors and redirect states are handled cleanly.
- The implementation is typed, maintainable and does not duplicate existing architecture.

**Important instruction to the AI agent:** Do not merely implement the happy path. Inspect the existing code first, preserve the current project structure, verify the backend contract, and implement the entire authentication lifecycle. Do not mark any flow complete until it has been tested.
