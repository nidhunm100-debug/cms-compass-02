import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { Reveal, Section, SectionHeading, StatBlock } from "@/components/site/ui-kit";
import { useCountries, useHomepageSections, useImpactStats, useInstitutions } from "@/lib/public-cms";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Our Impact — Limra Academy for Excellence" },
      {
        name: "description",
        content:
          "Limra Academy has trained 60,500+ employees and managers, 2 Lakh+ university students and 26 Lakh+ school students.",
      },
      { property: "og:title", content: "Our Impact — Limra Academy" },
      { property: "og:description", content: "Training reach across schools, universities and organizations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImpactPage,
});

const PRINCIPLES = [
  { title: "Psychology-Based", body: "Techniques grounded in psychology and human development." },
  { title: "Technique-Oriented", body: "Clear techniques participants can use immediately." },
  { title: "Activity-Oriented", body: "Guided activities instead of one-way lectures." },
  { title: "Practical", body: "Practised in the room, applied the very next day." },
] as const;

function ImpactPage() {
  const { data: stats = [] } = useImpactStats();
  const { data: countries = [] } = useCountries();
  const { data: institutions = [] } = useInstitutions();
  const { data: sections } = useHomepageSections();
  const approach = sections?.map["approach"];

  return (
    <PublicLayout>
      <SeoHead pageKey="impact" />

      <Section tone="purple">
        <SectionHeading invert eyebrow="Our impact" title="Experience measured in people trained" />
        {stats.length ? (
          <dl className="mt-12 grid gap-10 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.id}>
                <StatBlock value={s.value} label={s.label} invert />
                {s.description ? (
                  <p className="mt-2 text-sm text-deep-purple-foreground/70">{s.description}</p>
                ) : null}
              </div>
            ))}
          </dl>
        ) : null}
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Our approach"
          title={approach?.heading || "Our Approach"}
          intro={
            approach?.body ||
            "It is not a lecture but a technique-oriented, psychology-based and activity-oriented workshop."
          }
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 70} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-display text-lg font-bold">{p.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="lavender">
        <SectionHeading
          eyebrow="International training experience"
          title="Countries and institutions"
          intro="Selected institutions where Limra Academy has conducted training."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-3xl font-extrabold text-primary">{countries.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Countries with training experience</p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium">
              {countries.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-3xl font-extrabold text-primary">{institutions.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Published institutions in our directory</p>
          </div>
        </div>
      </Section>
    </PublicLayout>
  );
}
