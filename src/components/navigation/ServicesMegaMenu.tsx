"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  SERVICES_MEGA_MENU,
  getMegaMenuColumnHref,
  getMegaMenuLinkHref,
} from "@/config/mega-menu";
import { BUSINESS_CONFIG } from "@/config/business";

type ServicesMegaMenuProps = {
  open: boolean;
};

export function ServicesMegaMenu({ open }: ServicesMegaMenuProps) {
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
          <div className="max-h-[min(70vh,32rem)] overflow-y-auto">
          <div className="grid gap-5 py-6 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
            {SERVICES_MEGA_MENU.map((column) => (
              <div key={column.title} className="min-w-0">
                <Link
                  href={getMegaMenuColumnHref(column)}
                  className="text-sm font-bold text-primary-700 hover:text-accent-500"
                >
                  {column.title}
                </Link>
                <ul className="mt-3 space-y-1.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={getMegaMenuLinkHref(link)}
                        className="block text-xs leading-snug text-neutral-600 transition-colors hover:text-primary-600"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-accent-100 bg-accent-50 px-1 py-3 sm:px-0">
            <p className="text-sm text-[var(--foreground)]">
              Free site inspection · {BUSINESS_CONFIG.phone.display}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/invisible-grills-in-hyderabad/"
                className="text-sm font-semibold text-primary-700 hover:text-accent-600"
              >
                Invisible Grills in Hyderabad
              </Link>
              <Link
                href="/services/"
                className="text-sm font-semibold text-accent-600 hover:text-accent-700"
              >
                View all services →
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
