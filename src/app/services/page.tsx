import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getPublishedServices } from "@/data/initial-services";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { ImageGallery } from "@/components/sections/ImageGallery";
import { Hero } from "@/components/sections/Hero";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPublicPage("/services/");
  return page ? generatePageMetadata(page) : {};
}

export default function ServicesIndexPage() {
  const page = getPublicPage("/services/");
  if (!page) notFound();
  const services = getPublishedServices();

  return (
    <>
      <Hero title={page.h1} description={page.introduction} />
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                name={service.name}
                summary={service.summary}
                href={`/services/${service.slug}/`}
                image={service.heroImage}
              />
            ))}
          </div>
        </Container>
      </Section>

      {services.map((service) =>
        service.galleryImages.length > 0 ? (
          <Section key={`gallery-${service.id}`} variant="muted">
            <Container>
              <ImageGallery
                title={`${service.name} photos`}
                images={service.galleryImages.slice(0, 8).map((src, index) => ({
                  src,
                  alt: `${service.name} installation ${index + 1}`,
                  href: `/services/${service.slug}/`,
                }))}
                columns={4}
              />
            </Container>
          </Section>
        ) : null,
      )}

      <CtaBanner />
    </>
  );
}
