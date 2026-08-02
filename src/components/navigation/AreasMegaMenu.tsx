"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  AREAS_MEGA_MENU,
  buildAreaPageUrl,
  buildInvisibleGrillsLocalityLinks,
  DEFAULT_LOCATION_SLUG,
} from "@/config/mega-menu";
import { BUSINESS_CONFIG } from "@/config/business";

type AreasMegaMenuProps = {
  open: boolean;
};

export function AreasMegaMenu({ open }: AreasMegaMenuProps) {
  const hotLocalities = buildInvisibleGrillsLocalityLinks().slice(0, 8);

  return (
    <div
      className={`pt-0 transition-all duration-200 ${
        open
          ? "visible translate-y-0 opacity-100"
          : "invisible pointer-events-none absolute -translate-y-1 opacity-0"
      }`}
    >
      <div className="border-t-4 border-primary-800 border-b border-[var(--border)] bg-white shadow-2xl">
        <Container>
          <div className="max-h-[min(70vh,28rem)] overflow-y-auto">
          <div className="grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {AREAS_MEGA_MENU.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-bold text-primary-700">{column.title}</p>
                <ul className="mt-3 space-y-1.5">
                  {column.areas.map((area) => (
                    <li key={area.slug}>
                      <Link
                        href={buildAreaPageUrl(area.slug)}
                        className="block text-xs text-neutral-600 transition-colors hover:text-primary-600"
                      >
                        {area.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {hotLocalities.length > 0 ? (
            <div className="border-t border-[var(--border)] py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                High-intent: Invisible grills installation
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {hotLocalities.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 hover:border-accent-400 hover:bg-accent-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-accent-100 bg-accent-50 px-1 py-3 sm:px-0">
            <p className="text-sm text-[var(--foreground)]">
              350+ neighbourhoods · {BUSINESS_CONFIG.name}
            </p>
            <Link
              href={`/locations/${DEFAULT_LOCATION_SLUG}/`}
              className="text-sm font-semibold text-accent-600 hover:text-accent-700"
            >
              View all areas →
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}
