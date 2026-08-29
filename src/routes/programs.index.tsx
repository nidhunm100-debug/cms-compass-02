import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  const [category, setCategory] = useState<string>("All");
  const categories = ["All", ...Array.from(new Set(programs.map((p) => p.category).filter(Boolean) as string[]))];
  const visible = category === "All" ? programs : programs.filter((p) => p.category === category);

  return (
    <PublicLayout>
      <SeoHead pageKey="programs" />
      <PageHeader
        eyebrow="Programs"
        title="Our Training Programs"
        intro="Every program is delivered on campus or in-house by Limra trainers."
      />
      <section className="mx-auto max-w-6xl px-4 py-14">
        {categories.length > 2 ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        ) : null}
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading programs…</p>
        ) : visible.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((program) => (
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
                    {program.category ? <Badge>{program.category}</Badge> : null}
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
