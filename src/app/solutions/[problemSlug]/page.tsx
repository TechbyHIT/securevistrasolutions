import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { getProblemBySlug } from "@/data/problems";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";

export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ problemSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { problemSlug } = await params;
  const page = getPublicPage(`/solutions/${problemSlug}/`);
  return page ? generatePageMetadata(page) : {};
}

export default async function SolutionPage({ params }: Props) {
  const { problemSlug } = await params;
  const problem = getProblemBySlug(problemSlug);
  const page = getPublicPage(`/solutions/${problemSlug}/`);
  if (!problem || !page) notFound();

  return (
    <ProgrammaticPage
      page={page}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Solutions", href: "/solutions/" },
        { label: problem.name, href: `/solutions/${problem.slug}/` },
      ]}
    />
  );
}
