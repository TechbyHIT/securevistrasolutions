# Data Architecture (No PostgreSQL)

This project intentionally does **not** use PostgreSQL or Prisma.

## Source of truth

TypeScript modules in `src/data/`:

- services
- locations (Hyderabad only)
- areas
- landmarks
- property types
- problems
- guides
- blog posts

## Generated registry

```bash
npm run pages:create
```

Writes `data/generated/pages.json` for offline publishing/audit workflows.

Runtime pages also call `createAllPageRecords()` through `src/lib/pages/registry.ts` with in-memory caching.

## Pagination

`paginatePages()` provides cursor-based slicing so scripts never need to load unbounded result sets into ad-hoc loops without limits.

## Future PostgreSQL migration

If a database is introduced later, map each TypeScript entity to a Prisma model and keep the same page-factory / indexability / sitemap contracts.
