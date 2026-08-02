import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Hero } from "@/components/sections/Hero";
import { TrustStatsBar } from "@/components/sections/TrustStatsBar";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { ContentArticle } from "@/components/sections/ContentArticle";
import { ServiceSidebar } from "@/components/sections/ServiceSidebar";
import { ImageGallery } from "@/components/sections/ImageGallery";
import { CustomerReviews } from "@/components/sections/CustomerReviews";
import { SeoInternalLinkBoard } from "@/components/sections/SeoInternalLinkBoard";
import { buildPageContent } from "@/lib/content/build-page-content";
import { generateInternalLinks } from "@/lib/internal-links/generate-internal-links";
import { getServiceSeoProfile } from "@/data/service-seo-profiles";
import { getServiceGalleryImages } from "@/lib/images/get-service-images";
import { webPageSchema } from "@/lib/schema/web-page-schema";
import { breadcrumbSchema } from "@/lib/schema/breadcrumb-schema";
import { faqSchema } from "@/lib/schema/faq-schema";
import { serviceSchema } from "@/lib/schema/service-schema";
import { localBusinessSchema } from "@/lib/schema/local-business-schema";
import { organizationSchema } from "@/lib/schema/organization-schema";
import { aggregateRatingSchema } from "@/lib/schema/aggregate-rating-schema";
import { imageSchema } from "@/lib/schema/image-schema";
import { BUSINESS_CONFIG } from "@/config/business";
import { getServiceById } from "@/data/initial-services";
import { getLocationById } from "@/data/initial-locations";
import { getAreaById } from "@/data/initial-areas";
import type { PageRecord } from "@/types/page";
import type { BreadcrumbItem } from "@/lib/schema/breadcrumb-schema";

type ProgrammaticPageProps = {
  page: PageRecord;
  breadcrumbs: BreadcrumbItem[];
  showHero?: boolean;
  heroImage?: string;
};

export function ProgrammaticPage({ page, breadcrumbs, showHero = true, heroImage }: ProgrammaticPageProps) {
  const service = page.serviceId ? getServiceById(page.serviceId) : undefined;
  const location = page.locationId ? getLocationById(page.locationId) : undefined;
  const area = page.areaId ? getAreaById(page.areaId) : undefined;
  const profile = service ? getServiceSeoProfile(service.slug) : undefined;
  const cityName = location?.name ?? area?.name ?? "Hyderabad";

  const { blocks, faqs, tableOfContents, priceHighlight, warrantyYears, reviews, galleryCaptions, internalLinkSuggestions } = buildPageContent({
    pageType: page.pageType,
    service,
    location,
    area,
    intentSlug: page.intentSlug,
    h1: page.h1,
  });

  const internalLinks = generateInternalLinks(page);
  const whatsappText = encodeURIComponent(
    `Hi, I need help with ${page.h1}. Area: ${area?.name ?? cityName}.`,
  );

  const schemas: Record<string, unknown>[] = [
    webPageSchema({
      name: page.title,
      description: page.metaDescription,
      url: page.canonicalUrl,
    }),
    breadcrumbSchema(breadcrumbs),
    organizationSchema(),
  ];

  if (faqs.length > 0) {
    schemas.push(faqSchema(faqs));
  }

  if (page.pageType === "service-in-city" && service && location) {
    schemas.push(localBusinessSchema());
    schemas.push(
      serviceSchema({
        name: page.h1,
        description: page.metaDescription,
        url: page.canonicalUrl,
        image: service.heroImage,
        areaServed: location.name,
      }),
    );
    if (reviews?.length) {
      schemas.push(
        aggregateRatingSchema({
          itemName: page.h1,
          reviews,
        }),
      );
    }
  }

  const showGallery = Boolean(service?.galleryImages.length);
  const isRichServicePage =
    page.pageType === "service-in-city" ||
    page.pageType === "service-area-intent" ||
    page.pageType === "service-area" ||
    page.pageType === "service";

  const galleryLimit = page.pageType === "service-in-city" ? 24 : 12;
  const galleryImages =
    service && showGallery
      ? (galleryCaptions?.length
          ? galleryCaptions.slice(0, galleryLimit)
          : getServiceGalleryImages(service.slug, area?.name ?? cityName, galleryLimit)
        ).map((img) => ("caption" in img ? { src: img.src, alt: img.alt } : img))
      : [];

  for (const image of galleryImages.slice(0, 5)) {
    schemas.push(imageSchema({ url: image.src, caption: image.alt }));
  }

  const blocksBeforeGallery = blocks.filter((block) =>
    ["sic-highlights", "sic-intro", "sic-local", "sic-who-needs"].includes(block.id),
  );
  const blocksAfterGallery = blocks.filter(
    (block) => !["sic-highlights", "sic-intro", "sic-local", "sic-who-needs"].includes(block.id),
  );

  return (
    <>
      <JsonLd data={schemas} />
      {showHero ? (
        <Hero
          title={page.h1}
          description={page.introduction}
          image={heroImage ?? page.openGraphImage}
          imageAlt={page.openGraphImageAlt}
          primaryCta={{
            label: "Call Now",
            href: `tel:${BUSINESS_CONFIG.phone.raw}`,
          }}
          secondaryCta={{
            label: "WhatsApp Us",
            href: `https://wa.me/${BUSINESS_CONFIG.whatsapp.raw}?text=${whatsappText}`,
          }}
        />
      ) : (
        <Section variant="muted">
          <Container>
            <Breadcrumbs items={breadcrumbs} className="mb-4" />
            <Heading level={1}>{page.h1}</Heading>
            <p className="mt-4 max-w-3xl text-lg text-[var(--muted)]">{page.introduction}</p>
          </Container>
        </Section>
      )}

      {isRichServicePage ? (
        <Section variant="muted" className="py-6">
          <Container>
            <TrustStatsBar cityName={cityName} />
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container>
          {showHero ? <Breadcrumbs items={breadcrumbs} className="mb-8" /> : null}
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="space-y-10">
              {isRichServicePage && tableOfContents.length > 0 ? (
                <TableOfContents items={tableOfContents} />
              ) : null}

              {page.pageType === "service-in-city"
                ? blocksBeforeGallery.map((block) => (
                    <ContentArticle key={block.id} block={block} />
                  ))
                : null}

              {galleryImages.length > 0 ? (
                <ImageGallery
                  id="gallery"
                  title={
                    area
                      ? `${service?.name ?? "Service"} installation photos in ${area.name}`
                      : `${service?.name ?? "Service"} installation photos in ${cityName}`
                  }
                  description={`Real ${service?.shortName.toLowerCase() ?? "installation"} project photos from ${cityName} — quality materials, neat finishing and professional setup.`}
                  images={galleryImages}
                  columns={3}
                />
              ) : null}

              {page.pageType === "service-in-city" && reviews?.length ? (
                <CustomerReviews reviews={reviews} />
              ) : null}

              {(page.pageType === "service-in-city" ? blocksAfterGallery : blocks).map((block) => (
                <ContentArticle key={block.id} block={block} />
              ))}

              {faqs.length > 0 ? (
                <div id="faq">
                  <Heading level={2} className="mb-4">
                    Frequently asked questions
                  </Heading>
                  <FaqAccordion faqs={faqs.slice(0, 18)} />
                </div>
              ) : null}
            </div>

            <aside className="space-y-6">
              {isRichServicePage ? (
                <ServiceSidebar
                  areaName={area?.name ?? cityName}
                  serviceName={service?.name}
                  priceHighlight={priceHighlight}
                  warrantyYears={warrantyYears ?? profile?.warrantyYears}
                />
              ) : null}

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <Heading level={3}>Related pages</Heading>
                <ul className="mt-3 space-y-2 text-sm">
                  {(internalLinkSuggestions?.length
                    ? internalLinkSuggestions.map((link) => ({ label: link.label, href: link.href }))
                    : internalLinks
                  )
                    .filter((link) => !link.href.includes("://") && link.label.length < 80)
                    .slice(0, 14)
                    .map((link, index) => (
                      <li key={`${link.href}::${index}`}>
                        <Link href={link.href} className="text-primary-600 hover:underline">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <SeoInternalLinkBoard
        title={`Explore more around ${area?.name ?? cityName}`}
        intro="Grouped guides and locality pages — clear labels, no random URL dumps."
        groups={[
          {
            title: "Related pages",
            links: (internalLinkSuggestions?.length
              ? internalLinkSuggestions.map((link) => ({ label: link.label, href: link.href }))
              : internalLinks
            )
              .filter((link) => link.label.length < 70)
              .slice(0, 16),
          },
          {
            title: "Services",
            links: [
              { label: "All services", href: "/services/" },
              { label: "Invisible grills in Hyderabad", href: "/invisible-grills-in-hyderabad/" },
              { label: "Balcony safety nets in Hyderabad", href: "/balcony-safety-nets-in-hyderabad/" },
              { label: "Pricing guide", href: "/pricing-guide/" },
              { label: "Installation process", href: "/installation-process/" },
              { label: "Contact / free quote", href: "/contact/" },
            ],
          },
        ]}
      />

      <CtaBanner
        title={`Get free site inspection in ${cityName}`}
        description={`Call ${BUSINESS_CONFIG.phone.display} or WhatsApp us for measurement-led ${service?.shortName.toLowerCase() ?? "installation"} recommendations.`}
        ctaLabel="Request Free Inspection"
        ctaHref="/contact/"
      />
    </>
  );
}
