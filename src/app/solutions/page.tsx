import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getPublishedProblems } from "@/data/problems";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Hero } from "@/components/sections/Hero";
import { CtaBanner } from "@/components/sections/CtaBanner";
import Link from "next/link";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPublicPage("/solutions/");
  return page ? generatePageMetadata(page) : {};
}

export default function SolutionsIndexPage() {
  const page = getPublicPage("/solutions/");
  if (!page) notFound();
  const problems = getPublishedProblems();

  return (
    <>
      <Hero title={page.h1} description={page.introduction} />
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {problems.map((problem) => (
              <Card key={problem.id} as="article">
                <Link href={`/solutions/${problem.slug}/`} className="group">
                  <Heading level={3} className="group-hover:text-primary-500">
                    {problem.name}
                  </Heading>
                  <p className="mt-2 text-sm text-[var(--muted)]">{problem.introduction}</p>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBanner />
    </>
  );
}
