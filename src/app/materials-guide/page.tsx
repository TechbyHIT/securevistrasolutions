import { createCorePage } from "@/lib/pages/core-page";

const { generateMetadata, default: MaterialsGuidePage } = createCorePage({
  path: "/materials-guide/",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Materials Guide", href: "/materials-guide/" },
  ],
});

export { generateMetadata };
export default MaterialsGuidePage;
