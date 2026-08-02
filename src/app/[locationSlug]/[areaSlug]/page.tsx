import { notFound, redirect } from "next/navigation";
import { buildServiceInCityPath } from "@/lib/utils/service-in-city-slug";
import { getLocationBySlug } from "@/data/initial-locations";
import { getAreaBySlug } from "@/data/initial-areas";
import { getServiceBySlug } from "@/data/initial-services";

export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ locationSlug: string; areaSlug: string }> };

export async function generateMetadata() {
  return {};
}

export default async function LocationSegmentPage({ params }: Props) {
  const { locationSlug, areaSlug } = await params;
  const location = getLocationBySlug(locationSlug);
  if (!location) notFound();

  const service = getServiceBySlug(areaSlug);
  if (service) {
    redirect(buildServiceInCityPath(service.slug, location.slug));
  }

  const area = getAreaBySlug(areaSlug, location.id);
  if (area) {
    redirect(`/locations/${location.slug}/${area.slug}/`);
  }

  notFound();
}
