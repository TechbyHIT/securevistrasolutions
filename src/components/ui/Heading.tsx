import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type HeadingLevel = 1 | 2 | 3 | 4;

type HeadingProps = {
  children: ReactNode;
  level?: HeadingLevel;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
};

const levelClasses: Record<HeadingLevel, string> = {
  1: "text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
  2: "text-2xl font-bold tracking-tight sm:text-3xl",
  3: "text-xl font-semibold sm:text-2xl",
  4: "text-lg font-semibold",
};

export function Heading({ children, level = 2, className, as }: HeadingProps) {
  const Tag = as ?? (`h${level}` as "h1" | "h2" | "h3" | "h4");
  return <Tag className={cn("text-balance text-[var(--foreground)]", levelClasses[level], className)}>{children}</Tag>;
}
