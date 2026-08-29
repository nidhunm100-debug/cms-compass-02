import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Search } from "lucide-react";

import { EmptyState, PageHeader, PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { useTrainers } from "@/lib/public-cms";
import { sanitizeHtml } from "@/lib/sanitize";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/trainers")({
  head: () => ({
    meta: [
      { title: "Our Trainers — Limra Academy" },
      {
        name: "description",
        content:
          "Meet the Limra Academy trainers delivering memory, concentration, communication, leadership and teaching-skills workshops internationally.",
      },
      { property: "og:title", content: "Our Trainers — Limra Academy" },
      { property: "og:description", content: "The professionals behind Limra Academy workshops." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrainersPage,
});

function TrainersPage() {
  const { data: trainers = [], isLoading } = useTrainers();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const term = search.trim().toLowerCase();
  const filtered = term
    ? trainers.filter((t) =>
        [t.name, t.professional_title, t.qualification, t.short_bio, ...(t.training_areas ?? [])]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term)),
      )
    : trainers;

  const activeTrainer = trainers.find((t) => t.id === active) ?? null;

  return (
    <PublicLayout>
      <SeoHead pageKey="trainers" />
      <PageHeader eyebrow="Trainers" title="Our Trainers" intro="Professionals who deliver Limra workshops worldwide." />
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="relative mb-8 max-w-sm">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trainers"
            className="pl-8"
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading trainers…</p>
        ) : filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((trainer) => (
              <article key={trainer.id} className="overflow-hidden rounded-lg border border-border bg-card">
                {trainer.photo_url ? (
                  <img
                    src={trainer.photo_url}
                    alt={trainer.name}
                    loading="lazy"
                    className="aspect-4/5 w-full object-cover"
                  />
                ) : (
                  <div className="aspect-4/5 w-full bg-muted" />
                )}
                <div className="space-y-2 p-5">
                  <h2 className="font-display text-xl">{trainer.name}</h2>
                  {trainer.professional_title ? (
                    <p className="text-sm text-muted-foreground">{trainer.professional_title}</p>
                  ) : null}
                  {trainer.qualification ? (
                    <p className="text-xs text-muted-foreground">{trainer.qualification}</p>
                  ) : null}
                  {trainer.short_bio ? <p className="text-sm">{trainer.short_bio}</p> : null}
                  {trainer.training_areas?.length ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {trainer.training_areas.slice(0, 4).map((area) => (
                        <Badge key={area} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => setActive(trainer.id)}>
                      View profile
                    </Button>
                    {trainer.linkedin_url ? (
                      <Button asChild size="icon" variant="ghost">
                        <a href={trainer.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                          <Linkedin className="size-4" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title={term ? "No trainers match your search." : "No trainers published yet."}
            body={term ? "Try a different name or topic." : "An administrator can add trainers in the admin panel."}
          />
        )}
      </section>

      <Dialog open={!!activeTrainer} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{activeTrainer?.name}</DialogTitle>
          </DialogHeader>
          {activeTrainer ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {[activeTrainer.professional_title, activeTrainer.position, activeTrainer.qualification]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {activeTrainer.full_bio ? (
                <div
                  className="prose-cms"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeTrainer.full_bio) }}
                />
              ) : (
                <p className="text-sm">{activeTrainer.short_bio}</p>
              )}
              {activeTrainer.regions?.length ? (
                <p className="text-sm text-muted-foreground">Countries: {activeTrainer.regions.join(", ")}</p>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
}
