import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getServiceBySlug, getPublishedServices } from "@/data/initial-services";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";
import { serviceSchema } from "@/lib/schema/service-schema";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return getPublishedServices().map((service) => ({ serviceSlug: service.slug }));
}

type Props = { params: Promise<{ serviceSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { serviceSlug } = await params;
  const page = getPublicPage(`/services/${serviceSlug}/`);
  return page ? generatePageMetadata(page) : {};
}

export default async function ServicePage({ params }: Props) {
  const { serviceSlug } = await params;
  const service = getServiceBySlug(serviceSlug);
  const page = getPublicPage(`/services/${serviceSlug}/`);

  if (!service || !page) notFound();

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: service.name,
          description: service.summary,
          url: page.canonicalUrl,
          image: service.heroImage,
        })}
      />
      <ProgrammaticPage
        page={page}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services/" },
          { label: service.name, href: `/services/${service.slug}/` },
        ]}
        heroImage={service.heroImage}
      />
    </>
  );
}
