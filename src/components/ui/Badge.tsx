import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "primary" | "accent" | "outline";
  className?: string;
};

const variantClasses = {
  default: "bg-neutral-100 text-neutral-700",
  primary: "bg-primary-100 text-primary-700",
  accent: "bg-accent-100 text-accent-700",
  outline: "border border-[var(--border)] text-neutral-600",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
