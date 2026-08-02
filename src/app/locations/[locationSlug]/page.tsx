import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getLocationBySlug, getPublishedLocations } from "@/data/initial-locations";
import { countServedAreas, getPublishedAreas } from "@/data/initial-areas";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { LocationCard } from "@/components/sections/LocationCard";
import { HyderabadAreaServiceLinks } from "@/components/sections/HyderabadAreaServiceLinks";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getPublishedLocations().map((location) => ({ locationSlug: location.slug }));
}

type Props = { params: Promise<{ locationSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locationSlug } = await params;
  const page = getPublicPage(`/locations/${locationSlug}/`);
  return page ? generatePageMetadata(page) : {};
}

export default async function LocationPage({ params }: Props) {
  const { locationSlug } = await params;
  const location = getLocationBySlug(locationSlug);
  const page = getPublicPage(`/locations/${locationSlug}/`);
  if (!location || !page) notFound();

  const areas = getPublishedAreas(location.id);

  return (
    <>
      <ProgrammaticPage
        page={page}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Locations", href: "/locations/" },
          { label: location.name, href: `/locations/${location.slug}/` },
        ]}
      />
      {areas.length > 0 ? (
        <Section variant="muted">
          <Container>
            <Heading level={2}>Featured areas in {location.name}</Heading>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {areas.slice(0, 12).map((area) => (
                <LocationCard
                  key={area.id}
                  name={area.name}
                  description={area.introduction}
                  href={`/locations/${location.slug}/${area.slug}/`}
                  propertyTypes={area.propertyTypes}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {location.slug === "hyderabad" ? (
        <HyderabadAreaServiceLinks
          title={`All ${countServedAreas()} Hyderabad areas → services → sub-locations`}
          description="Complete internal link directory from every Hyderabad locality into each service page and sub-location URL."
        />
      ) : null}
    </>
  );
}
