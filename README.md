# SWAMI Programmatic SEO Website

Production-ready Next.js App Router programmatic SEO system for **Hyderabad-only** service coverage.

**No PostgreSQL / Prisma.** Page records are generated from TypeScript data modules and a file-based registry.

## Stack

- Next.js App Router + React Server Components
- TypeScript (strict)
- Tailwind CSS
- Zod
- Vitest + Playwright
- ISR + on-demand revalidation
- Data-driven page generation (not physical page files)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Important configuration

Edit `src/config/business.ts` and replace placeholders:

- `[BUSINESS_NAME]`
- `[PHONE_NUMBER]` / `[PHONE_RAW]`
- `[WHATSAPP_NUMBER]` / `[WHATSAPP_RAW]`
- `[EMAIL_ADDRESS]`
- street / postal code / social URLs

Until placeholders are removed, affected pages stay non-indexable by design.

## Location scope

Only **Hyderabad** is a published city.

Areas live under Hyderabad, for example:

- `/locations/hyderabad/`
- `/locations/hyderabad/gachibowli/`
- `/hyderabad/invisible-grills/`
- `/hyderabad/gachibowli/invisible-grills/`

## Add content separately

| Entity | File |
|---|---|
| Services | `src/data/initial-services.ts` |
| City | `src/data/initial-locations.ts` |
| Areas | `src/data/initial-areas.ts` |
| Landmarks | `src/data/initial-landmarks.ts` |
| Property types | `src/data/property-types.ts` |
| Problems | `src/data/problems.ts` |
| Guides | `src/data/guides.ts` |
| Blog | `src/data/blog.ts` |

Eligible combinations are generated automatically by `src/lib/publishing/page-factory.ts`.

## Publishing commands

```bash
npm run pages:create
npm run pages:create -- --type=service-location --limit=1000
npm run pages:count
npm run pages:publish -- --batch-size=500
npm run pages:noindex -- --quality-below=80
npm run seo:audit
npm run content:audit
npm run duplicates:audit
npm run links:audit
npm run schema:audit
npm run placeholders:audit
npm run sitemaps:generate
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Documentation

- `ARCHITECTURE.md`
- `SEO_ARCHITECTURE.md`
- `DATABASE_ARCHITECTURE.md` (explains the no-DB registry model)
- `CONTENT_GUIDELINES.md`
- `ADDING_SERVICES.md`
- `ADDING_LOCATIONS.md`
- `ADDING_AREAS.md`
- `PAGE_GENERATION.md`
- `PUBLISHING_WORKFLOW.md`
- `DEPLOYMENT.md`
- `SEARCH_CONSOLE_SETUP.md`
- `SEO_AUDIT_GUIDE.md`

## Admin

Set in `.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-before-deploy
```

Visit `/admin/`.
