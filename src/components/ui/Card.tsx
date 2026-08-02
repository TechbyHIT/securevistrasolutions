import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
};

export function Card({ children, className, as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
