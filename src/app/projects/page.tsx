import { createCorePage } from "@/lib/pages/core-page";

const { generateMetadata, default: ProjectsPage } = createCorePage({
  path: "/projects/",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects/" },
  ],
});

export { generateMetadata };
export default ProjectsPage;
