import { cn } from "@/lib/utils";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500",
  secondary: "bg-neutral-800 text-white hover:bg-neutral-700 focus-visible:ring-neutral-800",
  accent: "bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-500",
  outline:
    "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500",
  ghost: "text-primary-500 hover:bg-primary-50 focus-visible:ring-primary-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm sm:text-base",
  lg: "px-6 py-3 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
