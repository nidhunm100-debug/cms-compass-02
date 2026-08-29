import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { EmptyState, PageHeader, PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { usePrograms } from "@/lib/public-cms";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "Training Programs — Limra Academy" },
      {
        name: "description",
        content:
          "Explore Limra Academy training programs for school students, university students, teachers and corporate teams.",
      },
      { property: "og:title", content: "Training Programs — Limra Academy" },
      { property: "og:description", content: "Workshops for students, teachers and corporate teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const { data: programs = [], isLoading } = usePrograms();

  return (
    <PublicLayout>
      <SeoHead pageKey="programs" />
      <PageHeader
        eyebrow="Programs"
        title="Our Training Programs"
        intro="Every program is delivered on campus or in-house by Limra trainers."
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading programs…</p>
        ) : programs.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <article key={program.id} className="overflow-hidden rounded-lg border border-border bg-card">
                {program.image_url ? (
                  <img
                    src={program.image_url}
                    alt={program.name}
                    loading="lazy"
                    className="aspect-16/10 w-full object-cover"
                  />
                ) : null}
                <div className="space-y-2 p-5">
                  <h2 className="font-display text-xl">{program.name}</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {program.target_audience ? <Badge variant="secondary">{program.target_audience}</Badge> : null}
                    {program.duration ? <Badge variant="outline">{program.duration}</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{program.short_description}</p>
                  <Link
                    to="/programs/$slug"
                    params={{ slug: program.slug || program.id }}
                    className="inline-flex items-center text-sm font-medium text-primary"
                  >
                    View program <ArrowRight className="ml-1 size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No programs published yet."
            body="An administrator can add programs in the admin panel."
          />
        )}
      </section>
    </PublicLayout>
  );
}
