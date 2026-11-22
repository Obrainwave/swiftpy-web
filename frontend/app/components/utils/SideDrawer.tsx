"use client";

import React, { useEffect } from "react";
import { XIcon } from "./Icons";

export interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: "left" | "right";
  className?: string;
}

export function SideDrawer({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  className = "",
}: SideDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positionClasses = position === "left" ? "left-0" : "right-0";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 ${positionClasses} max-w-full flex z-10`}
      >
        <div
          className={`w-screen max-w-sm sm:max-w-md bg-surface text-foreground border-l border-border shadow-2xl flex flex-col ${className}`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold">{title || "Navigation"}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-alt transition-colors"
              aria-label="Close drawer"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default SideDrawer;
