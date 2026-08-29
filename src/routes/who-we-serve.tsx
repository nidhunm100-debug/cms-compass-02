import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import {
  PrimaryButton,
  Reveal,
  Section,
  SectionHeading,
  SecondaryButton,
} from "@/components/site/ui-kit";
import { useHomepageSections, usePrograms, useTrainingTopics } from "@/lib/public-cms";

export const Route = createFileRoute("/who-we-serve")({
  head: () => ({
    meta: [
      { title: "Who We Serve — Schools, Teachers & Corporates | Limra Academy" },
      {
        name: "description",
        content:
          "Limra Academy trains three audiences: school students, teachers and educators, and corporate employees, managers and professionals.",
      },
      { property: "og:title", content: "Who We Serve — Limra Academy" },
      {
        property: "og:description",
        content: "Training journeys for schools and students, teachers and educators, corporates and professionals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WhoWeServePage,
});

const AUDIENCES = [
  {
    index: "01",
    title: "Schools & Students",
    focus: [
      "Student development",
      "Learning techniques",
      "Memory",
      "Concentration",
      "Confidence",
      "Study techniques",
      "Career guidance",
    ],
    programCategory: "Student Development",
    topicCategories: ["Student Development", "Cognitive & Memory Training"],
    target: "School Students – Classes VII to XII",
    flagship: "Train the Brain",
  },
  {
    index: "02",
    title: "Teachers & Educators",
    focus: [
      "Effective teaching",
      "Communication",
      "Student psychology",
      "Classroom management",
      "Teaching techniques",
      "Student engagement",
      "Creative thinking",
      "Team building",
      "Work ethics",
    ],
    programCategory: "Teacher Development",
    topicCategories: ["Teacher Development", "Teaching & Education Skills"],
    target: "Teachers & Educators",
    flagship: "Effective Teaching Skills",
  },
  {
    index: "03",
    title: "Corporates & Professionals",
    focus: [
      "Professional development",
      "Communication",
      "Leadership",
      "Teamwork",
      "Personality development",
      "Memory",
      "Lateral thinking",
      "Work ethics",
    ],
    programCategory: "Corporate & Professional Development",
    topicCategories: ["Corporate & Professional Development", "Communication & Leadership", "Other Professional Training"],
    target: "Employees, Managers & Professionals",
    flagship: "Corporate / Professional Training",
  },
] as const;

function WhoWeServePage() {
  const { data: programs = [] } = usePrograms();
  const { data: topics = [] } = useTrainingTopics();
  const { data: sections } = useHomepageSections();
  const intro = sections?.map["who_we_serve"];

  return (
    <PublicLayout>
      <SeoHead pageKey="who-we-serve" />

      <Section tone="white">
        <SectionHeading
          eyebrow="Who we serve"
          title={intro?.heading || "Three audiences. One practical method."}
          intro={
            intro?.subheading ||
            "Every Limra workshop is designed for a specific room — students, educators or professional teams."
          }
        />
      </Section>

      {AUDIENCES.map((audience, i) => {
        const audiencePrograms = programs.filter((p) => p.category === audience.programCategory);
        const audienceTopics = topics.filter((t) => audience.topicCategories.includes((t.category ?? "") as never));
        return (
          <Section key={audience.index} tone={i % 2 === 0 ? "lavender" : "white"} id={audience.title.toLowerCase().replace(/\W+/g, "-")}>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <Reveal className="min-w-0">
                <p className="eyebrow">Category {audience.index}</p>
                <h2 className="text-balance-tight mt-3 text-3xl sm:text-4xl">{audience.title}</h2>
                <p className="mt-4 text-sm font-semibold text-violet">{audience.target}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {audience.focus.map((f) => (
                    <li key={f} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <PrimaryButton to="/contact">Enquire for this audience</PrimaryButton>
                  <SecondaryButton to="/programs" size="default">
                    All programs <ArrowRight className="ml-1.5 size-4" />
                  </SecondaryButton>
                </div>
              </Reveal>

              <Reveal className="min-w-0" delay={90}>
                {audiencePrograms.length ? (
                  <div className="space-y-4">
                    {audiencePrograms.map((p) => (
                      <article key={p.id} className="rounded-2xl border border-border bg-card p-6">
                        <h3 className="font-display text-lg font-bold">{p.name}</h3>
                        {p.short_description ? (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.short_description}</p>
                        ) : null}
                        <div className="mt-4">
                          <SecondaryButton to={`/programs/${p.slug || p.id}`} size="sm">
                            View program
                          </SecondaryButton>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                    Programs for this audience will appear here once published in the admin panel.
                  </p>
                )}

                {audienceTopics.length ? (
                  <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
                    <p className="eyebrow">Training areas covered</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {audienceTopics.slice(0, 14).map((t) => (
                        <li key={t.id} className="rounded-full bg-lavender px-3 py-1 text-xs font-medium text-lavender-foreground">
                          {t.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Reveal>
            </div>
          </Section>
        );
      })}
    </PublicLayout>
  );
}
