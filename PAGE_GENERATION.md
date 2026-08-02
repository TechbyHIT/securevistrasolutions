# Page Generation

Page records are generated in `src/lib/publishing/page-factory.ts` from separate data sources.

Eligible combinations currently include:

- core pages
- services
- Hyderabad location
- Hyderabad areas
- Hyderabad × service
- Hyderabad area × service
- solutions
- property-type × service
- guides
- blog posts

Dynamic routes fetch records and call `notFound()` for missing/unpublished paths.

`generateStaticParams` is limited to high-priority routes (services + Hyderabad). Remaining URLs render on demand with ISR.
