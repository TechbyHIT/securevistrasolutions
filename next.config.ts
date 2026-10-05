import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  // Must match SITE_CONFIG.trailingSlash + sitemap/canonical URLs.
  // Without this, Next 308s /path/ → /path and crawlers skip pages.
  trailingSlash: true,
  // Parent /var/www/package-lock.json otherwise steals the workspace root and
  // nests standalone as .next/standalone/var/www/securevista/server.js
  outputFileTracingRoot: path.join(__dirname),
  compress: true,
  experimental: {
    optimizePackageImports: ["clsx", "tailwind-merge", "zod"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 360, 375, 390, 412, 640, 768, 1024, 1280, 1440],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.clarity.ms",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://connect.facebook.net",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home/",
        destination: "/",
        permanent: true,
      },
      // Only real service slugs — never catch locality names like /hyderabad/gachibowli/
      {
        source: "/hyderabad/invisible-grills",
        destination: "/invisible-grills-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/invisible-grills/",
        destination: "/invisible-grills-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/balcony-safety-nets",
        destination: "/balcony-safety-nets-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/balcony-safety-nets/",
        destination: "/balcony-safety-nets-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/children-safety-nets",
        destination: "/children-safety-nets-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/children-safety-nets/",
        destination: "/children-safety-nets-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/pet-safety-nets",
        destination: "/pet-safety-nets-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/pet-safety-nets/",
        destination: "/pet-safety-nets-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/mosquito-nets",
        destination: "/mosquito-nets-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/mosquito-nets/",
        destination: "/mosquito-nets-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/bird-spikes",
        destination: "/bird-spikes-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/bird-spikes/",
        destination: "/bird-spikes-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/cloth-hangers",
        destination: "/cloth-hangers-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/cloth-hangers/",
        destination: "/cloth-hangers-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/cricket-nets",
        destination: "/cricket-nets-in-hyderabad/",
        permanent: true,
      },
      {
        source: "/hyderabad/cricket-nets/",
        destination: "/cricket-nets-in-hyderabad/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
