import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  CalendarDays,
  Globe2,
  Image as ImageIcon,
  Layers,
  Mail,
  Plus,
  Users,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Limra Academy CMS" },
      { name: "description", content: "Content overview, recent enquiries and quick actions for Limra Academy." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Dashboard — Limra Academy CMS" },
      { property: "og:description", content: "Admin overview for the Limra Academy website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

async function countRows(table: string, filters: Record<string, unknown> = {}) {
  // Table names are dynamic here, so this count helper uses an untyped client.
  const db = supabase as unknown as {
    from: (table: string) => any;
  };
  let q = db.from(table).select("id", { count: "exact", head: true });
  Object.entries(filters).forEach(([key, value]) => {
    q = value === null ? q.is(key, null) : q.eq(key, value);
  });
  const { count } = (await q) as { count: number | null };
  return count ?? 0;
}

function StatCard({
  label,
  value,
  icon: Icon,
  to,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  to: string;
}) {
  return (
    <Link to={to} className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="font-display mt-2 text-3xl">{value}</p>
    </Link>
  );
}

function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: async () => {
      const [trainers, programs, institutions, countries, gallery, workshops, media, newEnquiries, allEnquiries] =
        await Promise.all([
          countRows("trainers", { deleted_at: null }),
          countRows("programs", { deleted_at: null }),
          countRows("institutions", { deleted_at: null }),
          countRows("countries", { deleted_at: null }),
          countRows("gallery_images", { deleted_at: null }),
          countRows("workshops", { deleted_at: null }),
          countRows("media_assets", { deleted_at: null }),
          countRows("enquiries", { status: "New", deleted_at: null }),
          countRows("enquiries", { deleted_at: null }),
        ]);
      return { trainers, programs, institutions, countries, gallery, workshops, media, newEnquiries, allEnquiries };
    },
  });

  const { data: recentEnquiries = [] } = useQuery({
    queryKey: ["admin", "recent-enquiries"],
    queryFn: async () => {
      const { data } = await supabase
        .from("enquiries")
        .select("id, name, organization, country, training_requirement, status, created_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(6);
      return (data ?? []) as {
        id: string;
        name: string;
        organization: string | null;
        country: string | null;
        training_requirement: string | null;
        status: string;
        created_at: string;
      }[];
    },
  });

  const { data: upcoming = [] } = useQuery({
    queryKey: ["admin", "upcoming-workshops"],
    queryFn: async () => {
      const { data } = await supabase
        .from("workshops")
        .select("id, name, event_date, city, country")
        .eq("status", "Upcoming")
        .is("deleted_at", null)
        .order("event_date")
        .limit(5);
      return (data ?? []) as { id: string; name: string; event_date: string | null; city: string | null; country: string | null }[];
    },
  });

  return (
    <AdminShell>
      <div className="space-y-8">
        <header>
          <h1 className="font-display text-2xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">A snapshot of everything on the Limra Academy website.</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Trainers" value={stats?.trainers ?? 0} icon={Users} to="/admin/trainers" />
          <StatCard label="Programs" value={stats?.programs ?? 0} icon={Layers} to="/admin/programs" />
          <StatCard label="Institutions" value={stats?.institutions ?? 0} icon={Building2} to="/admin/institutions" />
          <StatCard label="Countries" value={stats?.countries ?? 0} icon={Globe2} to="/admin/countries" />
          <StatCard label="Gallery images" value={stats?.gallery ?? 0} icon={ImageIcon} to="/admin/gallery" />
          <StatCard label="Media files" value={stats?.media ?? 0} icon={ImageIcon} to="/admin/media" />
          <StatCard label="Workshops" value={stats?.workshops ?? 0} icon={CalendarDays} to="/admin/workshops" />
          <StatCard label="New enquiries" value={stats?.newEnquiries ?? 0} icon={Mail} to="/admin/enquiries" />
        </div>

        <section>
          <h2 className="text-sm font-semibold tracking-wide uppercase">Quick actions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link to="/admin/trainers">
                <Plus className="mr-1.5 size-4" /> Add trainer
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/programs">
                <Plus className="mr-1.5 size-4" /> Add program
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/institutions">
                <Plus className="mr-1.5 size-4" /> Add institution
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/gallery">
                <Plus className="mr-1.5 size-4" /> Upload gallery photos
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/admin/homepage">Edit homepage</Link>
            </Button>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg">Recent enquiries</h2>
              <Button asChild size="sm" variant="ghost">
                <Link to="/admin/enquiries">View all</Link>
              </Button>
            </div>
            {recentEnquiries.length ? (
              <ul className="mt-4 divide-y divide-border">
                {recentEnquiries.map((enquiry) => (
                  <li key={enquiry.id} className="flex items-start justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium">{enquiry.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {[enquiry.organization, enquiry.country, enquiry.training_requirement]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <Badge variant={enquiry.status === "New" ? "default" : "secondary"}>{enquiry.status}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No enquiries yet.</p>
            )}
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg">Upcoming workshops</h2>
              <Button asChild size="sm" variant="ghost">
                <Link to="/admin/workshops">Manage</Link>
              </Button>
            </div>
            {upcoming.length ? (
              <ul className="mt-4 divide-y divide-border">
                {upcoming.map((workshop) => (
                  <li key={workshop.id} className="py-3">
                    <p className="text-sm font-medium">{workshop.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[
                        workshop.event_date
                          ? new Date(workshop.event_date).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : null,
                        workshop.city,
                        workshop.country,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No upcoming workshops scheduled.</p>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
