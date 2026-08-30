import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader, PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { useCountries, useInstitutions } from "@/lib/public-cms";

export const Route = createFileRoute("/global-reach")({
  head: () => ({
    meta: [
      { title: "Global Reach — Limra Academy Training Worldwide" },
      {
        name: "description",
        content:
          "Limra Academy has delivered training in India, Malaysia, Indonesia, UAE, Vietnam, Sri Lanka and beyond.",
      },
      { property: "og:title", content: "Global Reach — Limra Academy" },
      { property: "og:description", content: "Countries where Limra Academy has delivered training." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GlobalReachPage,
});

function GlobalReachPage() {
  const { data: countries = [], isLoading } = useCountries();
  const { data: institutions = [] } = useInstitutions();

  return (
    <PublicLayout>
      <SeoHead pageKey="global-reach" />
      <PageHeader
        eyebrow="Global Reach"
        title="Where We Train"
        intro="Countries and regions where Limra Academy has delivered workshops."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading countries…</p>
        ) : countries.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country) => {
              const related = institutions.filter((i) => i.country_name === country.name);
              return (
                <article key={country.id} className="overflow-hidden rounded-lg border border-border bg-card">
                  {country.featured_image_url ? (
                    <img
                      src={country.featured_image_url}
                      alt={country.name}
                      loading="lazy"
                      className="aspect-16/9 w-full object-cover"
                    />
                  ) : null}
                  <div className="space-y-2 p-5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{country.flag_emoji ?? "🌍"}</span>
                      <h2 className="font-display text-xl">{country.name}</h2>
                    </div>
                    {country.training_count ? (
                      <p className="text-sm text-accent-foreground/80">{country.training_count} trainings delivered</p>
                    ) : null}
                    {country.description ? (
                      <p className="text-sm text-muted-foreground">{country.description}</p>
                    ) : null}
                    {related.length ? (
                      <p className="text-xs text-muted-foreground">
                        {related.length} institution{related.length > 1 ? "s" : ""} listed
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No countries published yet."
            body="An administrator can add countries in the admin panel under Countries."
          />
        )}
      </section>
    </PublicLayout>
  );
}
