import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { ProgrammaticPage } from "@/components/pages/ProgrammaticPage";
import type { BreadcrumbItem } from "@/lib/schema/breadcrumb-schema";

export const dynamicParams = true;
export const revalidate = 86400;

type CorePageOptions = {
  path: string;
  breadcrumbs: BreadcrumbItem[];
  showHero?: boolean;
};

export function createCorePage(options: CorePageOptions) {
  const { path, breadcrumbs, showHero } = options;

  async function generateMetadata() {
    const page = getPublicPage(path);
    return page ? generatePageMetadata(page) : {};
  }

  function Page() {
    const page = getPublicPage(path);
    if (!page) notFound();
    return <ProgrammaticPage page={page} breadcrumbs={breadcrumbs} showHero={showHero} />;
  }

  return { generateMetadata, default: Page };
}
