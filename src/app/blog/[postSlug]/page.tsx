import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getPostBySlug } from "@/data/blog";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";
import { articleSchema } from "@/lib/schema/article-schema";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ postSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { postSlug } = await params;
  const page = getPublicPage(`/blog/${postSlug}/`);
  return page ? generatePageMetadata(page) : {};
}

export default async function BlogPostPage({ params }: Props) {
  const { postSlug } = await params;
  const post = getPostBySlug(postSlug);
  const page = getPublicPage(`/blog/${postSlug}/`);
  if (!post || !page) notFound();

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.excerpt,
          url: page.canonicalUrl,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
        })}
      />
      <ProgrammaticPage
        page={page}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog/" },
          { label: post.title, href: `/blog/${post.slug}/` },
        ]}
      />
    </>
  );
}
