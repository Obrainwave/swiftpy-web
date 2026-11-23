import React from "react";
import Link from "next/link";
import { ButtonSize } from "./Button";

export interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  rounded?: "full" | "md" | "sm";
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const roundedStyles = {
  full: "rounded-full",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  xl: "rounded-xl",
  lg: "rounded-lg",
  md: "rounded-md",
  sm: "rounded-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs font-medium gap-1.5",
  md: "px-5 py-2.5 text-sm font-semibold gap-2",
  lg: "px-7 py-3.5 text-base font-semibold gap-2.5",
};

export function GradientButton({
  size = "md",
  rounded = "full",
  href,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  children,
  disabled,
  ...props
}: GradientButtonProps) {
  const baseClasses =
    `flex-row items-center justify-center gap-1 ${roundedStyles[rounded]} bg-gradient-to-r from-primary via-[#f03b05] to-secondary text-white font-semibold shadow-md hover:shadow-lg hover:brightness-105 active:brightness-95 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none font-sans`;
  const combinedClasses = `${baseClasses} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""
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

export default GradientButton;
