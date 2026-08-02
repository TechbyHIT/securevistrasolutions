import { requireAdmin } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminClient";
import { getPublishedLocations } from "@/data/initial-locations";
import { getPublishedAreas } from "@/data/initial-areas";

export default async function AdminLocationsPage() {
  await requireAdmin();
  const locations = getPublishedLocations();
  const areas = getPublishedAreas();

  return (
    <AdminShell title="Locations">
      <p className="mb-4 text-sm text-[var(--muted)]">Hyderabad-only coverage from data files.</p>
      <h2 className="mb-2 font-semibold">City</h2>
      <ul className="mb-6 list-disc pl-5 text-sm">
        {locations.map((l) => (
          <li key={l.id}>
            {l.name} — {l.publicationStatus} (score {l.qualityScore})
          </li>
        ))}
      </ul>
      <h2 className="mb-2 font-semibold">Areas ({areas.length})</h2>
      <ul className="list-disc pl-5 text-sm">
        {areas.slice(0, 20).map((a) => (
          <li key={a.id}>
            {a.name} — {a.publicationStatus}
          </li>
        ))}
        {areas.length > 20 ? <li>…and {areas.length - 20} more</li> : null}
      </ul>
    </AdminShell>
  );
}
