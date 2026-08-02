import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getPublishedPropertyTypes } from "@/data/property-types";
import { getPublishedServices } from "@/data/initial-services";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Hero } from "@/components/sections/Hero";
import Link from "next/link";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPublicPage("/property-types/");
  return page ? generatePageMetadata(page) : {};
}

export default function PropertyTypesIndexPage() {
  const page = getPublicPage("/property-types/");
  if (!page) notFound();
  const propertyTypes = getPublishedPropertyTypes();
  const services = getPublishedServices();

  return (
    <>
      <Hero title={page.h1} description={page.introduction} />
      <Section>
        <Container>
          {propertyTypes.map((pt) => {
            const matching = services.filter((s) => s.suitablePropertyTypes.includes(pt.slug));
            return (
              <div key={pt.id} className="mb-10">
                <Heading level={2}>{pt.name}</Heading>
                <p className="mt-2 text-[var(--muted)]">{pt.introduction}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {matching.map((service) => (
                    <Card key={service.id} as="article">
                      <Link href={`/property-types/${pt.slug}/${service.slug}/`}>
                        <Heading level={3}>{service.name}</Heading>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </Container>
      </Section>
    </>
  );
}
