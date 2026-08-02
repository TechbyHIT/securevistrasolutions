import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center",
        className,
      )}
    >
      <p className="text-lg font-semibold text-[var(--foreground)]">{title}</p>
      {description ? <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
