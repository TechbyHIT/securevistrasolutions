import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getPropertyTypeBySlug } from "@/data/property-types";
import { getServiceBySlug } from "@/data/initial-services";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";

export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ propertyTypeSlug: string; serviceSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { propertyTypeSlug, serviceSlug } = await params;
  const page = getPublicPage(`/property-types/${propertyTypeSlug}/${serviceSlug}/`);
  return page ? generatePageMetadata(page) : {};
}

export default async function PropertyTypeServicePage({ params }: Props) {
  const { propertyTypeSlug, serviceSlug } = await params;
  const propertyType = getPropertyTypeBySlug(propertyTypeSlug);
  const service = getServiceBySlug(serviceSlug);
  const page = getPublicPage(`/property-types/${propertyTypeSlug}/${serviceSlug}/`);

  if (!propertyType || !service || !page) notFound();

  return (
    <ProgrammaticPage
      page={page}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Property Types", href: "/property-types/" },
        { label: propertyType.name, href: "/property-types/" },
        { label: service.name, href: `/property-types/${propertyType.slug}/${service.slug}/` },
      ]}
      heroImage={service.heroImage}
    />
  );
}
