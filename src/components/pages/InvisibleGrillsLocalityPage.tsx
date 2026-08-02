import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ContentArticle } from "@/components/sections/ContentArticle";
import { SeoInternalLinkBoard } from "@/components/sections/SeoInternalLinkBoard";
import { BUSINESS_CONFIG } from "@/config/business";
import { getServiceGalleryImages } from "@/lib/images/get-service-images";
import { buildInvisibleGrillsLocalityContent } from "@/lib/content/build-invisible-grills-locality-content";
import { webPageSchema } from "@/lib/schema/web-page-schema";
import { breadcrumbSchema } from "@/lib/schema/breadcrumb-schema";
import { faqSchema } from "@/lib/schema/faq-schema";
import { serviceSchema } from "@/lib/schema/service-schema";
import { localBusinessSchema } from "@/lib/schema/local-business-schema";
import type { Area } from "@/types/location";
import type { PageRecord } from "@/types/page";
import type { BreadcrumbItem } from "@/lib/schema/breadcrumb-schema";
import type { Service } from "@/types/service";
import type { SeoLink } from "@/lib/content/build-invisible-grills-locality-content";

type Props = {
  page: PageRecord;
  area: Area;
  service: Service;
  breadcrumbs: BreadcrumbItem[];
};

const TRUST_PILLS = [
  "Free Site Visit",
  "SS316 Cables",
  "1–2 Day Install",
  "Warranty Support",
  "Child & Pet Safe",
];

function titleCaseLabel(label: string): string {
  return label
    .split(" ")
    .map((word) => (word.length ? word[0]!.toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function tidyLinks(links: SeoLink[], limit = 16) {
  const seen = new Set<string>();
  const out: { label: string; href: string }[] = [];
  for (const link of links) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    out.push({ label: titleCaseLabel(link.label), href: link.href });
    if (out.length >= limit) break;
  }
  return out;
}

export function InvisibleGrillsLocalityPage({ page, area, service, breadcrumbs }: Props) {
  const content = buildInvisibleGrillsLocalityContent(area);
  const gallery = getServiceGalleryImages(service.slug, area.name, 9).map((img, index) => ({
    ...img,
    alt: content.imageAlts[index % content.imageAlts.length] ?? img.alt,
  }));

  const schemas: Record<string, unknown>[] = [
    webPageSchema({
      name: page.title,
      description: page.metaDescription,
      url: page.canonicalUrl,
    }),
    breadcrumbSchema(breadcrumbs),
    localBusinessSchema(),
    serviceSchema({
      name: page.h1,
      description: page.metaDescription,
      url: page.canonicalUrl,
      image: service.heroImage,
      areaServed: area.name,
    }),
    faqSchema(content.faqs),
  ];

  const midCta = (
    <div className="my-10 rounded-2xl bg-primary-500 px-6 py-8 text-white sm:px-8">
      <p className="text-lg font-semibold">Need invisible grills in {content.locality}?</p>
      <p className="mt-2 max-w-2xl text-sm text-primary-100">
        Free site visit · Transparent pricing · SS316 options · Same-week installation on most balconies
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href={content.phoneHref} variant="accent" size="md">
          Call {BUSINESS_CONFIG.phone.display}
        </Button>
        <Button
          href={content.whatsappHref}
          variant="outline"
          size="md"
          className="border-white text-white hover:bg-white/10"
        >
          WhatsApp Quote
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <JsonLd data={schemas} />

      <div className="border-b border-[var(--border)] bg-neutral-50">
        <Container className="py-3">
          <Breadcrumbs items={breadcrumbs} />
        </Container>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(196,92,38,0.45), transparent 40%)",
          }}
        />
        <Container className="relative grid items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-100">
              Serving {content.locality}, {content.city}
            </p>
            <Heading level={1} className="mt-3 text-white">
              {content.h1}
            </Heading>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-50 sm:text-lg">
              {content.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {TRUST_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white"
                >
                  {pill}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={content.phoneHref} variant="accent" size="lg">
                Call {BUSINESS_CONFIG.phone.display}
              </Button>
              <Button
                href={content.whatsappHref}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                WhatsApp Quote
              </Button>
              <Button
                href="#high-intent"
                variant="outline"
                size="lg"
                className="border-white/60 text-white hover:bg-white/10"
              >
                Browse high-intent pages
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
            <Image
              src={service.heroImage || "/images/services/invisible-grills/01-img-20251025-132727-jpg.jpeg"}
              alt={content.imageAlts[0] ?? content.h1}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </Container>
      </section>

      {/* Sticky contact + jump nav */}
      <div className="sticky top-[var(--site-header-offset)] z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-2.5">
          <nav aria-label="Page sections" className="hidden max-w-[70%] gap-1 overflow-x-auto md:flex">
            {content.tableOfContents.slice(0, 8).map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium text-neutral-600 hover:bg-primary-50 hover:text-primary-700"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-neutral-600 md:hidden">
              Free inspection in <span className="font-semibold text-primary-700">{content.locality}</span>
            </p>
            <a
              href={content.phoneHref}
              className="rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-600"
            >
              Call Now
            </a>
            <a
              href={content.whatsappHref}
              className="rounded-lg bg-accent-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-600"
            >
              WhatsApp
            </a>
          </div>
        </Container>
      </div>

      {/* Long-scroll body */}
      <div className="bg-[var(--background)]">
        <Container className="grid gap-10 py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 lg:py-14">
          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--site-header-offset)+3.5rem)] max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-[var(--border)] bg-neutral-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                On this page
              </p>
              <ol className="mt-3 space-y-1.5 text-sm">
                {content.tableOfContents.map((item, index) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block rounded-md px-2 py-1 text-primary-700 hover:bg-white hover:text-accent-600"
                    >
                      {index + 1}. {item.label}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-5 border-t border-[var(--border)] pt-4">
                <p className="text-xs text-[var(--muted)]">
                  {content.allInternalLinks.length}+ internal links · {content.wordCountEstimate}+ words
                </p>
              </div>
            </div>
          </aside>

          <article className="min-w-0 space-y-14">
            {/* Overview */}
            <section id="overview" className="scroll-mt-36">
              <Heading level={2}>{content.sections[0]?.heading}</Heading>
              <div className="mt-5 space-y-4 text-[var(--muted)] leading-relaxed">
                {content.introExtended.map((p, index) => (
                  <p key={`intro-${index}`}>{p}</p>
                ))}
              </div>
              {content.sections[0]?.listItems ? (
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {content.sections[0].listItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-neutral-50 px-3 py-2 text-sm text-primary-900"
                    >
                      <span className="text-accent-500">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            {/* Why choose us */}
            <section id="why-choose-us" className="scroll-mt-36">
              <Heading level={2}>Why choose {content.company} in {content.locality}?</Heading>
              <p className="mt-3 text-[var(--muted)]">
                Premium SS316 invisible grills with professional fitting, free inspection and warranty support.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {content.whyChooseUs.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-medium text-primary-900"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500 text-[10px] text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* High intent links — curated, readable labels */}
            <section id="high-intent" className="scroll-mt-36 rounded-2xl border border-accent-200 bg-accent-50/40 p-6 sm:p-8">
              <Heading level={2}>Popular searches in {content.locality}</Heading>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Cost, installation, balcony, child safety and apartment topics — each opens a dedicated local guide.
              </p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {tidyLinks(content.highIntentLinks, 12).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between rounded-xl border border-accent-200 bg-white px-4 py-3 text-sm font-medium text-primary-800 hover:border-accent-400 hover:bg-accent-50"
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true" className="text-accent-500">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {midCta}

            {/* Our services */}
            <section id="our-services" className="scroll-mt-36">
              <Heading level={2}>Our invisible grill services in {content.locality}</Heading>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Every option below opens a high-intent landing page focused on {content.locality}.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {content.ourServices.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="block rounded-xl border border-[var(--border)] bg-white px-4 py-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
                    >
                      <span className="font-semibold text-primary-800">{item.title}</span>
                      <span className="mt-1 block text-sm text-[var(--muted)]">{item.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Applications */}
            <section id="applications" className="scroll-mt-36">
              <Heading level={2}>Applications</Heading>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Installed for homes and institutions across {content.city}.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {content.applications.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-primary-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-primary-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Benefits */}
            <section id="benefits" className="scroll-mt-36">
              <Heading level={2}>Benefits of invisible grills</Heading>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {content.benefits.map((benefit) => (
                  <article
                    key={benefit.title}
                    className="rounded-2xl border border-[var(--border)] p-5"
                  >
                    <h3 className="font-semibold text-primary-800">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {benefit.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="scroll-mt-36">
              <Heading level={2}>{content.sections.find((s) => s.id === "pricing")?.heading}</Heading>
              <div className="mt-5 space-y-4 text-[var(--muted)] leading-relaxed">
                {content.pricingNotes.map((p, index) => (
                  <p key={`pricing-${index}`}>{p}</p>
                ))}
              </div>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {(content.sections.find((s) => s.id === "pricing")?.listItems ?? []).map((item) => (
                  <li key={item} className="text-sm text-primary-800">
                    • {item}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {tidyLinks(
                  content.highIntentLinks.filter((l) =>
                    /cost|price|quote|estimate|affordable|cheap|rate|charges/i.test(l.label),
                  ),
                  8,
                ).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm font-medium text-primary-700 hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Materials */}
            <section id="materials" className="scroll-mt-36">
              <Heading level={2}>{content.sections.find((s) => s.id === "materials")?.heading}</Heading>
              <div className="mt-5 space-y-4 text-[var(--muted)] leading-relaxed">
                {content.materialsNotes.map((p, index) => (
                  <p key={`materials-${index}`}>{p}</p>
                ))}
              </div>
            </section>

            {/* Process */}
            <section id="process" className="scroll-mt-36">
              <Heading level={2}>Installation process in {content.locality}</Heading>
              <ol className="mt-6 space-y-4">
                {content.processSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="flex gap-4 rounded-xl border border-[var(--border)] bg-neutral-50 p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-primary-800">{step.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Comparison */}
            <section id="comparison" className="scroll-mt-36">
              <Heading level={2}>{content.sections.find((s) => s.id === "comparison")?.heading}</Heading>
              <div className="mt-5 space-y-4 text-[var(--muted)] leading-relaxed">
                {content.comparisonNotes.map((p, index) => (
                  <p key={`comparison-${index}`}>{p}</p>
                ))}
              </div>
            </section>

            {/* Local demand */}
            <section id="local-demand" className="scroll-mt-36 rounded-2xl bg-primary-50 p-6 sm:p-8">
              <Heading level={2}>Why invisible grills in {content.locality}?</Heading>
              <div className="mt-5 space-y-4 text-neutral-700 leading-relaxed">
                {content.whyLocalityExtended.map((p, index) => (
                  <p key={`why-local-${index}`}>{p}</p>
                ))}
              </div>
            </section>

            {midCta}

            {/* Gallery */}
            {gallery.length > 0 ? (
              <section id="gallery" className="scroll-mt-36">
                <Heading level={2}>Project photos — {content.locality}</Heading>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Real invisible grill installations with neat finishing for balconies and windows.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.map((image) => (
                    <figure
                      key={image.src + image.alt}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--border)]"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Nearby areas */}
            <section id="nearby-areas" className="scroll-mt-36">
              <Heading level={2}>Nearby areas we serve</Heading>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Also installing invisible grills near {content.locality}. Each link is a dedicated locality page.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {content.nearbyLocalityLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-medium text-primary-800 transition-colors hover:border-primary-300 hover:bg-primary-50"
                    >
                      {link.label}
                      <span aria-hidden="true" className="text-accent-500">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Maintenance */}
            <section id="maintenance" className="scroll-mt-36">
              <Heading level={2}>Maintenance & after-sales in {content.locality}</Heading>
              <div className="mt-5 space-y-4 text-[var(--muted)] leading-relaxed">
                {content.maintenanceNotes.map((p, index) => (
                  <p key={`maintenance-${index}`}>{p}</p>
                ))}
              </div>
            </section>

            {/* Ultra long-form SEO body */}
            <section id="seo-deep-guide" className="scroll-mt-36 space-y-12 border-t border-[var(--border)] pt-12">
              <div>
                <Heading level={2}>Complete guide — invisible grills in {content.locality}</Heading>
                <p className="mt-3 text-sm text-[var(--muted)]">
                  In-depth research covering materials, process, buyer checklist, neighbourhood coverage and
                  FAQs for invisible grills installation in {content.locality}.
                </p>
              </div>
              {content.longformBlocks.map((block) => (
                <ContentArticle key={block.id} block={block} />
              ))}
            </section>

            {/* FAQs — keep accordion readable; full set remains in schema via page content */}
            <section id="faqs" className="scroll-mt-36">
              <Heading level={2}>Frequently asked questions</Heading>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Common questions about invisible grills installation in {content.locality}.
              </p>
              <div className="mt-6">
                <FaqAccordion faqs={content.faqs.slice(0, 18)} />
              </div>
            </section>
          </article>
        </Container>
      </div>

      {/* Organised internal links — no raw URL dumps */}
      <SeoInternalLinkBoard
        title={`Helpful links for ${content.locality}`}
        intro="Clear, grouped internal links to services, nearby localities and popular invisible grill topics."
        groups={[
          {
            title: "Nearby installation pages",
            description: `Invisible grills near ${content.locality}`,
            links: tidyLinks(content.nearbyLocalityLinks, 12),
          },
          {
            title: "More Hyderabad localities",
            links: tidyLinks(content.moreLocalityLinks, 16),
          },
          {
            title: "Services & guides",
            links: tidyLinks(
              content.serviceLinks.filter((l) =>
                ["service", "area", "guide", "conversion"].includes(l.group ?? ""),
              ),
              12,
            ),
          },
          {
            title: "Related products",
            links: tidyLinks(
              content.serviceLinks.filter((l) =>
                ["related-service", "related-service-area"].includes(l.group ?? ""),
              ),
              12,
            ),
          },
          {
            title: "Popular searches",
            links: tidyLinks(content.highIntentLinks, 14),
          },
          {
            title: "Service types in this locality",
            links: tidyLinks(
              content.ourServices.map((s) => ({ label: s.title, href: s.href })),
              8,
            ),
          },
        ]}
      />

      {/* Final CTA */}
      <section id="quote" className="scroll-mt-36 bg-gradient-to-r from-primary-700 to-primary-500 text-white">
        <Container className="py-12 text-center lg:py-16">
          <Heading level={2} className="text-white">
            Get a free site inspection in {content.locality}
          </Heading>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">{content.cta}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={content.phoneHref} variant="accent" size="lg">
              Call {BUSINESS_CONFIG.phone.display}
            </Button>
            <Button
              href={content.whatsappHref}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              WhatsApp Us
            </Button>
            <Button
              href="/contact/"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Request Callback
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
