import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout, whatsappHref } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { Eyebrow, Rise, Shell } from "@/components/site/premium";
import { CTASection } from "@/components/site/ui-kit";
import { useHomepageSections, useSiteSettings, useTrainingTopics, type TrainingTopic } from "@/lib/public-cms";
import { cn } from "@/lib/utils";

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

const IMAGE_KEYS = ["programs", "approach", "who_we_serve", "teacher_training", "corporate_training", "gallery"];

function TrainingAreasPage() {
  const { data: topics = [], isLoading } = useTrainingTopics();
  const { data: sections } = useHomepageSections();
  const { data: settings = {} } = useSiteSettings();
  const wa = whatsappHref(settings.contact?.whatsapp);
  const map = sections?.map ?? {};

  const groups = topics.reduce<Record<string, TrainingTopic[]>>((acc, topic) => {
    const key = topic.category || topic.topic_group || "Other";
    (acc[key] ??= []).push(topic);
    return acc;
  }, {});
  const entries = Object.entries(groups);

  return (
    <PublicLayout overlay>
      <SeoHead pageKey="training-areas" />

      {/* ---------------- Compact hero ---------------- */}
      <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
        {map["approach"]?.image_url ? (
          <img
            src={map["approach"].image_url}
            alt="Limra Academy workshop activity"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
        ) : (
          <div aria-hidden className="royal-gradient absolute inset-0 -z-20" />
        )}
        <div aria-hidden className="side-veil absolute inset-0 -z-10" />
        <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-14 sm:px-8 sm:pt-36 sm:pb-20">
          <Rise className="max-w-3xl">
            <Eyebrow invert>Training areas</Eyebrow>
            <h1 className="display-lg mt-4 text-dark-foreground">Every area we train in.</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-dark-foreground/75 sm:text-lg">
              Topics are delivered as full workshops or as modules inside a program, depending on your requirement.
            </p>
          </Rise>
        </div>
      </section>

      {isLoading ? (
        <Shell tone="white">
          <p className="text-sm text-muted-foreground">Loading training areas…</p>
        </Shell>
      ) : entries.length ? (
        entries.map(([group, list], i) => {
          const image = map[IMAGE_KEYS[i % IMAGE_KEYS.length]!]?.image_url;
          const reverse = i % 2 === 1;
          const subGroups = list.reduce<Record<string, TrainingTopic[]>>((acc, t) => {
            (acc[t.topic_group || "Topics"] ??= []).push(t);
            return acc;
          }, {});

          return (
            <Shell key={group} tone={i % 2 === 0 ? "white" : "lavender"}>
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                {image ? (
                  <Rise className={cn("min-w-0", reverse && "lg:order-2")}>
                    <figure className="overflow-hidden rounded-3xl">
                      <img
                        src={image}
                        alt={group}
                        loading="lazy"
                        className="aspect-4/3 w-full object-cover"
                      />
                    </figure>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {list.length} topic{list.length === 1 ? "" : "s"} in this area
                    </p>
                  </Rise>
                ) : null}

                <Rise delay={80} className={cn("min-w-0", reverse && "lg:order-1")}>
                  <h2 className="display-md text-balance-tight">{group}</h2>
                  <div className="mt-6 space-y-6">
                    {Object.entries(subGroups).map(([sub, items]) => (
                      <div key={sub} className="border-t border-border pt-4">
                        <p className="eyebrow">{sub}</p>
                        <ul className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                          {items.map((t) => (
                            <li key={t.id} className="text-sm">
                              {t.name}
                              {t.description ? (
                                <span className="block text-xs text-muted-foreground">{t.description}</span>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Rise>
              </div>
            </Shell>
          );
        })
      ) : (
        <Shell tone="white">
          <p className="text-sm text-muted-foreground">No training areas published yet.</p>
        </Shell>
      )}

      <CTASection
        title="Discuss your training requirement"
        body="Tell us which areas matter most and we will shape the workshop around them."
        whatsappHref={wa}
      />
    </PublicLayout>
  );
}
