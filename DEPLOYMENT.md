# Deployment

1. Set environment variables from `.env.example`
2. Replace business placeholders in `src/config/business.ts`
3. Add real images under `public/images/`
4. Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

Deploy the Node.js Next.js build to your host (Vercel, VM, or container).

No database migration is required for the current architecture.
