# SEO Architecture

## URL structure

Exact public routes are implemented, including:

- `/services/[serviceSlug]/`
- `/locations/hyderabad/`
- `/locations/hyderabad/[areaSlug]/`
- `/hyderabad/[serviceSlug]/`
- `/hyderabad/[areaSlug]/[serviceSlug]/`
- `/solutions/[problemSlug]/`
- `/property-types/[propertyTypeSlug]/[serviceSlug]/`
- `/guides/[guideSlug]/`
- `/blog/[postSlug]/`

## Indexability

`isPageIndexable()` requires published status, quality score ≥ 80, reviewed content, verified local data where required, unique metadata/content, valid canonical/schema/internal links, word-count floors, and similarity ≤ 0.7. Placeholders block indexing.

## Metadata

Every programmatic page uses the Next.js Metadata API through `generatePageMetadata()`.

## Sitemaps

- `/sitemap.xml` index
- `/sitemaps/[group]` group files
- Max 10,000 URLs per group batch
- Only indexable pages are included

## Robots

`src/app/robots.ts` allows public routes and blocks `/admin/` and private APIs.
