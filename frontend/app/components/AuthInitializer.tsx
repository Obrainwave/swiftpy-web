"use client";

import { useInitializeAuth } from "../auth/hooks/useInitializeAuth";

/**
 * AuthInitializer — mounts once at the root layout level.
 * Restores the session through the auth initialization hook.
 * Renders nothing — purely a side-effect component.
 */
export default function AuthInitializer() {
  useInitializeAuth();

  return null;
}
