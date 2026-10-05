import dynamic from "next/dynamic";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Hero } from "@/components/sections/Hero";
import { TrustPoints } from "@/components/sections/TrustPoints";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { HomeServicesImageBlocks } from "@/components/sections/HomeServicesImageBlocks";
import { ServiceShowcase } from "@/components/sections/ServiceShowcase";
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
import { imageSchema } from "@/lib/schema/image-schema";
import type { PageRecord } from "@/types/page";

const ImageGallery = dynamic(
  () => import("@/components/sections/ImageGallery").then((m) => m.ImageGallery),
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
        eyebrow="Trusted home safety & protection solutions"
        title="Professional safety & protection solutions for Hyderabad homes & businesses"
        description={
          page.introduction ||
          content.heroDescription ||
          "Invisible grills, balcony safety nets, bird protection, mosquito nets and more — measured on site and installed with clear quotations."
        }
        image={content.heroImage}
        imageAlt={`${BUSINESS_CONFIG.name} — invisible grills and safety nets in ${city}`}
        primaryCta={{ label: "Get Free Quote", href: "/contact/" }}
        secondaryCta={{ label: "Call Now", href: `tel:${BUSINESS_CONFIG.phone.raw}` }}
      />

      <Section className="border-b border-[var(--border)] bg-white">
        <Container>
          <Breadcrumbs items={breadcrumbs} />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Professional installation",
              "Quality materials",
              `Local ${city} service`,
              "Multiple safety solutions",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm font-medium text-neutral-800"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <HomeServicesImageBlocks />

      <Section variant="muted">
        <Container>
          <SectionIntro
            eyebrow="By space"
            title="Solutions for every space"
            description="Choose your property type to see the most relevant safety and protection options."
          />
          <div className="mt-8">
            <ServiceShowcase />
          </div>
        </Container>
      </Section>

      <Section id="why-us">
        <Container>
          <SectionIntro
            eyebrow="Why Secure Vista"
            title="Why choose Secure Vista Solutions"
            description="Practical home-safety installation with local coverage, clear communication and materials suited to everyday use."
          />
          <TrustPoints className="mt-10" cityName={city} />
        </Container>
      </Section>

      <Section variant="muted">
        <Container>
          <SectionIntro
            title="How installation works"
            description="A clear path from enquiry to handover — no surprise steps."
          />
          <ProcessTimeline className="mt-10" />
        </Container>
      </Section>

      <Section>
        <Container className="section-stack">
          {earlyBlocks.map((block) => (
            <div key={block.id}>
              <ContentArticle block={block} />
            </div>
          ))}
        </Container>
      </Section>

      <Section variant="muted" id="service-areas">
        <Container>
          <SectionIntro
            title={`Serving ${city} & nearby areas`}
            description={`Popular neighbourhoods with dedicated service pages. Full coverage spans 350+ verified localities.`}
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {content.nearbyAreas.slice(0, 20).map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="border border-[var(--border)] bg-white px-3.5 py-2 text-sm font-medium text-primary-800 transition-colors hover:border-primary-300 hover:bg-primary-50"
              >
                {area.label}
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Button href="/locations/hyderabad/" variant="outline">
              View all service areas
            </Button>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <ImageGallery
            title="Installation gallery"
            description={`Real project photos — invisible grills, safety nets and bird protection across ${city}.`}
            images={galleryImages}
            columns={4}
          />
        </Container>
      </Section>

      <Section variant="muted">
        <Container className="section-stack">
          {laterBlocks.map((block) => (
            <div key={block.id}>
              <ContentArticle block={block} />
            </div>
          ))}

          <div id="related-services" className="scroll-mt-28">
            <SectionIntro title="Related services" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.relatedServices.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="card-surface block p-5"
                >
                  <h3 className="font-semibold text-primary-800">{service.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {service.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionIntro
            title="Frequently asked questions"
            description={`Coverage, materials, timelines and booking a free inspection in ${city}.`}
          />
          <div className="mt-8">
            <FaqAccordion faqs={content.faqs.slice(0, 12)} />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact/" size="lg">
              Get Free Quote
            </Button>
            <Button href={`tel:${BUSINESS_CONFIG.phone.raw}`} variant="outline" size="lg">
              Call {BUSINESS_CONFIG.phone.display}
            </Button>
          </div>
        </Container>
      </Section>

      <SeoInternalLinkBoard
        title="Explore more"
        intro="Services, guides and popular Hyderabad area pages — organised for readers and SEO."
        groups={content.linkGroups}
      />

      <CtaBanner className="border-t border-[var(--border)]" />
    </>
  );
}
