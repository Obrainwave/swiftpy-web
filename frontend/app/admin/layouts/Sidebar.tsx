"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CartIcon,
  FileTextIcon,
  LockIcon,
  ListIcon,
  BanIcon,
  TagIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  XIcon,
} from "../../components/utils/Icons";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type SidebarIcon = React.ComponentType<{ className?: string }>;

interface NavLink {
  name: string;
  href: string;
  icon?: SidebarIcon;
  badge?: string;
  external?: boolean;
  exact?: boolean;
  active?: boolean;
}

interface NavItem extends Partial<NavLink> {
  name: string;
  children?: NavLink[];
  disabled?: boolean;
  primary?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: CartIcon,
        exact: true,
        primary: true,
      },
      {
        name: "Analytics",
        href: "/admin/analytics",
        icon: CartIcon,
        exact: true,
        primary: true,
      },
    ],
  },
  {
    title: "Main",
    items: [
      {
        name: "Users",
        icon: FileTextIcon,
        children: [
          { name: "Users", href: "/admin/users" },
          { name: "Admins", href: "/admin/admins" },
        ],
      },
      {
        name: "Roles & Permissions",
        href: "/admin/rbac",
        icon: TagIcon,
        active: false,
      },
    ]
  },
  {
    title: "Documentation",
    items: [
      {
        name: "Versions",
        href: "/admin/docs/versions",
        icon: TagIcon,
        active: false,
      },
      {
        name: "Groups",
        href: "/admin/docs/groups",
        icon: ExternalLinkIcon,
        active: true,
      },
      {
        name: "Contents",
        href: "/admin/docs/contents",
        icon: FileTextIcon,
        active: false,
      },
    ],
  },
  {
    title: "CMS",
    items: [
      {
        name: "Blog Categories",
        href: "/admin/blog/categories",
        icon: TagIcon,
        active: false,
      },
      {
        name: "Blog Posts",
        href: "/admin/blog/posts",
        icon: ExternalLinkIcon,
        active: true,
      },
      {
        name: "Blog Comments",
        href: "/admin/blog/comments",
        icon: FileTextIcon,
        active: false,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        name: "Profile",
        href: "/admin/account/profile",
        icon: TagIcon,
        active: false,
      },
      {
        name: "Settings",
        href: "/admin/account/settings",
        icon: ExternalLinkIcon,
        active: true,
      },
      {
        name: "System Info",
        href: "/admin/account/system",
        icon: FileTextIcon,
        active: false,
      },
    ],
  },
];

type LinkVariant = "primary" | "nested" | "standard";

function NavigationLink({
  item,
  pathname,
  variant,
}: {
  item: NavLink;
  pathname: string;
  variant: LinkVariant;
}) {
  const Icon = item.icon;
  const isActive =
    item.active !== false &&
    (item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`));
  const className =
    variant === "primary"
      ? `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive
        ? "bg-accent/15 text-accent dark:bg-accent/20 dark:text-[#22c55e]"
        : "text-foreground-muted hover:text-foreground hover:bg-background-alt"
      }`
      : variant === "nested"
        ? `block px-2 py-1.5 text-xs transition-colors ${isActive
          ? "font-semibold text-primary"
          : "text-foreground-muted hover:text-primary"
        }`
        : `flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${item.badge ? "justify-between" : ""
        } ${isActive
          ? "text-primary bg-background-alt"
          : "text-foreground-muted hover:text-foreground hover:bg-background-alt"
        }`;
  const content = (
    <>
      <span className={variant === "nested" ? "" : "flex items-center gap-3"}>
        {Icon && (
          <Icon
            className={
              variant === "nested" ? "w-3.5 h-3.5" : "w-4 h-4 shrink-0"
            }
          />
        )}
        <span>{item.name}</span>
      </span>
      {item.badge && (
        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-accent/20 text-accent dark:text-[#22c55e]">
          {item.badge}
        </span>
      )}
    </>
  );

  return item.external ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {content}
    </a>
  ) : (
    <Link
      href={item.href}
      className={className}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        NAV_SECTIONS.flatMap((section) =>
          section.items
            .filter(
              (item) =>
                item.children?.some(
                  ({ href }) =>
                    pathname === href || pathname.startsWith(`${href}/`)
                )
            )
            .map((item) => [`${section.title ?? ""}:${item.name}`, true])
        )
      )
  );

  const toggleItem = (key: string) => {
    setExpandedItems((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 min-w-64 bg-surface text-foreground border-r border-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border/80 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logos/red-black.png"
              alt="SwiftPY"
              width={120}
              height={40}
              className="h-12 w-auto object-contain dark:hidden"
            />
            <Image
              src="/logos/red-white.png"
              alt="SwiftPY"
              width={120}
              height={32}
              className="h-7 w-auto object-contain hidden dark:block"
            />
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {NAV_SECTIONS.map((section, sectionIndex) => (
            <div
              key={section.title ?? `section-${sectionIndex}`}
              className="space-y-1"
            >
              {section.title && (
                <div className="px-3 py-1 text-[11px] font-bold text-foreground tracking-wider uppercase select-none">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const itemKey = `${section.title ?? ""}:${item.name}`;
                const Icon = item.icon;

                if (item.disabled) {
                  return (
                    <div
                      key={itemKey}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-foreground-muted cursor-not-allowed select-none"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </div>
                  );
                }

                if (item.children) {
                  const isExpanded = Boolean(expandedItems[itemKey]);
                  const toggleButton = (
                    <button
                      type="button"
                      onClick={() => toggleItem(itemKey)}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.name}`}
                      className="p-1 text-foreground-muted hover:text-foreground"
                    >
                      <ChevronDownIcon
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                  );

                  return (
                    <div key={itemKey}>
                      {item.href ? (
                        <div className="flex items-center">
                          <NavigationLink
                            item={{ ...item, href: item.href }}
                            pathname={pathname}
                            variant="standard"
                          />
                          {toggleButton}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleItem(itemKey)}
                          aria-expanded={isExpanded}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-alt transition-colors"
                        >
                          <span className="flex items-center gap-3">
                            {Icon && <Icon className="w-4 h-4" />}
                            <span>{item.name}</span>
                          </span>
                          <ChevronDownIcon
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                      )}

                      {isExpanded && item.children.length > 0 && (
                        <div className="ml-7 mt-1 space-y-1 border-l border-border pl-3">
                          {item.children.map((child) => (
                            <NavigationLink
                              key={child.href}
                              item={child}
                              pathname={pathname}
                              variant="nested"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (!item.href) return null;

                return (
                  <NavigationLink
                    key={itemKey}
                    item={{ ...item, href: item.href }}
                    pathname={pathname}
                    variant={item.primary ? "primary" : "standard"}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Profile Summary Card */}
        <div className="p-4 border-t border-border shrink-0 bg-background-alt/50">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-xs">
                JC
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-surface" />
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <div className="text-xs font-bold text-foreground truncate">
                Jitu Chauhan
              </div>
              <div className="text-[11px] text-foreground-muted truncate">
                Free Version - 1 Month
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
