export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
  megaMenu?: "services" | "areas";
};

export const PRIMARY_NAV: NavItem[] = [
  {
    label: "Services",
    href: "/services/",
    megaMenu: "services",
  },
  {
    label: "Locations",
    href: "/locations/hyderabad/",
    megaMenu: "areas",
  },
  { label: "About", href: "/about/" },
  { label: "Why Us", href: "/#why-us" },
  { label: "FAQs", href: "/faq/" },
  { label: "Contact", href: "/contact/" },
];

export const FOOTER_QUICK_LINKS: NavItem[] = [
  { label: "Gallery", href: "/gallery/" },
  { label: "Testimonials", href: "/testimonials/" },
  { label: "FAQ", href: "/faq/" },
  { label: "Pricing Guide", href: "/pricing-guide/" },
  { label: "Materials Guide", href: "/materials-guide/" },
  { label: "Installation Process", href: "/installation-process/" },
  { label: "Safety Guide", href: "/safety-guide/" },
];

export const FOOTER_POLICY_LINKS: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms and Conditions", href: "/terms-and-conditions/" },
  { label: "Disclaimer", href: "/disclaimer/" },
];
