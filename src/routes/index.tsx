import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Quote, Star } from "lucide-react";

import { PublicLayout, EmptyState } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import {
  useCountries,
  useGalleryImages,
  useHomepageSections,
  useInstitutions,
  usePrograms,
  useTestimonials,
  useTrainingTopics,
  useTrainers,
  type HomepageSection,
} from "@/lib/public-cms";
import { sanitizeHtml } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Limra Academy for Excellence — Training Students, Teachers & Corporates" },
      {
        name: "description",
        content:
          "Limra Academy delivers Train the Brain, teacher training and corporate skill workshops across India, Malaysia, Indonesia, UAE, Vietnam and Sri Lanka.",
      },
      { property: "og:title", content: "Limra Academy for Excellence" },
      {
        property: "og:description",
        content: "International training for students, teachers and corporate teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function SectionShell({
  section,
  children,
  tone = "default",
}: {
  section: HomepageSection | undefined;
  children?: React.ReactNode;
  tone?: "default" | "surface" | "ink";
}) {
  if (!section?.enabled) return null;
  const toneClass =
    tone === "ink" ? "bg-ink text-ink-foreground" : tone === "surface" ? "bg-surface" : "bg-background";
  return (
    <section className={`border-b border-border/60 ${toneClass}`}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {section.label ? <p className="eyebrow">{section.label}</p> : null}
        {section.heading ? (
          <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">{section.heading}</h2>
        ) : null}
        <span className="gold-rule mt-4" />
        {section.subheading ? (
          <p className="mt-4 max-w-2xl text-base opacity-80">{section.subheading}</p>
        ) : null}
        {section.body ? (
          <div
            className="prose-cms mt-5 max-w-3xl"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.body) }}
          />
        ) : null}
        {section.image_url ? (
          <figure className="mt-8 overflow-hidden rounded-lg border border-border/60">
            <img
              src={section.image_url}
              alt={section.heading ?? section.label ?? ""}
              loading="lazy"
              width={1600}
              height={1000}
              className="aspect-16/9 w-full object-cover"
            />
          </figure>
        ) : null}
        {children}

        {section.cta_text && section.cta_link ? (
          <Button asChild variant="outline" className="mt-8">
            <Link to={section.cta_link as never}>
              {section.cta_text} <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function HomePage() {
  const { data: sections } = useHomepageSections();
  const map = sections?.map ?? {};
  const { data: programs = [] } = usePrograms({ featured: true });
  const { data: allPrograms = [] } = usePrograms();
  const { data: trainers = [] } = useTrainers({ featured: true });
  const { data: allTrainers = [] } = useTrainers();
  const { data: institutions = [] } = useInstitutions({ featured: true });
  const { data: allInstitutions = [] } = useInstitutions();
  const { data: countries = [] } = useCountries();
  const { data: gallery = [] } = useGalleryImages({ limit: 8 });
  const { data: testimonials = [] } = useTestimonials();
  const { data: topics = [] } = useTrainingTopics();

  const hero = map["hero"];
  const impact = map["impact"];
  const stats = ((impact?.extra as { stats?: { value: string; label: string }[] } | undefined)?.stats ?? []).filter(
    (s) => s.value || s.label,
  );

  const programList = programs.length ? programs : allPrograms;
  const trainerList = trainers.length ? trainers : allTrainers;
  const institutionList = institutions.length ? institutions : allInstitutions;

  return (
    <PublicLayout>
      <SeoHead pageKey="home" />

      {hero?.enabled ? (
        <section className="relative isolate overflow-hidden">
          {hero.image_url ? (
            <img src={hero.image_url} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-primary" />
          )}
          <div className="hero-overlay absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-4 py-28 sm:py-36">
            <p className="eyebrow text-ink-foreground/70">Limra Academy for Excellence</p>
            <h1 className="font-display text-balance-tight mt-4 max-w-3xl text-4xl font-semibold text-ink-foreground sm:text-6xl">
              {hero.heading || "Training minds across borders"}
            </h1>
            <span className="gold-rule mt-6" />
            {hero.subheading ? (
              <p className="mt-6 max-w-2xl text-lg text-ink-foreground/80">{hero.subheading}</p>
            ) : null}
            <div className="mt-9 flex flex-wrap gap-3">
              {hero.cta_text && hero.cta_link ? (
                <Button asChild size="lg">
                  <Link to={hero.cta_link as never}>{hero.cta_text}</Link>
                </Button>
              ) : null}
              {hero.secondary_cta_text && hero.secondary_cta_link ? (
                <Button asChild size="lg" variant="secondary">
                  <Link to={hero.secondary_cta_link as never}>{hero.secondary_cta_text}</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <SectionShell section={map["about"]} tone="surface" />

      {impact?.enabled ? (
        <section className="relative isolate border-b border-border/60 bg-ink text-ink-foreground">
          {impact.image_url ? (
            <>
              <img
                src={impact.image_url}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-25"
              />
              <div className="hero-overlay absolute inset-0" />
            </>
          ) : null}
          <div className="relative mx-auto max-w-6xl px-4 py-16">

            <p className="eyebrow text-ink-foreground/60">{impact.label}</p>
            <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">{impact.heading}</h2>
            {stats.length ? (
              <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={`${stat.label}-${stat.value}`}>
                    <dt className="font-display text-4xl text-accent">{stat.value}</dt>
                    <dd className="mt-1 text-sm text-ink-foreground/70">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-6 text-sm text-ink-foreground/60">
                Add impact statistics in the admin panel under Homepage → Impact Statistics.
              </p>
            )}
          </div>
        </section>
      ) : null}

      <SectionShell section={map["programs"]}>
        {programList.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programList.map((program) => (
              <article key={program.id} className="group overflow-hidden rounded-lg border border-border bg-card">
                {program.image_url ? (
                  <img
                    src={program.image_url}
                    alt={program.name}
                    loading="lazy"
                    className="aspect-16/10 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="space-y-2 p-5">
                  <h3 className="font-display text-xl">{program.name}</h3>
                  {program.target_audience ? (
                    <Badge variant="secondary">{program.target_audience}</Badge>
                  ) : null}
                  <p className="text-sm text-muted-foreground">{program.short_description}</p>
                  <Link
                    to="/programs/$slug"
                    params={{ slug: program.slug || program.id }}
                    className="inline-flex items-center text-sm font-medium text-primary"
                  >
                    Read more <ArrowRight className="ml-1 size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState title="No programs published yet." body="Add programs in the admin panel to show them here." />
          </div>
        )}
      </SectionShell>

      <SectionShell section={map["why_limra"]} tone="surface">
        {topics.length ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.slice(0, 9).map((topic) => (
              <li key={topic.id} className="rounded-lg border border-border bg-card p-4">
                <p className="font-medium">{topic.name}</p>
                {topic.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </SectionShell>

      <SectionShell section={map["international"]}>
        {countries.length ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {countries.map((country) => (
              <li key={country.id} className="rounded-lg border border-border bg-card p-5">
                <p className="text-2xl">{country.flag_emoji ?? "🌍"}</p>
                <p className="font-display mt-2 text-lg">{country.name}</p>
                {country.training_count ? (
                  <p className="text-sm text-muted-foreground">{country.training_count} trainings</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8">
            <EmptyState title="No countries published yet." body="Add countries in the admin panel under Countries." />
          </div>
        )}
      </SectionShell>

      <SectionShell section={map["trainers"]} tone="surface">
        {trainerList.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainerList.slice(0, 6).map((trainer) => (
              <article key={trainer.id} className="overflow-hidden rounded-lg border border-border bg-card">
                {trainer.photo_url ? (
                  <img
                    src={trainer.photo_url}
                    alt={trainer.name}
                    loading="lazy"
                    className="aspect-4/5 w-full object-cover"
                  />
                ) : null}
                <div className="space-y-1 p-5">
                  <h3 className="font-display text-xl">{trainer.name}</h3>
                  {trainer.professional_title ? (
                    <p className="text-sm text-muted-foreground">{trainer.professional_title}</p>
                  ) : null}
                  {trainer.qualification ? <p className="text-xs text-muted-foreground">{trainer.qualification}</p> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState title="No trainers published yet." body="Add trainers in the admin panel to show them here." />
          </div>
        )}
      </SectionShell>

      <SectionShell section={map["institutions"]}>
        {institutionList.length ? (
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {institutionList.slice(0, 15).map((institution) => (
              <li
                key={institution.id}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center"
              >
                {institution.logo_url ? (
                  <img src={institution.logo_url} alt={institution.name} loading="lazy" className="h-12 w-auto object-contain" />
                ) : null}
                <p className="text-xs font-medium">{institution.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8">
            <EmptyState
              title="No institutions published yet."
              body="Add schools, colleges, universities or corporates in the admin panel."
            />
          </div>
        )}
      </SectionShell>

      <SectionShell section={map["gallery"]} tone="surface">
        {gallery.length ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {gallery.map((image) => (
              <figure key={image.id} className="overflow-hidden rounded-lg border border-border">
                <img
                  src={image.image_url}
                  alt={image.alt_text ?? image.title ?? "Limra workshop"}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState title="No gallery images yet." body="Upload workshop photographs in the admin panel." />
          </div>
        )}
      </SectionShell>

      <SectionShell section={map["testimonials"]}>
        {testimonials.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial.id} className="rounded-lg border border-border bg-card p-6">
                <Quote className="size-5 text-accent" />
                <p className="mt-3 text-sm leading-relaxed">{testimonial.quote}</p>
                <footer className="mt-4">
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[testimonial.designation, testimonial.organization, testimonial.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {testimonial.rating ? (
                    <p className="mt-1 flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-accent text-accent" />
                      ))}
                    </p>
                  ) : null}
                </footer>
              </blockquote>
            ))}
          </div>
        ) : null}
      </SectionShell>

      {map["final_cta"]?.enabled ? (
        <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
          {map["final_cta"].image_url ? (
            <>
              <img
                src={map["final_cta"].image_url}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-30"
              />
              <div className="hero-overlay absolute inset-0" />
            </>
          ) : null}
          <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-display text-3xl">{map["final_cta"].heading}</h2>
              {map["final_cta"].subheading ? (
                <p className="mt-2 max-w-xl text-sm opacity-80">{map["final_cta"].subheading}</p>
              ) : null}
            </div>
            {map["final_cta"].cta_text && map["final_cta"].cta_link ? (
              <Button asChild size="lg" variant="secondary">
                <Link to={map["final_cta"].cta_link as never}>{map["final_cta"].cta_text}</Link>
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}
    </PublicLayout>
  );
}
