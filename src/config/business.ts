export const BUSINESS_CONFIG = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Secure Vista Solutions",
  legalName: process.env.NEXT_PUBLIC_LEGAL_BUSINESS_NAME ?? "Secure Vista Solutions",
  ownerName: process.env.NEXT_PUBLIC_OWNER_NAME ?? "Manikanta Kumar",
  description:
    "Premium invisible grills, balcony safety nets, mosquito nets and home safety installations across Hyderabad.",
  websiteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://securevistasolutions.in",

  phone: {
    display: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "+91 95020 96677",
    raw: process.env.NEXT_PUBLIC_PHONE_RAW ?? "+919502096677",
  },

  whatsapp: {
    display: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY ?? "+91 95020 96677",
    raw: process.env.NEXT_PUBLIC_WHATSAPP_RAW ?? "919502096677",
  },

  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "securevista1@gmail.com",

  address: {
    street:
      process.env.NEXT_PUBLIC_STREET_ADDRESS ?? "Sriram Nagar Colony, Karmanghat",
    city: "Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    postalCode: process.env.NEXT_PUBLIC_POSTAL_CODE ?? "500079",
    country: "India",
  },

  coordinates: {
    latitude: null as number | null,
    longitude: null as number | null,
  },

  logo: "/images/logo.webp",
  defaultOpenGraphImage: "/images/open-graph.jpeg",

  serviceArea: {
    primaryCity: "Hyderabad",
    state: "Telangana",
    country: "India",
  },

  socialLinks: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
  },

  analytics: {
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
  },

  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
} as const;

export type BusinessConfig = typeof BUSINESS_CONFIG;
