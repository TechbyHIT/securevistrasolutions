# Publishing Workflow

```txt
Draft → validation → content audit → local verification → duplicate audit → SEO audit → human review → approved → published → sitemap → monitoring
```

## Commands

```bash
npm run pages:create -- --type=service-area --limit=1000
npm run content:audit
npm run duplicates:audit
npm run seo:audit
npm run pages:publish -- --batch-size=500
npm run pages:noindex -- --quality-below=80
```

`--batch-size` is required for publish. There is no accidental publish-all command.
