import { createCorePage } from "@/lib/pages/core-page";

const { generateMetadata, default: TestimonialsPage } = createCorePage({
  path: "/testimonials/",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Testimonials", href: "/testimonials/" },
  ],
});

export { generateMetadata };
export default TestimonialsPage;
