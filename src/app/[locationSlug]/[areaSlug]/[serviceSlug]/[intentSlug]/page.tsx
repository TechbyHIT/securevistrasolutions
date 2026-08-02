import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getLocationBySlug } from "@/data/initial-locations";
import { getAreaBySlug } from "@/data/initial-areas";
import { getServiceBySlug } from "@/data/initial-services";
import { getKeywordIntentBySlug } from "@/data/keyword-intents";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";
import { serviceSchema } from "@/lib/schema/service-schema";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamicParams = true;
export const revalidate = 86400;

type Props = {
  params: Promise<{
    locationSlug: string;
    areaSlug: string;
    serviceSlug: string;
    intentSlug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { locationSlug, areaSlug, serviceSlug, intentSlug } = await params;
  const page = getPublicPage(
    `/${locationSlug}/${areaSlug}/${serviceSlug}/${intentSlug}/`,
  );
  return page ? generatePageMetadata(page) : {};
}

export default async function ServiceAreaIntentPage({ params }: Props) {
  const { locationSlug, areaSlug, serviceSlug, intentSlug } = await params;
  const location = getLocationBySlug(locationSlug);
  const area = location ? getAreaBySlug(areaSlug, location.id) : undefined;
  const service = getServiceBySlug(serviceSlug);
  const intent = getKeywordIntentBySlug(intentSlug);
  const page = getPublicPage(
    `/${locationSlug}/${areaSlug}/${serviceSlug}/${intentSlug}/`,
  );

  if (!location || !area || !service || !intent || !page) notFound();
  if (intent.serviceSlug !== service.slug) notFound();

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: page.h1,
          description: page.metaDescription,
          url: page.canonicalUrl,
          image: service.heroImage,
        })}
      />
      <ProgrammaticPage
        page={page}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: location.name, href: `/locations/${location.slug}/` },
          {
            label: area.name,
            href: `/locations/${location.slug}/${area.slug}/`,
          },
          {
            label: service.name,
            href: `/${location.slug}/${area.slug}/${service.slug}/`,
          },
          {
            label: intent.label,
            href: `/${location.slug}/${area.slug}/${service.slug}/${intent.slug}/`,
          },
        ]}
        heroImage={service.heroImage}
      />
    </>
  );
}
