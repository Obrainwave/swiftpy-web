"use client";

import React from "react";
import { LoaderCircle } from "lucide-react";

/**
 * Neutral loading screen shown while session initialization is in progress.
 * Guards render this to prevent auth page content from flashing before
 * redirect decisions are made.
 */
export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoaderCircle
        className="w-8 h-8 animate-spin text-primary"
        aria-label="Loading session"
      />
    </div>
  );
}
