import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";
import { InvisibleGrillsLocalityPage } from "@/components/pages/InvisibleGrillsLocalityPage";
import { getServiceBySlug } from "@/data/initial-services";
import { getLocationBySlug, getLocationById } from "@/data/initial-locations";
import { getAreaBySlug } from "@/data/initial-areas";
import { parseServiceInCitySlug } from "@/lib/utils/service-in-city-slug";
import { parseInstallationInLocalitySlug } from "@/lib/utils/installation-in-locality-slug";

export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ locationSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locationSlug } = await params;
  const cityParsed = parseServiceInCitySlug(locationSlug);
  const localityParsed = cityParsed ? null : parseInstallationInLocalitySlug(locationSlug);
  if (!cityParsed && !localityParsed) return {};

  const page = getPublicPage(`/${locationSlug}/`);
  return page ? generatePageMetadata(page) : {};
}

export default async function CompositeSlugPage({ params }: Props) {
  const { locationSlug } = await params;

  const localityParsed = parseInstallationInLocalitySlug(locationSlug);
  if (localityParsed) {
    const page = getPublicPage(`/${locationSlug}/`);
    if (!page) notFound();

    const service = getServiceBySlug(localityParsed.serviceSlug);
    const area = getAreaBySlug(localityParsed.localitySlug);
    if (!service || !area) notFound();

    const parent = getLocationById(area.parentId);

    return (
      <InvisibleGrillsLocalityPage
        page={page}
        area={area}
        service={service}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services/" },
          { label: service.name, href: `/services/${service.slug}/` },
          ...(parent
            ? [{ label: parent.name, href: `/locations/${parent.slug}/` }]
            : []),
          {
            label: area.name,
            href: parent
              ? `/locations/${parent.slug}/${area.slug}/`
              : page.path,
          },
          { label: page.h1, href: page.path },
        ]}
      />
    );
  }

  const parsed = parseServiceInCitySlug(locationSlug);
  if (!parsed) notFound();

  const page = getPublicPage(`/${locationSlug}/`);
  if (!page) notFound();

  const service = getServiceBySlug(parsed.serviceSlug);
  const location = getLocationBySlug(parsed.citySlug);
  if (!service || !location) notFound();

  return (
    <ProgrammaticPage
      page={page}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Services", href: "/services/" },
        { label: service.name, href: `/services/${service.slug}/` },
        { label: location.name, href: `/locations/${location.slug}/` },
        { label: `${service.name} in ${location.name}`, href: page.path },
      ]}
      heroImage={service.heroImage}
    />
  );
}
