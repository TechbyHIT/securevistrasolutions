import dynamic from "next/dynamic";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Hero } from "@/components/sections/Hero";
import { TrustStatsBar } from "@/components/sections/TrustStatsBar";
import { HomeServicesImageBlocks } from "@/components/sections/HomeServicesImageBlocks";
import { ContentArticle } from "@/components/sections/ContentArticle";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { buildHomeContent } from "@/lib/content/build-home-content";
import { BUSINESS_CONFIG } from "@/config/business";
import { SITE_CONFIG } from "@/config/site";
import { webPageSchema } from "@/lib/schema/web-page-schema";
import { breadcrumbSchema } from "@/lib/schema/breadcrumb-schema";
import { organizationSchema } from "@/lib/schema/organization-schema";
import { localBusinessSchema } from "@/lib/schema/local-business-schema";
import { serviceSchema } from "@/lib/schema/service-schema";
import { faqSchema } from "@/lib/schema/faq-schema";
import { aggregateRatingSchema } from "@/lib/schema/aggregate-rating-schema";
import { imageSchema } from "@/lib/schema/image-schema";
import type { PageRecord } from "@/types/page";

const ImageGallery = dynamic(
  () => import("@/components/sections/ImageGallery").then((m) => m.ImageGallery),
  { ssr: true },
);
const CustomerReviews = dynamic(
  () => import("@/components/sections/CustomerReviews").then((m) => m.CustomerReviews),
  { ssr: true },
);
const FaqAccordion = dynamic(
  () => import("@/components/sections/FaqAccordion").then((m) => m.FaqAccordion),
  { ssr: true },
);
const SeoInternalLinkBoard = dynamic(
  () => import("@/components/sections/SeoInternalLinkBoard").then((m) => m.SeoInternalLinkBoard),
  { ssr: true },
);

type HomePageContentProps = {
  page: PageRecord;
};

export function HomePageContent({ page }: HomePageContentProps) {
  const content = buildHomeContent();
  const canonical = page.canonicalUrl || `${SITE_CONFIG.url}/`;
  const city = BUSINESS_CONFIG.serviceArea.primaryCity;

  const breadcrumbs = [{ label: "Home", href: "/" }];

  const schemas: Record<string, unknown>[] = [
    webPageSchema({
      name: page.title || content.metaTitle,
      description: page.metaDescription || content.metaDescription,
      url: canonical,
    }),
    breadcrumbSchema(breadcrumbs),
    organizationSchema(),
    localBusinessSchema(),
    serviceSchema({
      name: content.h1,
      description: content.metaDescription,
      url: canonical,
      image: content.heroImage,
      areaServed: city,
    }),
    faqSchema(content.faqs),
    aggregateRatingSchema({
      itemName: content.h1,
      reviews: content.reviews,
    }),
  ];

  const galleryImages = content.galleryImages.slice(0, 8);

  for (const image of galleryImages.slice(0, 4)) {
    schemas.push(imageSchema({ url: image.src, caption: image.alt }));
  }

  const earlyBlockIds = new Set(["home-intro", "home-local", "home-benefits"]);
  const earlyBlocks = content.blocks.filter((block) => earlyBlockIds.has(block.id));
  const laterBlocks = content.blocks.filter((block) => !earlyBlockIds.has(block.id));

  return (
    <>
      <JsonLd data={schemas} />

      <Hero
        variant="overlay"
        badge={`#1 for invisible grills & safety nets in ${city}`}
        title={page.h1 || content.h1}
        description={page.introduction || content.heroDescription}
        image={content.heroImage}
        imageAlt={`${BUSINESS_CONFIG.name} — invisible grills and safety nets in ${city}`}
        primaryCta={{ label: "Call Now", href: `tel:${BUSINESS_CONFIG.phone.raw}` }}
        secondaryCta={{ label: "View Services", href: "#home-services" }}
      />

      <Section className="border-b-0">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
          <TrustStatsBar className="mt-6" cityName={city} />

          <div id="quick-highlights" className="mt-10 scroll-mt-28">
            <SectionIntro
              title="Quick highlights"
              description="What you get with every project — free inspection, clear quotes and professional installation."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {content.highlights.map((item) => (
                <li
                  key={item}
                  className="card-surface flex items-start gap-3 px-4 py-3.5 text-sm text-[var(--foreground)]"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <HomeServicesImageBlocks />

      <Section>
        <Container className="section-stack">
          {earlyBlocks.map((block) => (
            <div key={block.id} className="card-surface p-6 sm:p-8 lg:p-10">
              <ContentArticle block={block} />
            </div>
          ))}
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <SectionIntro
            title="10 recent project examples"
            description={`Sample installations across ${city} — each links to a local service or locality page.`}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.projects.map((project) => (
              <article key={project.title + project.area} className="card-surface flex h-full flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                  {project.area} · {project.service}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                  {project.summary}
                </p>
                <Link
                  href={project.href}
                  className="mt-4 text-sm font-semibold text-accent-600 hover:text-accent-700"
                >
                  View details →
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <ImageGallery
            title="Project gallery"
            description={`Real installation photos — invisible grills, safety nets, bird protection and more across ${city}.`}
            images={galleryImages}
            columns={4}
          />
        </Container>
      </Section>

      <Section variant="muted">
        <Container className="section-stack">
          {laterBlocks.map((block) => (
            <div key={block.id} className="card-surface p-6 sm:p-8 lg:p-10">
              <ContentArticle block={block} />
            </div>
          ))}
        </Container>
      </Section>

      <Section>
        <Container>
          <CustomerReviews reviews={content.reviews} title={`10 customer reviews from ${city}`} />
        </Container>
      </Section>

      <Section variant="muted">
        <Container className="section-stack">
          <div id="nearby-areas" className="scroll-mt-28">
            <SectionIntro
              title="Nearby areas we serve"
              description={`Popular ${city} neighbourhoods with dedicated location pages. Full city coverage spans 350+ localities.`}
            />
            <div className="mt-8 flex flex-wrap gap-2">
              {content.nearbyAreas.slice(0, 24).map((area) => (
                <Link
                  key={area.href}
                  href={area.href}
                  className="rounded-full border border-primary-200 bg-white px-3 py-1.5 text-sm font-medium text-primary-700 shadow-sm transition-colors hover:border-primary-400 hover:bg-primary-50"
                >
                  {area.label}
                </Link>
              ))}
            </div>
            <Link
              href="/locations/hyderabad/"
              className="mt-4 inline-block text-sm font-semibold text-accent-600 hover:text-accent-700"
            >
              Browse all Hyderabad areas →
            </Link>
          </div>

          <div id="nearby-cities" className="scroll-mt-28">
            <SectionIntro title="Nearby cities & corridors" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.nearbyCities.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="card-surface block p-5 transition-colors hover:border-primary-300"
                >
                  <h3 className="font-semibold text-primary-800">{item.label}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{item.note}</p>
                </Link>
              ))}
            </div>
          </div>

          <div id="related-services" className="scroll-mt-28">
            <SectionIntro title="Related services" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.relatedServices.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="card-surface block p-5 transition-colors hover:border-primary-300"
                >
                  <h3 className="font-semibold text-primary-800">{service.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{service.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionIntro
            title="20 frequently asked questions"
            description={`Answers about coverage, materials, pricing, timelines and booking a free inspection in ${city}.`}
          />
          <div className="mt-8">
            <FaqAccordion faqs={content.faqs} />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={`tel:${BUSINESS_CONFIG.phone.raw}`} size="lg" className="rounded-full px-8">
              Call {BUSINESS_CONFIG.phone.display}
            </Button>
            <Button href="/contact/" variant="outline" size="lg" className="rounded-full px-8">
              Request free inspection
            </Button>
          </div>
        </Container>
      </Section>

      <SeoInternalLinkBoard
        title="Internal linking suggestions"
        intro="Curated links to services, high-intent topics, guides and popular Hyderabad area hubs — organised for readers and SEO."
        groups={content.linkGroups}
      />

      <CtaBanner className="border-t border-accent-600/30" />
    </>
  );
}
