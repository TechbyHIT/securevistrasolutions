# SEO Audit Guide

```bash
npm run seo:audit
npm run content:audit
npm run duplicates:audit
npm run links:audit
npm run schema:audit
npm run placeholders:audit
npm run pages:count
npm run sitemaps:generate
```

Reports are written to `reports/*.json`.

Critical issues to fix before scaling publish batches:

- unresolved business placeholders
- missing titles / descriptions / H1 / canonicals
- thin or unverified local pages
- high similarity pairs
- orphan indexable URLs
