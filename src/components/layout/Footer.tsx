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
  const serviceLinks = SERVICES_MEGA_MENU.flatMap((column) => column.links).slice(0, 8);
  const areaLinks = AREAS_MEGA_MENU.flatMap((col) => col.areas).slice(0, 8);
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp.raw.replace(/\D/g, "")}`;

  return (
    <footer className="border-t border-[var(--border)] bg-primary-900 text-white">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              Company
            </p>
            <Link href="/" aria-label={`${BUSINESS_CONFIG.name} home`} className="mt-4 inline-block">
              <Image
                src={BUSINESS_CONFIG.logo}
                alt={BUSINESS_CONFIG.name}
                width={220}
                height={72}
                className="h-11 w-auto max-w-[13rem] object-contain object-left brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-primary-100">
              Professional home-safety installation across Hyderabad — invisible grills, safety
              nets, bird protection, mosquito nets and more.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              Services
            </p>
            <ul className="mt-4 space-y-2 text-sm text-primary-100">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={getMegaMenuLinkHref(link)} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services/" className="font-medium text-accent-300 hover:text-accent-200">
                  All services →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              Service areas
            </p>
            <ul className="mt-4 space-y-2 text-sm text-primary-100">
              {areaLinks.map((area) => (
                <li key={area.slug}>
                  <Link href={buildAreaPageUrl(area.slug)} className="hover:text-white">
                    {area.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/locations/${DEFAULT_LOCATION_SLUG}/`}
                  className="font-medium text-accent-300 hover:text-accent-200"
                >
                  All Hyderabad areas →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              Support
            </p>
            <ul className="mt-4 space-y-2 text-sm text-primary-100">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              {FOOTER_QUICK_LINKS.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-300">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-primary-100">
              <li>
                <a href={`tel:${BUSINESS_CONFIG.phone.raw}`} className="font-semibold text-white hover:text-accent-300">
                  {BUSINESS_CONFIG.phone.display}
                </a>
              </li>
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS_CONFIG.email}`} className="hover:text-white">
                  {BUSINESS_CONFIG.email}
                </a>
              </li>
              <li className="leading-relaxed">
                {BUSINESS_CONFIG.address.street}
                <br />
                {BUSINESS_CONFIG.address.city}, {BUSINESS_CONFIG.address.state}{" "}
                {BUSINESS_CONFIG.address.postalCode}
              </li>
            </ul>
            <Link
              href="/contact/"
              className="mt-5 inline-flex bg-accent-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-accent-600"
            >
              Get Free Quote
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-primary-700 pt-6 text-sm text-primary-200 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {BUSINESS_CONFIG.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {FOOTER_POLICY_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact/" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
