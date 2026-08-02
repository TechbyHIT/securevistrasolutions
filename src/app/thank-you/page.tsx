import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPageByPath } from "@/lib/pages/registry";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPageByPath("/thank-you/");
  return page ? generatePageMetadata(page) : { robots: { index: false, follow: false } };
}

export default function ThankYouPage() {
  const page = getPageByPath("/thank-you/");
  if (!page) notFound();

  return (
    <Container className="py-20 text-center">
      <Heading level={1}>{page.h1}</Heading>
      <p className="mx-auto mt-4 max-w-lg text-[var(--muted)]">{page.introduction}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/services/" variant="outline">
          View services
        </Button>
      </div>
    </Container>
  );
}
