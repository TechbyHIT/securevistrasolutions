import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getPublishedLocations } from "@/data/initial-locations";
import { getPublishedAreas } from "@/data/initial-areas";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { LocationCard } from "@/components/sections/LocationCard";
import { Hero } from "@/components/sections/Hero";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPublicPage("/locations/");
  return page ? generatePageMetadata(page) : {};
}

export default function LocationsIndexPage() {
  const page = getPublicPage("/locations/");
  if (!page) notFound();
  const locations = getPublishedLocations();
  const areas = getPublishedAreas();

  return (
    <>
      <Hero title={page.h1} description={page.introduction} />
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                name={location.name}
                description={location.introduction}
                href={`/locations/${location.slug}/`}
                propertyTypes={location.propertyTypes}
              />
            ))}
            {areas.map((area) => (
              <LocationCard
                key={area.id}
                name={area.name}
                description={area.introduction}
                href={`/locations/hyderabad/${area.slug}/`}
                propertyTypes={area.propertyTypes}
              />
            ))}
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
