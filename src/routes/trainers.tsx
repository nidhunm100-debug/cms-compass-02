import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Linkedin, Search } from "lucide-react";

import { EmptyState, PublicLayout, whatsappHref } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { Eyebrow, Rise, Shell } from "@/components/site/premium";
import { CTASection, PrimaryButton } from "@/components/site/ui-kit";
import { useSiteSettings, useTrainers } from "@/lib/public-cms";
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
  const { data: settings = {} } = useSiteSettings();
  const wa = whatsappHref(settings.contact?.whatsapp);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [area, setArea] = useState("all");
  const areaOptions = Array.from(new Set(trainers.flatMap((t) => t.training_areas ?? []).filter(Boolean))).sort();

  const term = search.trim().toLowerCase();
  const filtered = term
    ? trainers.filter((t) =>
        [t.name, t.professional_title, t.qualification, t.short_bio, ...(t.training_areas ?? [])]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term)),
      )
    : trainers;
  const visible = area === "all" ? filtered : filtered.filter((t) => (t.training_areas ?? []).includes(area));

  const lead = trainers.find((t) => t.person_type === "Director") ?? trainers[0] ?? null;
  const others = visible.filter((t) => t.id !== lead?.id);
  const activeTrainer = trainers.find((t) => t.id === active) ?? null;

  return (
    <PublicLayout overlay>
      <SeoHead pageKey="trainers" />

      {/* ---------------- Compact hero ---------------- */}
      <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
        <div aria-hidden className="royal-gradient absolute inset-0 -z-20" />
        <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-14 sm:px-8 sm:pt-36 sm:pb-20">
          <Rise className="max-w-3xl">
            <Eyebrow invert>Our team</Eyebrow>
            <h1 className="display-lg mt-4 text-dark-foreground">Our Trainers & Experts</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-dark-foreground/75 sm:text-lg">
              Professionals who deliver Limra workshops for students, teachers and organisations worldwide.
            </p>
          </Rise>
        </div>
      </section>

      {/* ---------------- Featured trainer ---------------- */}
      {lead ? (
        <Shell tone="white">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-center lg:gap-14">
            <Rise className="min-w-0">
              <figure className="overflow-hidden rounded-3xl bg-lavender">
                {lead.photo_url ? (
                  <img
                    src={lead.photo_url}
                    alt={lead.name}
                    className="aspect-4/5 w-full object-cover"
                  />
                ) : (
                  <div className="aspect-4/5 w-full" />
                )}
              </figure>
            </Rise>
            <Rise delay={80} className="min-w-0">
              <Eyebrow>{lead.person_type || "Lead trainer"}</Eyebrow>
              <h2 className="display-md text-balance-tight mt-4">{lead.name}</h2>
              {lead.professional_title ? (
                <p className="mt-3 text-base font-semibold text-violet">{lead.professional_title}</p>
              ) : null}
              {lead.qualification ? (
                <p className="mt-2 text-sm text-muted-foreground">{lead.qualification}</p>
              ) : null}
              {lead.short_bio ? (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{lead.short_bio}</p>
              ) : null}
              {lead.training_areas?.length ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {lead.training_areas.map((a) => (
                    <li key={a} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
                      {a}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="outline" className="rounded-full" onClick={() => setActive(lead.id)}>
                  Full profile
                </Button>
                <PrimaryButton to="/contact">Book a workshop</PrimaryButton>
              </div>
            </Rise>
          </div>
        </Shell>
      ) : null}

      {/* ---------------- Other trainers ---------------- */}
      <Shell tone="lavender">
        <Rise>
          <Eyebrow>The team</Eyebrow>
          <h2 className="display-md text-balance-tight mt-4">Trainers & specialists.</h2>
        </Rise>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trainers"
              className="pl-8"
            />
          </div>
          {areaOptions.length ? (
            <div className="flex flex-wrap gap-2">
              {["all", ...areaOptions].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    area === a
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {a === "all" ? "All expertise" : a}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        ) : others.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((trainer) => (
              <Rise as="article" key={trainer.id} className="overflow-hidden rounded-3xl border border-border bg-card">
                {trainer.photo_url ? (
                  <img
                    src={trainer.photo_url}
                    alt={trainer.name}
                    loading="lazy"
                    className="aspect-4/5 w-full object-cover"
                  />
                ) : (
                  <div className="aspect-4/5 w-full bg-lavender" />
                )}
                <div className="space-y-2 p-5">
                  <h3 className="font-display text-lg font-bold">{trainer.name}</h3>
                  {trainer.professional_title ? (
                    <p className="text-sm text-muted-foreground">{trainer.professional_title}</p>
                  ) : null}
                  {trainer.qualification ? (
                    <p className="text-xs text-muted-foreground">{trainer.qualification}</p>
                  ) : null}
                  {trainer.training_areas?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {trainer.training_areas.slice(0, 3).map((a) => (
                        <Badge key={a} variant="secondary">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2 pt-1">
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
              </Rise>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title={term ? "No trainers match your search." : "No further trainers published yet."}
              body={term ? "Try a different name or topic." : undefined}
            />
          </div>
        )}
      </Shell>

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

      <CTASection
        title="Invite a Limra trainer to your campus"
        body="We travel to schools, colleges and offices across India and internationally."
        whatsappHref={wa}
      />
    </PublicLayout>
  );
}
