import { createCorePage } from "@/lib/pages/core-page";

const { generateMetadata, default: TermsPage } = createCorePage({
  path: "/terms-and-conditions/",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Terms and Conditions", href: "/terms-and-conditions/" },
  ],
  showHero: false,
});

export { generateMetadata };
export default TermsPage;
