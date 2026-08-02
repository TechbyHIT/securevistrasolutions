"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "@/config/navigation";
import { BUSINESS_CONFIG } from "@/config/business";
import {
  AREAS_MEGA_MENU,
  SERVICES_MEGA_MENU,
  buildAreaPageUrl,
  getMegaMenuColumnHref,
  getMegaMenuLinkHref,
  DEFAULT_LOCATION_SLUG,
} from "@/config/mega-menu";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setExpanded(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp.raw}`;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-neutral-900/50 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
        onClick={onClose}
      />
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-[var(--border)] bg-primary-50 px-4 py-4">
          <div className="min-w-0 flex-1">
            <Image
              src={BUSINESS_CONFIG.logo}
              alt={BUSINESS_CONFIG.name}
              width={180}
              height={60}
              className="h-10 w-auto max-w-[11rem] object-contain object-left"
            />
            <a
              href={`tel:${BUSINESS_CONFIG.phone.raw}`}
              className="mt-1 block text-xs font-semibold text-accent-600"
            >
              {BUSINESS_CONFIG.phone.display}
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-neutral-600 hover:bg-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto px-3 py-3">
          {PRIMARY_NAV.map((item) => {
            if (item.megaMenu === "services") {
              const isOpen = expanded === "services";
              return (
                <li key={item.href} className="mb-1">
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold",
                      isOpen ? "bg-primary-50 text-primary-800" : "text-neutral-800 hover:bg-neutral-50",
                    )}
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : "services")}
                  >
                    {item.label}
                    <svg
                      className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen ? (
                    <div className="mb-2 space-y-3 rounded-lg bg-neutral-50 px-3 py-3">
                      {SERVICES_MEGA_MENU.map((column) => (
                        <div key={column.title}>
                          <Link
                            href={getMegaMenuColumnHref(column)}
                            onClick={onClose}
                            className="text-sm font-semibold text-primary-600"
                          >
                            {column.title}
                          </Link>
                          <ul className="mt-1 pl-2">
                            {column.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={getMegaMenuLinkHref(link)}
                                  onClick={onClose}
                                  className="block py-1 text-xs text-neutral-600"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link
                        href="/services/"
                        onClick={onClose}
                        className="text-sm font-semibold text-accent-600"
                      >
                        View all services &rarr;
                      </Link>
                    </div>
                  ) : null}
                </li>
              );
            }

            if (item.megaMenu === "areas") {
              const isOpen = expanded === "areas";
              return (
                <li key={item.href} className="mb-1">
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold",
                      isOpen ? "bg-primary-50 text-primary-800" : "text-neutral-800 hover:bg-neutral-50",
                    )}
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : "areas")}
                  >
                    {item.label}
                    <svg
                      className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen ? (
                    <div className="mb-2 space-y-3 rounded-lg bg-neutral-50 px-3 py-3">
                      {AREAS_MEGA_MENU.map((column) => (
                        <div key={column.title}>
                          <p className="text-sm font-semibold text-primary-600">{column.title}</p>
                          <ul className="mt-1 pl-2">
                            {column.areas.map((area) => (
                              <li key={area.slug}>
                                <Link
                                  href={buildAreaPageUrl(area.slug)}
                                  onClick={onClose}
                                  className="block py-1 text-xs text-neutral-600"
                                >
                                  {area.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link
                        href={`/locations/${DEFAULT_LOCATION_SLUG}/`}
                        onClick={onClose}
                        className="text-sm font-semibold text-accent-600"
                      >
                        View all areas &rarr;
                      </Link>
                    </div>
                  ) : null}
                </li>
              );
            }

            return (
              <li key={item.href} className="mb-1">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="mb-1">
            <Link
              href="/pricing-guide/"
              onClick={onClose}
              className="block rounded-lg px-3 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Pricing Guide
            </Link>
          </li>
        </ul>
        <div className="grid grid-cols-2 gap-2 border-t border-[var(--border)] p-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-md"
          >
            WhatsApp
          </a>
          <a
            href={`tel:${BUSINESS_CONFIG.phone.raw}`}
            className="col-span-2 flex items-center justify-center rounded-full bg-accent-500 px-4 py-3 text-sm font-bold text-white shadow-md"
          >
            Call Now
          </a>
        </div>
      </nav>
    </>
  );
}
