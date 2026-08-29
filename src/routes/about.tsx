import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { useHomepageSections, useTrainingTopics } from "@/lib/public-cms";
import { sanitizeHtml } from "@/lib/sanitize";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Limra Academy for Excellence" },
      {
        name: "description",
        content:
          "Limra Academy for Excellence trains students, teachers and corporate teams with memory, concentration, communication and leadership programs.",
      },
      { property: "og:title", content: "About Limra Academy for Excellence" },
      { property: "og:description", content: "Who we are and how we train across six countries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: sections } = useHomepageSections();
  const about = sections?.map["about"];
  const why = sections?.map["why_limra"];
  const { data: topics = [] } = useTrainingTopics();

  return (
    <PublicLayout>
      <SeoHead pageKey="about" />
      <PageHeader eyebrow="About" title={about?.heading || "About Limra Academy"} intro={about?.subheading} />
      <section className="mx-auto max-w-3xl px-4 py-14">
        {about?.body ? (
          <div className="prose-cms" dangerouslySetInnerHTML={{ __html: sanitizeHtml(about.body) }} />
        ) : (
          <p className="text-muted-foreground">
            About content has not been added yet. An administrator can edit it under Homepage → About.
          </p>
        )}
        {why?.body ? (
          <div className="prose-cms mt-10" dangerouslySetInnerHTML={{ __html: sanitizeHtml(why.body) }} />
        ) : null}
        {topics.length ? (
          <div className="mt-12">
            <h2 className="font-display text-2xl">What we train</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {topics.map((topic) => (
                <li key={topic.id} className="rounded-md border border-border bg-card p-4">
                  <p className="font-medium">{topic.name}</p>
                  {topic.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </PublicLayout>
  );
}
