import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { notFound } from "next/navigation";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPublicPage("/contact/");
  return page ? generatePageMetadata(page) : {};
}

export default function ContactPage() {
  const page = getPublicPage("/contact/");
  if (!page) notFound();

  return (
    <>
      <Section variant="muted">
        <Container>
          <Heading level={1}>{page.h1}</Heading>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">{page.introduction}</p>
        </Container>
      </Section>
      <Section>
        <Container className="max-w-xl">
          <Heading level={2}>Request a quote</Heading>
          <div className="mt-6">
            <QuoteForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
