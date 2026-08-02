import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BUSINESS_CONFIG } from "@/config/business";
import { SITE_CONFIG } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Analytics } from "@/components/analytics/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/schema/organization-schema";
import { localBusinessSchema } from "@/lib/schema/local-business-schema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    icon: [{ url: "/images/logo.png", type: "image/png" }],
    apple: [{ url: "/images/logo.png", type: "image/png" }],
  },
  verification: BUSINESS_CONFIG.gscVerification
    ? { google: BUSINESS_CONFIG.gscVerification }
    : undefined,
};

export const viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE_CONFIG.language} style={{ colorScheme: "light" }}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipToContent />
        <JsonLd data={[organizationSchema(), localBusinessSchema()]} />
        <Analytics />
        <Header />
        <main id="main-content" className="min-h-[60vh] pb-[var(--floating-actions-offset)]">
          {children}
        </main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
