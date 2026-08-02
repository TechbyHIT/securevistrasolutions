import { requireAdmin } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminClient";
import { PUBLISHING_CONFIG } from "@/config/publishing";

export default async function AdminPublishingPage() {
  await requireAdmin();

  return (
    <AdminShell title="Publishing">
      <p className="mb-6 text-sm text-[var(--muted)]">
        Use CLI scripts for batch publishing: <code>npm run pages:publish</code>,{" "}
        <code>npm run pages:noindex</code>
      </p>
      <div className="space-y-6">
        {Object.entries(PUBLISHING_CONFIG.phases).map(([phase, config]) => (
          <div key={phase} className="rounded-lg border border-[var(--border)] p-5">
            <h2 className="font-semibold">
              Phase {phase}: {config.name}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Page types: {config.pageTypes.join(", ")}
            </p>
            <p className="text-sm text-[var(--muted)]">
              Priorities: {config.crawlPriorities.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
