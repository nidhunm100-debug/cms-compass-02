import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Limra Academy CMS" },
      { name: "description", content: "Enquiry volume, statuses and most requested programs." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Analytics — Limra Academy CMS" },
      { property: "og:description", content: "Enquiry and content analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalyticsPage,
});

type Enquiry = {
  created_at: string;
  status: string;
  country: string | null;
  training_requirement: string | null;
};

function tally(rows: Enquiry[], key: (row: Enquiry) => string | null) {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const value = key(row);
    if (!value) return;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function BarList({ title, data }: { title: string; data: [string, number][] }) {
  const max = data[0]?.[1] ?? 1;
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="font-display text-lg">{title}</h2>
      {data.length ? (
        <ul className="mt-4 space-y-3">
          {data.slice(0, 8).map(([label, count]) => (
            <li key={label}>
              <div className="flex items-center justify-between text-sm">
                <span>{label}</span>
                <span className="text-muted-foreground">{count}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Not enough data yet.</p>
      )}
    </section>
  );
}

function AnalyticsPage() {
  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["admin", "analytics", "enquiries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("enquiries")
        .select("created_at, status, country, training_requirement")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(1000);
      return (data ?? []) as Enquiry[];
    },
  });

  const byMonth = tally(enquiries, (row) =>
    new Date(row.created_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }),
  ).sort((a, b) => new Date(`1 ${a[0]}`).getTime() - new Date(`1 ${b[0]}`).getTime());

  return (
    <AdminShell>
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-2xl">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Based on enquiries submitted through the website contact form.
          </p>
        </header>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading analytics…</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <BarList title="Enquiries by month" data={byMonth} />
            <BarList title="Enquiries by status" data={tally(enquiries, (r) => r.status)} />
            <BarList title="Enquiries by country" data={tally(enquiries, (r) => r.country)} />
            <BarList
              title="Most requested programs"
              data={tally(enquiries, (r) => r.training_requirement)}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
