import { createCorePage } from "@/lib/pages/core-page";

const { generateMetadata, default: SafetyGuidePage } = createCorePage({
  path: "/safety-guide/",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Safety Guide", href: "/safety-guide/" },
  ],
});

export { generateMetadata };
export default SafetyGuidePage;
