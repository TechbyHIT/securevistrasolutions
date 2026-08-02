import { createCorePage } from "@/lib/pages/core-page";

const { generateMetadata, default: PrivacyPolicyPage } = createCorePage({
  path: "/privacy-policy/",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Privacy Policy", href: "/privacy-policy/" },
  ],
  showHero: false,
});

export { generateMetadata };
export default PrivacyPolicyPage;
