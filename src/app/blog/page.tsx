import { notFound } from "next/navigation";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getPublishedPosts } from "@/data/blog";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Hero } from "@/components/sections/Hero";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPublicPage("/blog/");
  return page ? generatePageMetadata(page) : {};
}

export default function BlogIndexPage() {
  const page = getPublicPage("/blog/");
  if (!page) notFound();
  const posts = getPublishedPosts();

  return (
    <>
      <Hero title={page.h1} description={page.introduction} />
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} as="article">
                <Link href={`/blog/${post.slug}/`} className="group">
                  <Heading level={3} className="group-hover:text-primary-500">
                    {post.title}
                  </Heading>
                  <p className="mt-2 text-sm text-[var(--muted)]">{post.excerpt}</p>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
