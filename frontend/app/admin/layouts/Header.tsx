"use client";

import React from "react";
import { ThemeToggle } from "../../components/utils/ThemeToggle";
import {
  BellIcon,
  ClockIcon,
  SearchIcon,
  SidebarToggleIcon,
} from "../../components/utils/Icons";
import { LogOut, LoaderCircle } from "lucide-react";
import { useLogout } from "../../auth/hooks/useLogout";
import useAuthStore from "../../auth/stores/auth.store";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: AdminHeaderProps) {
  const { logout, isLoggingOut } = useLogout();
  const user = useAuthStore((s) => s.user);

  // Build initials from user name (e.g. "John Cena" → "JC")
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-surface/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-8 transition-colors">
      {/* Left: Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar navigation"
          className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-alt transition-colors cursor-pointer"
        >
          <SidebarToggleIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Compact Search Trigger */}
        <div className="relative hidden sm:flex items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background-alt border border-border text-foreground-muted text-xs cursor-pointer hover:border-foreground/30 transition-colors">
            <SearchIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-foreground-muted">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* History / Clock Button */}
        <button
          aria-label="Recent activity"
          className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-alt transition-colors cursor-pointer"
        >
          <ClockIcon className="w-5 h-5" />
        </button>

        {/* Notifications with Badge */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-alt transition-colors cursor-pointer"
        >
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
            2
          </span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Logout Button */}
        <button
          onClick={logout}
          disabled={isLoggingOut}
          aria-label="Log out"
          title="Log out"
          className="p-2 rounded-lg text-foreground-muted hover:text-red-500 hover:bg-background-alt transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoggingOut ? (
            <LoaderCircle className="w-5 h-5 animate-spin" aria-hidden />
          ) : (
            <LogOut className="w-5 h-5" aria-hidden />
          )}
        </button>

        {/* User Profile Avatar with Online indicator */}
        <div className="relative shrink-0 pl-1">
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-accent flex items-center justify-center text-white text-xs font-bold ring-2 ring-border shadow-xs cursor-pointer"
            title={user?.name ?? "Admin"}
          >
            {initials}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-surface" />
        </div>
      </div>
    </header>
  );
}

export default Header;
