import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/lib/schema/breadcrumb-schema";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-[var(--muted)]", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {isLast ? (
                <span aria-current="page" className="font-medium text-[var(--foreground)]">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-primary-500 hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
