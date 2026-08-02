import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getLocationBySlug } from "@/data/initial-locations";
import { getAreaBySlug } from "@/data/initial-areas";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";

export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ locationSlug: string; areaSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locationSlug, areaSlug } = await params;
  const page = getPublicPage(`/locations/${locationSlug}/${areaSlug}/`);
  return page ? generatePageMetadata(page) : {};
}

export default async function AreaPage({ params }: Props) {
  const { locationSlug, areaSlug } = await params;
  const location = getLocationBySlug(locationSlug);
  const area = location ? getAreaBySlug(areaSlug, location.id) : undefined;
  const page = getPublicPage(`/locations/${locationSlug}/${areaSlug}/`);

  if (!location || !area || !page) notFound();

  return (
    <ProgrammaticPage
      page={page}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Locations", href: "/locations/" },
        { label: location.name, href: `/locations/${location.slug}/` },
        { label: area.name, href: `/locations/${location.slug}/${area.slug}/` },
      ]}
    />
  );
}
