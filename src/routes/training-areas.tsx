import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { PrimaryButton, Reveal, Section, SectionHeading } from "@/components/site/ui-kit";
import { useTrainingTopics, type TrainingTopic } from "@/lib/public-cms";

export const Route = createFileRoute("/training-areas")({
  head: () => ({
    meta: [
      { title: "Training Areas — Memory, Communication, Leadership | Limra Academy" },
      {
        name: "description",
        content:
          "Training areas covered by Limra Academy: memory, concentration, brain gym, communication, leadership, body language, teamwork, teaching skills and more.",
      },
      { property: "og:title", content: "Training Areas — Limra Academy" },
      { property: "og:description", content: "The full list of Limra Academy training areas and topics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrainingAreasPage,
});

function TrainingAreasPage() {
  const { data: topics = [], isLoading } = useTrainingTopics();

  const groups = topics.reduce<Record<string, TrainingTopic[]>>((acc, topic) => {
    const key = topic.topic_group || topic.category || "Other";
    (acc[key] ??= []).push(topic);
    return acc;
  }, {});

  return (
    <PublicLayout>
      <SeoHead pageKey="training-areas" />

      <Section tone="white">
        <SectionHeading
          eyebrow="Training areas"
          title="Every area we train in"
          intro="Topics are delivered as full workshops or as modules inside a program, depending on your requirement."
        />
        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading training areas…</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groups).map(([group, list], i) => (
              <Reveal key={group} delay={i * 50} className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-bold">{group}</h2>
                <ul className="mt-4 space-y-2">
                  {list.map((t) => (
                    <li key={t.id} className="text-sm text-muted-foreground">
                      {t.name}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        )}
        <div className="mt-12">
          <PrimaryButton to="/contact">Discuss your training requirement</PrimaryButton>
        </div>
      </Section>
    </PublicLayout>
  );
}
