import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getAllPages, getIndexablePages } from "../src/lib/pages/registry";
import type { AuditIssue } from "../src/types/seo";

const pages = getAllPages();
const indexable = getIndexablePages();
const issues: AuditIssue[] = [];
const titles = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();

for (const page of pages) {
  if (!page.title) {
    issues.push({ code: "missing-title", severity: "critical", path: page.path, message: "Missing title" });
  }
  if (!page.metaDescription) {
    issues.push({
      code: "missing-description",
      severity: "critical",
      path: page.path,
      message: "Missing meta description",
    });
  }
  if (!page.h1) {
    issues.push({ code: "missing-h1", severity: "critical", path: page.path, message: "Missing H1" });
  }
  if (!page.canonicalUrl) {
    issues.push({
      code: "missing-canonical",
      severity: "critical",
      path: page.path,
      message: "Missing canonical",
    });
  }
  if (page.placeholders.length > 0 && page.publicationStatus === "published" && page.allowIndexing) {
    issues.push({
      code: "unresolved-placeholders",
      severity: "critical",
      path: page.path,
      message: `Placeholders: ${page.placeholders.join(", ")}`,
    });
  }

  titles.set(page.title, [...(titles.get(page.title) ?? []), page.path]);
  descriptions.set(page.metaDescription, [
    ...(descriptions.get(page.metaDescription) ?? []),
    page.path,
  ]);
}

for (const [title, paths] of titles) {
  if (paths.length > 1) {
    issues.push({
      code: "duplicate-title",
      severity: "warning",
      message: `Duplicate title "${title}" on ${paths.join(", ")}`,
    });
  }
}

for (const [description, paths] of descriptions) {
  if (paths.length > 1) {
    issues.push({
      code: "duplicate-description",
      severity: "warning",
      message: `Duplicate description on ${paths.join(", ")}`,
    });
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  totalPages: pages.length,
  indexablePages: indexable.length,
  critical: issues.filter((issue) => issue.severity === "critical").length,
  warnings: issues.filter((issue) => issue.severity === "warning").length,
  issues,
};

mkdirSync(join(process.cwd(), "reports"), { recursive: true });
writeFileSync(join(process.cwd(), "reports/seo-audit.json"), JSON.stringify(report, null, 2));
console.log(`SEO audit: ${report.critical} critical, ${report.warnings} warnings`);
console.log("Wrote reports/seo-audit.json");
