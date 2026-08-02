import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { buildPageContent } from "@/lib/content/build-page-content";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Hero } from "@/components/sections/Hero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getPublishedServices } from "@/data/initial-services";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPublicPage("/faq/");
  return page ? generatePageMetadata(page) : {};
}

export default function FaqPage() {
  const page = getPublicPage("/faq/");
  if (!page) notFound();

  const services = getPublishedServices();
  const allFaqs = services.flatMap((s) =>
    buildPageContent({ pageType: "service", service: s }).faqs,
  );

  return (
    <>
      <Hero title={page.h1} description={page.introduction} />
      <Section>
        <Container className="max-w-3xl">
          <Heading level={2}>Common questions</Heading>
          <div className="mt-6">
            <FaqAccordion faqs={allFaqs.slice(0, 15)} />
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
