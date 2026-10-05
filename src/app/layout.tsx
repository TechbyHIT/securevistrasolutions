import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { BUSINESS_CONFIG } from "@/config/business";
import { SITE_CONFIG } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Analytics } from "@/components/analytics/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/schema/organization-schema";
import { localBusinessSchema } from "@/lib/schema/local-business-schema";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: BUSINESS_CONFIG.name,
    template: SITE_CONFIG.defaultTitleTemplate,
  },
  description: SITE_CONFIG.defaultDescription,
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: BUSINESS_CONFIG.gscVerification
    ? { google: BUSINESS_CONFIG.gscVerification }
    : undefined,
};

export const viewport = {
  colorScheme: "light" as const,
  themeColor: "#1a4a6e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE_CONFIG.language} style={{ colorScheme: "light" }}>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <SkipToContent />
        <JsonLd data={[organizationSchema(), localBusinessSchema()]} />
        <Analytics />
        <Header />
        <main
          id="main-content"
          className="min-h-[60vh] pb-[calc(var(--floating-actions-offset)+var(--mobile-cta-height))] md:pb-[var(--floating-actions-offset)]"
        >
          {children}
        </main>
        <Footer />
        <FloatingActions />
        <MobileBottomBar />
      </body>
    </html>
  );
}
