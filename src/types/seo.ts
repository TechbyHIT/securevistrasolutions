export type BreadcrumbItem = {
  name: string;
  href: string;
};

export type InternalLink = {
  href: string;
  label: string;
  rel?: string;
  context: string;
};

export type SitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  images?: Array<{ loc: string; title?: string }>;
};

export type AuditIssue = {
  code: string;
  severity: "critical" | "warning" | "info";
  path?: string;
  message: string;
};
