import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";
import { InvisibleGrillsLocalityPage } from "@/components/pages/InvisibleGrillsLocalityPage";
import { getServiceBySlug } from "@/data/initial-services";
import { getLocationBySlug, getLocationById } from "@/data/initial-locations";
import { getAreaBySlug } from "@/data/initial-areas";
import { resolveSeoPage } from "@/lib/seo/resolve-seo-page";
import { getPriorityCompositeStaticParams } from "@/lib/seo/priority-seo-pages";

/**
 * Selective build-time pre-render for Hyderabad priority pages only.
 * All other valid composite URLs still render via ISR (dynamicParams=true).
 * Indexability / sitemap are NOT controlled by this list.
 */
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getPriorityCompositeStaticParams();
}

type Props = { params: Promise<{ locationSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locationSlug } = await params;
  const resolved = resolveSeoPage(locationSlug);
  return resolved ? generatePageMetadata(resolved.page) : {};
}

export default async function CompositeSlugPage({ params }: Props) {
  const { locationSlug } = await params;
  const resolved = resolveSeoPage(locationSlug);
  if (!resolved) notFound();

  const { page, kind } = resolved;

  if (kind === "invisible-grills-installation") {
    const service = getServiceBySlug(resolved.serviceSlug!);
    const area = getAreaBySlug(resolved.localitySlug!);
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

  if (kind !== "service-in-city") notFound();

  const service = getServiceBySlug(resolved.serviceSlug!);
  const location = getLocationBySlug(resolved.citySlug!);
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
