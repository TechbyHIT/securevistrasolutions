"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV } from "@/config/navigation";
import { BUSINESS_CONFIG } from "@/config/business";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";

const MobileNav = dynamic(
  () => import("@/components/navigation/MobileNav").then((m) => m.MobileNav),
  { ssr: false },
);
const ServicesMegaMenu = dynamic(
  () => import("@/components/navigation/ServicesMegaMenu").then((m) => m.ServicesMegaMenu),
  { ssr: false },
);
const AreasMegaMenu = dynamic(
  () => import("@/components/navigation/AreasMegaMenu").then((m) => m.AreasMegaMenu),
  { ssr: false },
);

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function navLinkClass(active: boolean, megaOpen?: boolean) {
  return cn(
    "inline-flex items-center gap-1 px-2.5 py-2 text-[13px] font-semibold tracking-wide transition-colors xl:px-3 xl:text-sm",
    megaOpen || active
      ? "text-primary-800 underline decoration-accent-500 decoration-2 underline-offset-8"
      : "text-neutral-700 hover:text-primary-700",
  );
}

export function HeaderClient() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp.raw}`;

  function openServices() {
    setServicesOpen(true);
    setAreasOpen(false);
  }

  function openAreas() {
    setAreasOpen(true);
    setServicesOpen(false);
  }

  function closeMenus() {
    setServicesOpen(false);
    setAreasOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.replace(/\/$/, ""));
  }

  return (
    <>
      <header className="sticky top-0 z-40 shadow-sm" onMouseLeave={closeMenus}>
        <TopBar />
        <div className="relative border-b border-[var(--border)] bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
          <Container className="flex h-[var(--header-height)] items-center gap-3 lg:gap-4">
            <Link
              href="/"
              className="flex min-w-0 shrink-0 items-center"
              aria-label={`${BUSINESS_CONFIG.name} home`}
              onMouseEnter={closeMenus}
            >
              <Image
                src={BUSINESS_CONFIG.logo}
                alt={BUSINESS_CONFIG.name}
                width={220}
                height={72}
                className="h-10 w-auto max-w-[9.5rem] object-contain object-left sm:h-12 sm:max-w-[12rem] lg:h-[3.25rem] lg:max-w-[14rem]"
                priority
              />
            </Link>

            <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 lg:block">
              <ul className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1 xl:gap-x-1">
                {PRIMARY_NAV.map((item) => {
                  if (item.megaMenu === "services") {
                    return (
                      <li key={item.href} className="relative" onMouseEnter={openServices}>
                        <Link
                          href={item.href}
                          className={navLinkClass(isActive(item.href), servicesOpen)}
                          aria-expanded={servicesOpen}
                          aria-haspopup="true"
                          onFocus={openServices}
                        >
                          {item.label}
                          <ChevronDown className={cn("opacity-60", servicesOpen && "rotate-180")} />
                        </Link>
                      </li>
                    );
                  }

                  if (item.megaMenu === "areas") {
                    return (
                      <li key={item.href} className="relative" onMouseEnter={openAreas}>
                        <Link
                          href={item.href}
                          className={navLinkClass(isActive(item.href), areasOpen)}
                          aria-expanded={areasOpen}
                          aria-haspopup="true"
                          onFocus={openAreas}
                        >
                          {item.label}
                          <ChevronDown className={cn("opacity-60", areasOpen && "rotate-180")} />
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href} onMouseEnter={closeMenus}>
                      <Link href={item.href} className={navLinkClass(isActive(item.href))}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-2" onMouseEnter={closeMenus}>
              <a
                href={`tel:${BUSINESS_CONFIG.phone.raw}`}
                className="hidden items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm font-semibold text-primary-800 transition-colors hover:bg-primary-50 xl:inline-flex"
              >
                <PhoneIcon />
                Call Now
              </a>
              <Link
                href="/contact/"
                className="hidden items-center bg-accent-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-600 sm:inline-flex"
              >
                Get Free Quote
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white sm:h-11 sm:w-11"
              >
                <WhatsAppIcon />
              </a>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center border border-neutral-200 text-neutral-700 hover:bg-neutral-50 lg:hidden"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </Container>

          {(servicesOpen || areasOpen) ? (
            <div className="absolute inset-x-0 top-full z-50">
              <ServicesMegaMenu open={servicesOpen} />
              <AreasMegaMenu open={areasOpen} />
            </div>
          ) : null}
        </div>
      </header>
      {mobileOpen ? <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} /> : null}
    </>
  );
}
