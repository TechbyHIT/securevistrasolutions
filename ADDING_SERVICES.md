# Adding Services

1. Open `src/data/initial-services.ts`
2. Add a complete `Service` object with unique `id` and `slug`
3. Set `publicationStatus: "published"` only when content is reviewed
4. Set `allowIndexing: true` only when ready for SEO
5. Run:

```bash
npm run pages:create
npm run pages:count
npm run seo:audit
```

Published services automatically feed:

- `/services/[slug]/`
- `/hyderabad/[slug]/`
- `/hyderabad/[area]/[slug]/`
- property-type combinations
- internal links and sitemaps
