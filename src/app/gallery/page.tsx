import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getPublishedServices } from "@/data/initial-services";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/sections/Hero";
import { ImageGallery } from "@/components/sections/ImageGallery";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getHomeGalleryImages } from "@/lib/images/get-service-images";

export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPublicPage("/gallery/");
  return page ? generatePageMetadata(page) : {};
}

export default function GalleryPage() {
  const page = getPublicPage("/gallery/");
  const services = getPublishedServices();
  const featured = getHomeGalleryImages();

  return (
    <>
      <Hero
        title={page?.h1 ?? "Project Gallery"}
        description={
          page?.introduction ??
          "Browse real installation photos for invisible grills, safety nets, cloth hangers, sports nets and bird spikes across Hyderabad."
        }
        image={featured[0]?.src ?? services[0]?.heroImage}
      />

      <Section>
        <Container>
          <ImageGallery
            title="Featured installations"
            description="High-quality project photos from recent Hyderabad installations."
            images={featured}
            columns={4}
          />
        </Container>
      </Section>

      {services.map((service) => (
        <Section key={service.id} variant="muted">
          <Container>
            <ImageGallery
              title={service.name}
              description={service.summary}
              images={service.galleryImages.map((src, index) => ({
                src,
                alt: `${service.name} project photo ${index + 1} in Hyderabad`,
                href: `/services/${service.slug}/`,
              }))}
              columns={4}
            />
          </Container>
        </Section>
      ))}

      <CtaBanner />
    </>
  );
}
