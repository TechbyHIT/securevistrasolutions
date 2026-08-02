import { createCorePage } from "@/lib/pages/core-page";

const { generateMetadata, default: PricingGuidePage } = createCorePage({
  path: "/pricing-guide/",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Pricing Guide", href: "/pricing-guide/" },
  ],
});

export { generateMetadata };
export default PricingGuidePage;
