"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SearchBar } from "../components/utils/SearchBar";
import { ThemeToggle } from "../components/utils/ThemeToggle";
import { Button } from "../components/utils/Button";
import { GithubIcon, GithubIcon2, ArrowRightIcon, MenuIcon, XIcon } from "../components/utils/Icons";

const NAV_LINKS = [
  { label: "Guide", href: "/guide" },
  { label: "API Reference", href: "/api-reference" },
  { label: "Examples", href: "/examples" },
  { label: "Community", href: "/community" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide the global marketing header on dedicated auth, admin, and dashboard screens
  if (
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/85 border-b border-border/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logos/red-black.png"
              alt="SwiftPY"
              width={140}
              height={38}
              priority
              className="h-10 sm:h-12 w-auto object-contain dark:hidden"
            />
            <Image
              src="/logos/red-white.png"
              alt="SwiftPY"
              width={140}
              height={38}
              priority
              className="h-10 sm:h-12 w-auto object-contain hidden dark:block"
            />
          </Link>
        </div>

        {/* Center: Search Bar (desktop) */}
        <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2">
          <SearchBar placeholder="Search documentation..." shortcut="Ctrl + K" />
        </div>

        {/* Right: Nav items, GitHub, Theme, CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs lg:text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 pl-2 border-l border-border">
            <a
              href="https://github.com/obrainwave/swiftpy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-background-alt transition-colors"
            >
              <GithubIcon2 className="w-6 h-6" />
            </a>

            <ThemeToggle />

            <Button
              variant="primary"
              size="sm"
              href="/guide"
              rightIcon={<ArrowRightIcon className="w-3.5 h-3.5" />}
              className="ml-1"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="primary"
            size="sm"
            href="/guide"
            className="hidden sm:inline-flex text-xs px-3 py-1.5"
          >
            Get Started
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-foreground hover:bg-background-alt"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer/Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 border-b border-border bg-surface/95 backdrop-blur-md animate-fadeIn">
          <div className="mb-4">
            <SearchBar placeholder="Search documentation..." shortcut="" />
          </div>
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium rounded-lg text-foreground/80 hover:text-primary hover:bg-background-alt transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground"
            >
              <GithubIcon className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <Button
              variant="primary"
              size="sm"
              href="/guide"
              rightIcon={<ArrowRightIcon className="w-3.5 h-3.5" />}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
