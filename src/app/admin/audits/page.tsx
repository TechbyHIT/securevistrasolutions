import { requireAdmin } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminClient";
import { countByStatus, getAllPages, countIndexablePages } from "@/lib/pages/registry";

export default async function AdminAuditsPage() {
  await requireAdmin();
  const counts = countByStatus();
  const pages = getAllPages();
  const withPlaceholders = pages.filter((p) => p.placeholders.length > 0);
  const lowQuality = pages.filter((p) => p.qualityScore < 80);
  const indexableTotal = countIndexablePages();

  return (
    <AdminShell title="Audits">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] p-5">
          <h2 className="font-semibold">Indexability</h2>
          <p className="mt-2 text-3xl font-bold">{indexableTotal.toLocaleString()}</p>
          <p className="text-sm text-[var(--muted)]">indexable of {counts.total.toLocaleString()} materialized + programmatic</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-5">
          <h2 className="font-semibold">Placeholders</h2>
          <p className="mt-2 text-3xl font-bold">{withPlaceholders.length}</p>
          <p className="text-sm text-[var(--muted)]">pages with unresolved placeholders</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-5">
          <h2 className="font-semibold">Low quality</h2>
          <p className="mt-2 text-3xl font-bold">{lowQuality.length}</p>
          <p className="text-sm text-[var(--muted)]">pages below score 80</p>
        </div>
      </div>
      <p className="mt-8 text-sm text-[var(--muted)]">
        Run full audits: <code>npm run seo:audit</code>, <code>npm run content:audit</code>,{" "}
        <code>npm run schema:audit</code>
      </p>
    </AdminShell>
  );
}
