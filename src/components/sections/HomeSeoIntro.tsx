import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { BUSINESS_CONFIG } from "@/config/business";
import { getPublishedServices } from "@/data/initial-services";
import { getPublishedLocations } from "@/data/initial-locations";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import {
  SERVICES_MEGA_MENU,
  buildIntentPageUrl,
  DEFAULT_MEGA_MENU_AREA,
} from "@/config/mega-menu";

const TRUST_BADGES = [
  "Free Site Inspection",
  "Affordable Pricing",
  "350+ Areas Covered",
  "Same-Day Quotes",
  "Quality Materials",
  "Professional Installation",
];

const WHY_CHOOSE_US = [
  {
    title: "Measurement-first quoting",
    description:
      "Every project starts with a free on-site visit. We measure openings, check fixing surfaces and recommend materials before you receive a written quotation — no guesswork from photos alone.",
  },
  {
    title: "Hyderabad specialists",
    description:
      "We install across 350+ localities from Gachibowli and Hitech City to Secunderabad and Uppal. Our teams know society access rules, high-rise safety requirements and local weather exposure.",
  },
  {
    title: "Premium branded materials",
    description:
      "Stainless steel cables, Garware-grade HDPE nets, corrosion-resistant hooks and powder-coated frames — specified by grade so you know exactly what is being installed.",
  },
  {
    title: "Transparent after-sales support",
    description:
      "WhatsApp and phone support for warranty questions, tension checks and section replacements. We document scope at handover so there is no confusion later.",
  },
];

const PROCESS_STEPS = [
  { step: "1", title: "Call or WhatsApp", detail: "Share your locality, property type and photos of the openings." },
  { step: "2", title: "Free site inspection", detail: "We visit, measure and explain material options in plain language." },
  { step: "3", title: "Written quotation", detail: "Clear scope, material grade, timeline and price — no hidden add-ons." },
  { step: "4", title: "Professional installation", detail: "Trained technicians install, test and hand over with care tips." },
];

const HOME_FAQS = [
  {
    q: "Do you cover my area in Hyderabad?",
    a: "Yes — we serve 350+ neighbourhoods across Hyderabad including Gachibowli, Kondapur, Madhapur, Jubilee Hills, Banjara Hills, Secunderabad, Kukatpally and many more. Share your pin code when you call.",
  },
  {
    q: "Is site inspection really free?",
    a: "Yes. Inspection and quotation are free with no obligation. We believe accurate pricing requires on-site measurement, especially for balconies and high-rise windows.",
  },
  {
    q: "How soon can you install?",
    a: "Many single-balcony projects schedule within the same week after quotation approval, depending on material availability and society access permissions.",
  },
];

const SEO_HIGHLIGHTS = [
  {
    title: "Invisible grills near me in Hyderabad",
    description:
      "Stainless steel invisible grills for balconies and windows that protect children and pets without blocking your view. Custom cable spacing, corrosion-resistant hardware and neat finishing for apartments, villas and high-rise homes.",
    href: buildIntentPageUrl("invisible-grills", "invisible-grills", DEFAULT_MEGA_MENU_AREA),
  },
  {
    title: "Balcony safety nets & pigeon nets",
    description:
      "HDPE and nylon safety nets for balcony fall protection, bird control and pigeon proofing. We measure each opening, recommend the right mesh grade and install with secure edge fixing for long-term durability in Hyderabad weather.",
    href: buildIntentPageUrl("balcony-safety-nets", "balcony-safety-net", DEFAULT_MEGA_MENU_AREA),
  },
  {
    title: "Bird spikes, cloth hangers & sports nets",
    description:
      "Complete home utility solutions including stainless steel bird spikes, ceiling cloth drying hangers and cricket practice nets. Ideal for duct areas, terraces, balconies and backyard sports setups across Gachibowli, Kondapur, Madhapur and all Hyderabad.",
    href: buildIntentPageUrl("bird-spikes", "bird-spikes", DEFAULT_MEGA_MENU_AREA),
  },
];

export function HomeSeoIntro() {
  const location = getPublishedLocations()[0];
  const citySlug = location?.slug ?? "hyderabad";
  const cityName = location?.name ?? "Hyderabad";
  const services = getPublishedServices();

  return (
    <section className="border-b border-[var(--border)] bg-[var(--background)]">
      <Container className="py-10 lg:py-14">
        <div className="flex flex-wrap gap-2">
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700"
            >
              <svg className="h-3.5 w-3.5 text-accent-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {badge}
            </span>
          ))}
        </div>

        <div className="mt-8 max-w-3xl">
          <Heading level={2}>
            Hyderabad&apos;s trusted installer for grills, nets &amp; home safety
          </Heading>
          <p className="mt-4 text-[var(--muted)] leading-relaxed">
            {BUSINESS_CONFIG.name} provides measurement-led installation of invisible grills,
            balcony safety nets, children and pet safety nets, mosquito nets, pigeon nets, bird
            spikes, ceiling cloth hangers and cricket nets across Hyderabad. Every project starts
            with a free site visit, clear material recommendation and transparent pricing — so you
            know exactly what you are getting before work begins.
          </p>
          <p className="mt-4 text-[var(--muted)] leading-relaxed">
            Whether you need{" "}
            <Link href={buildIntentPageUrl("invisible-grills", "invisible-grill-for-balcony")} className="text-primary-600 hover:underline">
              balcony invisible grills
            </Link>
            ,{" "}
            <Link href={buildIntentPageUrl("balcony-safety-nets", "balcony-bird-net")} className="text-primary-600 hover:underline">
              anti-bird nets
            </Link>
            ,{" "}
            <Link href={buildIntentPageUrl("children-safety-nets", "child-safety-net")} className="text-primary-600 hover:underline">
              child safety nets
            </Link>{" "}
            or{" "}
            <Link href={buildIntentPageUrl("cloth-hangers", "ceiling-cloth-hanger")} className="text-primary-600 hover:underline">
              ceiling cloth hangers
            </Link>
            , our team serves 350+ localities including Gachibowli, Hitech City, Kondapur, Jubilee
            Hills, Secunderabad and beyond.
          </p>
          <p className="mt-4 text-[var(--muted)] leading-relaxed">
            Hyderabad homes range from glass-fronted towers in the IT corridor to independent villas
            with open terrace edges — each with different balcony depths, railing gaps and exposure
            to sun and monsoon rain. We specify SS304 or SS316 stainless cables, UV-stabilised HDPE
            mesh and secure hook layouts based on your household: toddlers, pets, birds or view
            retention. That is why on-site inspection matters more than a phone quote.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SEO_HIGHLIGHTS.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-[var(--border)] bg-neutral-50 p-6"
            >
              <h3 className="font-semibold text-primary-700">
                <Link href={item.href} className="hover:text-accent-600">
                  {item.title}
                </Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
              <Link
                href={item.href}
                className="mt-4 inline-block text-sm font-semibold text-accent-600 hover:text-accent-700"
              >
                Learn more &rarr;
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <Heading level={3}>Why {BUSINESS_CONFIG.name}?</Heading>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.title} className="rounded-xl border border-[var(--border)] p-5">
                <h4 className="font-semibold text-primary-800">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-[var(--border)] bg-neutral-50 p-6 lg:p-8">
          <Heading level={3}>How installation works</Heading>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((item) => (
              <li key={item.step} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                  {item.step}
                </span>
                <div>
                  <p className="font-semibold text-primary-800">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12">
          <Heading level={3}>{cityName} service pages — browse by product</Heading>
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
            Detailed guides for each service in {cityName}: pricing factors, materials, installation
            process, local neighbourhoods and FAQs — written for homeowners researching before they book.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={buildServiceInCityPath(service.slug, citySlug)}
                className="rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:border-primary-400 hover:bg-primary-50"
              >
                {service.name} in {cityName}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <Heading level={3}>Common questions</Heading>
          <dl className="mt-6 space-y-6">
            {HOME_FAQS.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-[var(--border)] p-5">
                <dt className="font-semibold text-primary-800">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 rounded-xl bg-primary-500 p-6 text-white lg:p-8">
          <Heading level={3} className="text-white">
            Browse all services by category
          </Heading>
          <p className="mt-2 max-w-2xl text-primary-100 text-sm">
            Explore our full range of home safety and utility solutions. Each service page includes
            pricing guidance, materials, installation process and area-specific information for
            Hyderabad.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {SERVICES_MEGA_MENU.map((column) => (
              <Link
                key={column.title}
                href={`/services/${column.serviceSlug}/`}
                className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
              >
                {column.title}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
