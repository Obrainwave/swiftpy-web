import React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-[#c90905] active:bg-[#b00804] border border-transparent shadow-sm",
  secondary:
    "bg-secondary text-white hover:bg-[#e86400] active:bg-[#cc5800] border border-transparent shadow-sm",
  outline:
    "bg-surface text-foreground border border-border hover:bg-background-alt hover:border-foreground/20 shadow-xs",
  ghost:
    "bg-transparent text-foreground hover:bg-background-alt border border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-transparent shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs font-medium gap-1.5",
  md: "px-5 py-2.5 text-sm font-semibold gap-2",
  lg: "px-7 py-3.5 text-base font-semibold gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none font-sans";
  const combinedClasses = `${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
}

export default Button;
