import React from "react";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-surface/50 hover:bg-surface border border-transparent hover:border-border transition-all duration-200 ${className}`}
    >
      <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/15 to-red-500/15 text-secondary dark:text-orange-400">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-foreground text-base tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default FeatureCard;
