import { notFound } from "next/navigation";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getPublishedGuides } from "@/data/guides";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Hero } from "@/components/sections/Hero";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPublicPage("/guides/");
  return page ? generatePageMetadata(page) : {};
}

export default function GuidesIndexPage() {
  const page = getPublicPage("/guides/");
  if (!page) notFound();
  const guides = getPublishedGuides();

  return (
    <>
      <Hero title={page.h1} description={page.introduction} />
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {guides.map((guide) => (
              <Card key={guide.id} as="article">
                <Link href={`/guides/${guide.slug}/`} className="group">
                  <Heading level={3} className="group-hover:text-primary-500">
                    {guide.title}
                  </Heading>
                  <p className="mt-2 text-sm text-[var(--muted)]">{guide.excerpt}</p>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
