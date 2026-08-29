import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";

import { EmptyState, PageHeader, PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { useWorkshops, type Workshop } from "@/lib/public-cms";
import { sanitizeHtml } from "@/lib/sanitize";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/workshops")({
  head: () => ({
    meta: [
      { title: "Upcoming & Past Workshops — Limra Academy" },
      {
        name: "description",
        content: "Browse upcoming Limra Academy workshops and look back at completed training programs.",
      },
      { property: "og:title", content: "Upcoming & Past Workshops — Limra Academy" },
      { property: "og:description", content: "Workshop schedule and past training sessions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkshopsPage,
});

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card">
      {workshop.image_url ? (
        <img src={workshop.image_url} alt={workshop.name} loading="lazy" className="aspect-16/9 w-full object-cover" />
      ) : null}
      <div className="space-y-2 p-5">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{workshop.status}</Badge>
          {workshop.event_date ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5" />
              {new Date(workshop.event_date).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          ) : null}
        </div>
        <h3 className="font-display text-xl">{workshop.name}</h3>
        {workshop.location || workshop.city || workshop.country ? (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {[workshop.location, workshop.city, workshop.country].filter(Boolean).join(", ")}
          </p>
        ) : null}
        {workshop.description ? (
          <div
            className="prose-cms text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(workshop.description) }}
          />
        ) : null}
        {workshop.registration_link ? (
          <Button asChild size="sm" className="mt-2">
            <a href={workshop.registration_link} target="_blank" rel="noreferrer">
              Register
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function WorkshopsPage() {
  const { data: workshops = [], isLoading } = useWorkshops();
  const upcoming = workshops.filter((w) => w.status === "Upcoming");
  const past = workshops.filter((w) => w.status === "Completed");

  return (
    <PublicLayout>
      <SeoHead pageKey="workshops" />
      <PageHeader eyebrow="Workshops" title="Workshops & Events" intro="What is coming up, and what we have delivered." />
      <section className="mx-auto max-w-6xl space-y-14 px-4 py-14">
        <div>
          <h2 className="font-display text-2xl">Upcoming Workshops</h2>
          <div className="mt-5">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading workshops…</p>
            ) : upcoming.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((w) => (
                  <WorkshopCard key={w.id} workshop={w} />
                ))}
              </div>
            ) : (
              <EmptyState title="No upcoming workshops announced." body="Check back soon or send us an enquiry." />
            )}
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl">Past Workshops</h2>
          <div className="mt-5">
            {past.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((w) => (
                  <WorkshopCard key={w.id} workshop={w} />
                ))}
              </div>
            ) : (
              <EmptyState title="No past workshops added yet." body="Completed workshops will appear here." />
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
