import { createCorePage } from "@/lib/pages/core-page";

const { generateMetadata, default: InstallationProcessPage } = createCorePage({
  path: "/installation-process/",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Installation Process", href: "/installation-process/" },
  ],
});

export { generateMetadata };
export default InstallationProcessPage;
