import { generatePageMetadata } from "@/lib/seo/generate-page-metadata";
import { getPublicPage } from "@/lib/pages/get-public-page";
import { HomePageContent } from "@/components/pages/HomePageContent";
import { notFound } from "next/navigation";

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata() {
  const page = getPublicPage("/");
  return page ? generatePageMetadata(page) : {};
}

export default function HomePage() {
  const page = getPublicPage("/");
  if (!page) notFound();

  return <HomePageContent page={page} />;
}
