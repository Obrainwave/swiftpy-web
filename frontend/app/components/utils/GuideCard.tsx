import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "./Icons";

export interface GuideCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  linkColor?: "primary" | "secondary" | "accent";
  className?: string;
}

export function GuideCard({
  icon,
  title,
  description,
  linkLabel,
  href,
  linkColor = "primary",
  className = "",
}: GuideCardProps) {
  const linkColorClasses = {
    primary: "text-primary hover:text-primary/80 group-hover:translate-x-1",
    secondary: "text-secondary hover:text-secondary/80 group-hover:translate-x-1",
    accent: "text-accent hover:text-accent/80 group-hover:translate-x-1",
  };

  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between p-6 rounded-2xl bg-surface border border-border shadow-xs hover:shadow-md hover:border-foreground/20 transition-all duration-200 ${className}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 text-primary">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <div
          className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${linkColorClasses[linkColor]}`}
        >
          <span>{linkLabel}</span>
          <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}

export default GuideCard;
