import { createCorePage } from "@/lib/pages/core-page";

const { generateMetadata, default: AboutPage } = createCorePage({
  path: "/about/",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about/" },
  ],
});

export { generateMetadata };
export default AboutPage;
