import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getGuideBySlug } from "@/data/guides";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";
import { articleSchema } from "@/lib/schema/article-schema";
import { JsonLd } from "@/components/seo/JsonLd";

export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ guideSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { guideSlug } = await params;
  const page = getPublicPage(`/guides/${guideSlug}/`);
  return page ? generatePageMetadata(page) : {};
}

export default async function GuidePage({ params }: Props) {
  const { guideSlug } = await params;
  const guide = getGuideBySlug(guideSlug);
  const page = getPublicPage(`/guides/${guideSlug}/`);
  if (!guide || !page) notFound();

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: guide.title,
          description: guide.excerpt,
          url: page.canonicalUrl,
          datePublished: guide.reviewedAt,
          dateModified: guide.updatedAt,
        })}
      />
      <ProgrammaticPage
        page={page}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides/" },
          { label: guide.title, href: `/guides/${guide.slug}/` },
        ]}
      />
    </>
  );
}
