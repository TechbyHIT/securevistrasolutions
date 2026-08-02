import Link from "next/link";
import Image from "next/image";
import { BUSINESS_CONFIG } from "@/config/business";
import { FOOTER_POLICY_LINKS, FOOTER_QUICK_LINKS, PRIMARY_NAV } from "@/config/navigation";
import {
  SERVICES_MEGA_MENU,
  AREAS_MEGA_MENU,
  getMegaMenuLinkHref,
  buildAreaPageUrl,
  DEFAULT_LOCATION_SLUG,
} from "@/config/mega-menu";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();
  const footerServiceColumns = SERVICES_MEGA_MENU.slice(0, 4);

  return (
    <footer className="border-t border-[var(--border)] bg-primary-50 text-[var(--foreground)]">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" aria-label={`${BUSINESS_CONFIG.name} home`} className="inline-block">
              <Image
                src={BUSINESS_CONFIG.logo}
                alt={BUSINESS_CONFIG.name}
                width={220}
                height={72}
                className="h-12 w-auto max-w-[14rem] object-contain object-left"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              {BUSINESS_CONFIG.description} We install invisible grills, balcony safety nets,
              pigeon nets, bird spikes, ceiling cloth hangers and cricket practice nets across
              350+ Hyderabad neighbourhoods with free site inspection and transparent pricing.
            </p>
            <p className="mt-4 text-sm">
              <a
                href={`tel:${BUSINESS_CONFIG.phone.raw}`}
                className="font-medium text-primary-700 hover:text-primary-900"
              >
                {BUSINESS_CONFIG.phone.display}
              </a>
            </p>
            <p className="mt-1 text-sm">
              <a
                href={`mailto:${BUSINESS_CONFIG.email}`}
                className="text-primary-700 hover:text-primary-900"
              >
                {BUSINESS_CONFIG.email}
              </a>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800">
                Free Inspection
              </span>
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800">
                Affordable Pricing
              </span>
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800">
                Same-Day Quotes
              </span>
            </div>
          </div>

          {footerServiceColumns.map((column) => (
            <div key={column.title}>
              <p className="font-semibold text-primary-900">{column.title}</p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                {column.links.slice(0, 6).map((link) => (
                  <li key={link.label}>
                    <Link href={getMegaMenuLinkHref(link)} className="hover:text-primary-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-semibold text-primary-900">Popular Areas</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {AREAS_MEGA_MENU.flatMap((col) => col.areas)
                .slice(0, 10)
                .map((area) => (
                  <li key={area.slug}>
                    <Link href={buildAreaPageUrl(area.slug)} className="hover:text-primary-700">
                      {area.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href={`/locations/${DEFAULT_LOCATION_SLUG}/`}
                  className="font-medium text-accent-600 hover:text-accent-700"
                >
                  All Hyderabad areas &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-8 border-t border-[var(--border)] pt-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-primary-900">Navigation</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-primary-700">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-primary-900">Resources</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {FOOTER_QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-primary-700">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-primary-900">Legal</p>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {FOOTER_POLICY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-primary-700">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-neutral-700">
              {BUSINESS_CONFIG.address.street}
              <br />
              {BUSINESS_CONFIG.address.city}, {BUSINESS_CONFIG.address.state}{" "}
              {BUSINESS_CONFIG.address.postalCode}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-sm text-neutral-600">
          <p>
            &copy; {year} {BUSINESS_CONFIG.name}. All rights reserved. Serving Hyderabad only.
          </p>
        </div>
      </Container>
    </footer>
  );
}
