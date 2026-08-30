import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { PublicLayout, whatsappHref } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { Eyebrow, Rise, Shell } from "@/components/site/premium";
import { CTASection, ProgramCard, SecondaryButton } from "@/components/site/ui-kit";
import { useHomepageSections, usePrograms, useSiteSettings } from "@/lib/public-cms";

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

const CATEGORY_ORDER = [
  "Student Development",
  "Teacher Development",
  "Corporate & Professional Development",
  "Personal Effectiveness",
  "Communication & Leadership",
  "Cognitive & Memory Training",
  "Teaching & Education Skills",
  "Other Professional Training",
];

function ProgramsPage() {
  const { data: programs = [], isLoading } = usePrograms();
  const { data: sections } = useHomepageSections();
  const { data: settings = {} } = useSiteSettings();
  const wa = whatsappHref(settings.contact?.whatsapp);
  const [category, setCategory] = useState<string>("All");

  const featured = useMemo(
    () => programs.find((p) => p.featured) ?? programs.find((p) => /train the brain/i.test(p.name)) ?? null,
    [programs],
  );
  const rest = programs.filter((p) => p.id !== featured?.id);

  const presentCategories = useMemo(() => {
    const found = Array.from(new Set(rest.map((p) => p.category).filter(Boolean) as string[]));
    return [...CATEGORY_ORDER.filter((c) => found.includes(c)), ...found.filter((c) => !CATEGORY_ORDER.includes(c))];
  }, [rest]);

  const groups = (category === "All" ? presentCategories : presentCategories.filter((c) => c === category)).map(
    (c) => ({ category: c, list: rest.filter((p) => p.category === c) }),
  );
  const uncategorised = category === "All" ? rest.filter((p) => !p.category) : [];

  return (
    <PublicLayout overlay>
      <SeoHead pageKey="programs" />

      {/* ---------------- Compact hero ---------------- */}
      <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
        {sections?.map["programs"]?.image_url ? (
          <img
            src={sections.map["programs"].image_url}
            alt="Limra Academy workshop"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
        ) : (
          <div aria-hidden className="royal-gradient absolute inset-0 -z-20" />
        )}
        <div aria-hidden className="side-veil absolute inset-0 -z-10" />
        <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-14 sm:px-8 sm:pt-36 sm:pb-20">
          <Rise className="max-w-3xl">
            <Eyebrow invert>Programs</Eyebrow>
            <h1 className="display-lg mt-4 text-dark-foreground">Training designed for real-world learning.</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-dark-foreground/75 sm:text-lg">
              Every program is delivered on campus or in-house by Limra trainers, and shaped around the audience in
              the room.
            </p>
          </Rise>
        </div>
      </section>

      {/* ---------------- Featured program ---------------- */}
      {featured ? (
        <Shell tone="white">
          <ProgramCard
            featured
            name={featured.name}
            audience={featured.target_audience}
            duration={featured.duration}
            description={featured.short_description}
            image={featured.image_url}
            to={`/programs/${featured.slug || featured.id}`}
          />
        </Shell>
      ) : null}

      {/* ---------------- Categories ---------------- */}
      <Shell tone="lavender">
        <div className="grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
          <Rise className="min-w-0">
            <Eyebrow>All programs</Eyebrow>
            <h2 className="display-md text-balance-tight mt-4">Programs by category.</h2>
          </Rise>
          <SecondaryButton to="/training-areas" size="default">
            Training areas <ArrowRight className="ml-1.5 size-4" />
          </SecondaryButton>
        </div>

        {presentCategories.length > 1 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {["All", ...presentCategories].map((c) => (
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
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        ) : groups.length || uncategorised.length ? (
          <div className="mt-10 space-y-12">
            {groups.map((group) => (
              <div key={group.category}>
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
                  <h3 className="font-display text-xl font-extrabold tracking-tight">{group.category}</h3>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {group.list.length} program{group.list.length === 1 ? "" : "s"}
                  </span>
                </div>
                {group.list.length ? (
                  <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.list.map((p) => (
                      <ProgramCard
                        key={p.id}
                        name={p.name}
                        audience={p.target_audience}
                        duration={p.duration}
                        description={p.short_description}
                        image={p.image_url}
                        to={`/programs/${p.slug || p.id}`}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">No programs currently listed.</p>
                )}
              </div>
            ))}

            {uncategorised.length ? (
              <div>
                <div className="border-b border-border pb-3">
                  <h3 className="font-display text-xl font-extrabold tracking-tight">More programs</h3>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {uncategorised.map((p) => (
                    <ProgramCard
                      key={p.id}
                      name={p.name}
                      audience={p.target_audience}
                      duration={p.duration}
                      description={p.short_description}
                      image={p.image_url}
                      to={`/programs/${p.slug || p.id}`}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            No programs published yet.{" "}
            <Link to="/contact" className="font-semibold text-primary">
              Ask us what we can run for you
            </Link>
            .
          </p>
        )}
      </Shell>

      <CTASection
        title="Not sure which program fits?"
        body="Tell us the audience, the objective and the time available — we will recommend the right workshop."
        whatsappHref={wa}
      />
    </PublicLayout>
  );
}
