"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const currentYear = 2026;
  const pathname = usePathname();

  // Hide the global marketing footer on dedicated auth, admin, and dashboard screens
  if (
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard")
  ) {
    return null;
  }

  return (
    <footer className="w-full border-t border-border bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-foreground-muted">
          {/* Left: Copyright */}
          <div className="text-center md:text-left">
            <span>&copy; {currentYear} SwiftPY. All rights reserved.</span>
          </div>

          {/* Center: Essential Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2">
            <Link
              href="/guide"
              className="hover:text-primary transition-colors"
            >
              Documentation
            </Link>
            <span className="text-foreground-muted/40">•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <span className="text-foreground-muted/40">•</span>
            <Link
              href="/community"
              className="hover:text-primary transition-colors"
            >
              Community
            </Link>
            <span className="text-foreground-muted/40">•</span>
            <Link
              href="/license"
              className="hover:text-primary transition-colors"
            >
              License
            </Link>
          </div>

          {/* Right: Tagline */}
          <div className="text-center md:text-right font-medium">
            <span>Made with <span className="text-primary">❤️</span> for Python Developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
