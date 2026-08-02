# Architecture

## Model

This project uses a **data-driven Next.js architecture** without PostgreSQL.

1. Source entities live in `src/data/*.ts`
2. `page-factory.ts` creates page records from eligible combinations
3. Dynamic App Router pages resolve records at request time
4. ISR caches responses (`revalidate = 86400`)
5. On-demand revalidation is available via `/api/revalidate`

## Why no database (current stage)

The product requirement for this build is programmatic SEO **without PostgreSQL**. The registry still supports:

- Separate services / areas / property types / problems / guides / blog
- Automatic combination generation
- Indexability gates
- Controlled publishing scripts
- Sitemap groups
- Audits and page counts

Hyderabad is the only published city. Scale-up is done by adding more Hyderabad areas, localities, services and content modules — not by inventing extra cities.

## Capacity path

Current seed data creates a few hundred eligible records. The same factory pattern can expand toward very large inventories by adding verified Hyderabad localities and controlled combination rules. Physical HTML files are never generated per URL.

## Key modules

- `src/lib/publishing/page-factory.ts` — combination generation
- `src/lib/pages/registry.ts` — cached page access + cursor pagination
- `src/lib/seo/*` — metadata / robots / canonical / indexability
- `src/lib/content/build-page-content.ts` — content assembly
- `src/lib/internal-links/generate-internal-links.ts` — contextual links
- `src/lib/sitemap/get-sitemap-entries.ts` — sitemap batches
- `src/app/**` — routes and metadata
