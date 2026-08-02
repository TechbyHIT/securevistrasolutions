import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "muted" | "primary";
};

const variantClasses = {
  default: "bg-[var(--background)]",
  muted: "bg-[var(--surface)]",
  primary: "bg-primary-500 text-white",
};

export function Section({ children, className, id, variant = "default" }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-[var(--section-py)]",
        variantClasses[variant],
        variant === "default" && "border-b border-[var(--border)]/60",
        className,
      )}
    >
      {children}
    </section>
  );
}
