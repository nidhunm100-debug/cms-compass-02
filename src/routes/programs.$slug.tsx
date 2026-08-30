import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { EmptyState, PageHeader, PublicLayout } from "@/components/site/PublicLayout";
import { sanitizeHtml } from "@/lib/sanitize";
import type { Program } from "@/lib/public-cms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/programs/$slug")({
  head: () => ({
    meta: [
      { title: "Program — Limra Academy" },
      { name: "description", content: "Program details, topics, trainers and countries covered by Limra Academy." },
      { property: "og:title", content: "Program — Limra Academy" },
      { property: "og:description", content: "Program details from Limra Academy for Excellence." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgramDetailPage,
});

function ProgramDetailPage() {
  const { slug } = useParams({ from: "/programs/$slug" });

  const { data, isLoading } = useQuery({
    queryKey: ["public", "program", slug],
    queryFn: async () => {
      const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(slug);
      const { data: program } = await supabase
        .from("programs")
        .select("*")
        .eq(uuidLike ? "id" : "slug", slug)
        .eq("published", true)
        .is("deleted_at", null)
        .maybeSingle();
      if (!program) return null;

      const [{ data: trainerLinks }, { data: topicLinks }, { data: countryLinks }] = await Promise.all([
        supabase.from("program_trainers").select("trainer_id").eq("program_id", program.id),
        supabase.from("program_topics").select("topic_id").eq("program_id", program.id),
        supabase.from("program_countries").select("country_id").eq("program_id", program.id),
      ]);

      const trainerIds = (trainerLinks ?? []).map((r: { trainer_id: string }) => r.trainer_id);
      const topicIds = (topicLinks ?? []).map((r: { topic_id: string }) => r.topic_id);
      const countryIds = (countryLinks ?? []).map((r: { country_id: string }) => r.country_id);

      const [trainers, topics, countries] = await Promise.all([
        trainerIds.length
          ? supabase
              .from("trainers")
              .select("id, name, professional_title, photo_url")
              .in("id", trainerIds)
              .eq("published", true)
          : Promise.resolve({ data: [] }),
        topicIds.length
          ? supabase
              .from("training_topics")
              .select("id, name, topic_group")
              .in("id", topicIds)
              .eq("published", true)
              .order("display_order")
          : Promise.resolve({ data: [] }),
        countryIds.length
          ? supabase.from("countries").select("id, name, flag_emoji").in("id", countryIds).eq("published", true)
          : Promise.resolve({ data: [] }),
      ]);

      return {
        program: program as unknown as Program,
        trainers: (trainers.data ?? []) as { id: string; name: string; professional_title: string | null; photo_url: string | null }[],
        topics: (topics.data ?? []) as { id: string; name: string; topic_group: string | null }[],
        countries: (countries.data ?? []) as { id: string; name: string; flag_emoji: string | null }[],
      };
    },
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-4xl px-5 py-16 text-sm text-muted-foreground">Loading program…</div>
      </PublicLayout>
    );
  }

  if (!data) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-3xl px-5 py-16">
          <EmptyState title="Program not found." body="This program may be unpublished or the link has changed." />
          <Button asChild className="mt-6">
            <Link to="/programs">Back to programs</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const { program, trainers, topics, countries } = data;
  const gallery: string[] = Array.isArray(program.gallery_images) ? program.gallery_images : [];

  return (
    <PublicLayout>
      <PageHeader eyebrow="Program" title={program.name} intro={program.short_description} />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[2fr_1fr]">
        <div>
          {program.image_url ? (
            <img
              src={program.image_url}
              alt={program.name}
              className="aspect-16/9 w-full rounded-lg border border-border object-cover"
            />
          ) : null}
          {program.full_description ? (
            <div
              className="prose-cms mt-8"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(program.full_description) }}
            />
          ) : null}

          {topics.length ? (
            <div className="mt-10">
              <h2 className="font-display text-2xl">Topics covered</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {Object.entries(
                  topics.reduce<Record<string, typeof topics>>((acc, topic) => {
                    const key = topic.topic_group || "Topics";
                    (acc[key] ??= []).push(topic);
                    return acc;
                  }, {}),
                ).map(([group, list]) => (
                  <div key={group} className="rounded-2xl border border-border bg-card p-5">
                    <p className="eyebrow">{group}</p>
                    <ul className="mt-3 space-y-1.5">
                      {list.map((topic) => (
                        <li key={topic.id} className="text-sm text-muted-foreground">
                          {topic.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {gallery.length ? (
            <div className="mt-10">
              <h2 className="font-display text-2xl">From this program</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((url) => (
                  <img key={url} src={url} alt={program.name} loading="lazy" className="aspect-square w-full rounded-md object-cover" />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          <dl className="space-y-3 rounded-lg border border-border bg-card p-5 text-sm">
            {program.target_audience ? (
              <div>
                <dt className="eyebrow">Audience</dt>
                <dd>{program.target_audience}</dd>
              </div>
            ) : null}
            {program.duration ? (
              <div>
                <dt className="eyebrow">Duration</dt>
                <dd>{program.duration}</dd>
              </div>
            ) : null}
            {program.workshop_format ? (
              <div>
                <dt className="eyebrow">Format</dt>
                <dd>{program.workshop_format}</dd>
              </div>
            ) : null}
          </dl>

          {trainers.length ? (
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="eyebrow">Trainers</p>
              <ul className="mt-3 space-y-3">
                {trainers.map((trainer) => (
                  <li key={trainer.id} className="flex items-center gap-3">
                    {trainer.photo_url ? (
                      <img src={trainer.photo_url} alt={trainer.name} className="size-10 rounded-full object-cover" />
                    ) : null}
                    <div>
                      <p className="text-sm font-medium">{trainer.name}</p>
                      <p className="text-xs text-muted-foreground">{trainer.professional_title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {countries.length ? (
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="eyebrow">Available in</p>
              <p className="mt-2 text-sm">
                {countries.map((c) => `${c.flag_emoji ?? ""} ${c.name}`.trim()).join(" · ")}
              </p>
            </div>
          ) : null}

          <Button asChild size="lg" className="w-full">
            <Link to={(program.cta_link || "/contact") as never}>{program.cta_text || "Enquire about this program"}</Link>
          </Button>
        </aside>
      </section>
    </PublicLayout>
  );
}
