import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout, whatsappHref } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { BigStat, Eyebrow, Rise, Shell } from "@/components/site/premium";
import { CTASection, PrimaryButton, SecondaryButton, TrainerCard } from "@/components/site/ui-kit";
import {
  useCountries,
  useHomepageSections,
  useImpactStats,
  useSiteSettings,
  useTrainers,
  useTrainingTopics,
} from "@/lib/public-cms";
import { sanitizeHtml } from "@/lib/sanitize";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Limra Academy for Excellence" },
      {
        name: "description",
        content:
          "Limra Academy for Excellence trains students, teachers and corporate teams with memory, concentration, communication and leadership programs across six countries.",
      },
      { property: "og:title", content: "About Limra Academy for Excellence" },
      { property: "og:description", content: "Who we are and how we train across six countries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const APPROACH = [
  { title: "Psychology-Based", body: "Techniques grounded in psychology and human development." },
  { title: "Technique-Oriented", body: "Clear techniques participants can use immediately." },
  { title: "Activity-Oriented", body: "Guided activities instead of one-way lectures." },
  { title: "Practical", body: "Practised in the room, applied the very next day." },
] as const;

function AboutPage() {
  const { data: sections } = useHomepageSections();
  const map = sections?.map ?? {};
  const about = map["about"];
  const why = map["why_limra"];
  const approach = map["approach"];
  const { data: topics = [] } = useTrainingTopics();
  const { data: stats = [] } = useImpactStats();
  const { data: countries = [] } = useCountries();
  const { data: trainers = [] } = useTrainers();
  const { data: settings = {} } = useSiteSettings();
  const wa = whatsappHref(settings.contact?.whatsapp);

  const topicGroups = Array.from(new Set(topics.map((t) => t.category).filter(Boolean) as string[])).slice(0, 8);

  return (
    <PublicLayout overlay>
      <SeoHead pageKey="about" />

      {/* ---------------- Compact editorial hero ---------------- */}
      <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
        {about?.image_url ? (
          <img
            src={about.image_url}
            alt="Limra Academy training session"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
        ) : (
          <div aria-hidden className="royal-gradient absolute inset-0 -z-20" />
        )}
        <div aria-hidden className="side-veil absolute inset-0 -z-10" />
        <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-14 sm:px-8 sm:pt-36 sm:pb-20">
          <Rise className="max-w-3xl">
            <Eyebrow invert>About</Eyebrow>
            <h1 className="display-lg mt-4 text-dark-foreground">{about?.heading || "About Limra Academy"}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-dark-foreground/75 sm:text-lg">
              {about?.subheading ||
                settings.branding?.tagline ||
                "A training organisation built on practical technique, not theory."}
            </p>
          </Rise>
        </div>
      </section>

      {/* ---------------- Who we are ---------------- */}
      <Shell tone="white">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] lg:gap-16">
          <Rise>
            <Eyebrow>Who we are</Eyebrow>
          </Rise>
          <Rise delay={80} className="min-w-0">
            {about?.body ? (
              <div className="prose-cms max-w-3xl" dangerouslySetInnerHTML={{ __html: sanitizeHtml(about.body) }} />
            ) : (
              <p className="max-w-3xl text-lg leading-relaxed">
                Limra Academy for Excellence designs and delivers training workshops for schools, universities,
                colleges and organisations. Every workshop is built around techniques participants practise inside
                the room and apply immediately in their studies or their work.
              </p>
            )}
            {why?.body ? (
              <div className="prose-cms mt-8 max-w-3xl" dangerouslySetInnerHTML={{ __html: sanitizeHtml(why.body) }} />
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <SecondaryButton to="/programs" size="default">
                Explore programs
              </SecondaryButton>
              <SecondaryButton to="/training-areas" size="default">
                Training areas
              </SecondaryButton>
            </div>
          </Rise>
        </div>
      </Shell>

      {/* ---------------- Our approach ---------------- */}
      <Shell tone="lavender">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Rise className="min-w-0">
            <Eyebrow>Our approach</Eyebrow>
            <h2 className="display-md text-balance-tight mt-4">{approach?.heading || "Our Approach"}</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              {approach?.subheading ||
                "It is not a lecture. It is a technique-oriented, psychology-based and activity-oriented workshop."}
            </p>
            <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {APPROACH.map((a) => (
                <div key={a.title} className="border-t border-border pt-4">
                  <dt className="font-display text-base font-bold">{a.title}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.body}</dd>
                </div>
              ))}
            </dl>
          </Rise>
          {approach?.image_url ? (
            <Rise delay={90} className="min-w-0">
              <figure className="overflow-hidden rounded-3xl">
                <img
                  src={approach.image_url}
                  alt="Limra Academy workshop activity"
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover"
                />
              </figure>
            </Rise>
          ) : null}
        </div>
      </Shell>

      {/* ---------------- Our experience ---------------- */}
      <Shell tone="white">
        <Rise>
          <Eyebrow>Our experience</Eyebrow>
          <h2 className="display-md text-balance-tight mt-4 max-w-2xl">
            Training delivered across six countries.
          </h2>
        </Rise>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s, i) => (
            <Rise key={s.id} delay={i * 80}>
              <BigStat value={s.value} label={s.label} description={s.description} />
            </Rise>
          ))}
        </div>
        {topicGroups.length ? (
          <div className="mt-12 border-t border-border pt-8">
            <p className="eyebrow">Areas we train in</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {topicGroups.map((g) => (
                <li
                  key={g}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold"
                >
                  {g}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Shell>

      {/* ---------------- Global reach ---------------- */}
      {countries.length ? (
        <Shell tone="dark">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <Rise>
              <Eyebrow invert>Global reach</Eyebrow>
              <h2 className="display-md text-balance-tight mt-4 text-dark-foreground">
                Where Limra has trained.
              </h2>
            </Rise>
            <Rise delay={80}>
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {countries.map((c) => (
                  <li key={c.id} className="border-t border-dark-foreground/15 pt-3">
                    <p className="font-display text-base font-bold text-dark-foreground">{c.name}</p>
                    {c.training_count ? (
                      <p className="mt-0.5 text-xs text-dark-foreground/55">{c.training_count} trainings</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </Shell>
      ) : null}

      {/* ---------------- Our trainers ---------------- */}
      {trainers.length ? (
        <Shell tone="white">
          <div className="grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
            <Rise className="min-w-0">
              <Eyebrow>Our trainers</Eyebrow>
              <h2 className="display-md text-balance-tight mt-4">The people in the room.</h2>
            </Rise>
            <PrimaryButton to="/trainers">Meet the team</PrimaryButton>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trainers.slice(0, 4).map((t) => (
              <Rise key={t.id}>
                <TrainerCard name={t.name} title={t.professional_title} photo={t.photo_url} />
              </Rise>
            ))}
          </div>
        </Shell>
      ) : null}

      <CTASection
        title="Bring Limra Academy to your institution"
        body="Tell us your audience and objective — we will design the workshop around it."
        whatsappHref={wa}
      />
    </PublicLayout>
  );
}
