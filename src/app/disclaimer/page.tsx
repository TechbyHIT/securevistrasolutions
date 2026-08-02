import { createCorePage } from "@/lib/pages/core-page";

const { generateMetadata, default: DisclaimerPage } = createCorePage({
  path: "/disclaimer/",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Disclaimer", href: "/disclaimer/" },
  ],
  showHero: false,
});

export { generateMetadata };
export default DisclaimerPage;
