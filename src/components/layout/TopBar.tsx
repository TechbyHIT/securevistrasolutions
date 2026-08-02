import { BUSINESS_CONFIG } from "@/config/business";
import { Container } from "@/components/ui/Container";

function MailIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIconSmall() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

export function TopBar() {
  return (
    <div className="border-b border-primary-800 bg-primary-900 text-primary-100">
      <Container className="flex h-[var(--topbar-height)] items-center justify-between gap-3 text-[11px] sm:text-xs">
        <p className="hidden min-w-0 truncate font-medium sm:block">
          Premium invisible grills &amp; safety nets across {BUSINESS_CONFIG.serviceArea.primaryCity}
        </p>
        <p className="truncate font-medium sm:hidden">{BUSINESS_CONFIG.serviceArea.primaryCity} · Home safety</p>
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <a
            href={`mailto:${BUSINESS_CONFIG.email}`}
            className="hidden items-center gap-1.5 transition-colors hover:text-white md:inline-flex"
          >
            <MailIcon />
            <span className="max-w-[140px] truncate lg:max-w-none">{BUSINESS_CONFIG.email}</span>
          </a>
          <a
            href={`tel:${BUSINESS_CONFIG.phone.raw}`}
            className="inline-flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-accent-200"
          >
            <PhoneIconSmall />
            {BUSINESS_CONFIG.phone.display}
          </a>
        </div>
      </Container>
    </div>
  );
}
