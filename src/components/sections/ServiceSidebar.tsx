import { BUSINESS_CONFIG } from "@/config/business";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

type ServiceSidebarProps = {
  areaName?: string;
  serviceName?: string;
  priceHighlight?: string;
  warrantyYears?: string;
};

export function ServiceSidebar({
  areaName,
  serviceName,
  priceHighlight,
}: ServiceSidebarProps) {
  const whatsappText = encodeURIComponent(
    `Hi, I need ${serviceName ?? "installation"} in ${areaName ?? "Hyderabad"}. Please share details.`,
  );

  return (
    <div className="space-y-4">
      {priceHighlight ? (
        <div className="rounded-xl border border-accent-200 bg-accent-50 p-5">
          <p className="text-sm font-medium text-accent-800">Indicative range</p>
          <p className="mt-2 text-2xl font-bold text-accent-900">{priceHighlight}</p>
          <p className="mt-2 text-xs text-accent-700">
            Final quotation only after free site inspection in {areaName ?? "Hyderabad"}.
          </p>
        </div>
      ) : null}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <Heading level={3}>Book free inspection</Heading>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Measurement-led recommendation · Written quotation · No invented flat rates
        </p>
        <div className="mt-4 space-y-2">
          <Button href={`tel:${BUSINESS_CONFIG.phone.raw}`} variant="primary" className="w-full">
            Call {BUSINESS_CONFIG.phone.display}
          </Button>
          <Button
            href={`https://wa.me/${BUSINESS_CONFIG.whatsapp.raw}?text=${whatsappText}`}
            variant="secondary"
            className="w-full"
          >
            WhatsApp Us
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm">
        <p className="font-semibold">What you can expect</p>
        <ul className="mt-3 space-y-2 text-[var(--muted)]">
          <li>Free on-site measurement visit</li>
          <li>Named materials in written scope</li>
          <li>Clear installation steps before work starts</li>
          <li>Hyderabad service coverage with local scheduling</li>
        </ul>
      </div>
    </div>
  );
}
