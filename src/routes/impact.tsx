import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout, whatsappHref } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { BigStat, Eyebrow, GalleryMasonry, Rise, Shell } from "@/components/site/premium";
import { CTASection, InstitutionCard, SecondaryButton } from "@/components/site/ui-kit";
import {
  useCountries,
  useGalleryImages,
  useHomepageSections,
  useImpactStats,
  useInstitutions,
  useSiteSettings,
} from "@/lib/public-cms";

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
  const { data: gallery = [] } = useGalleryImages({ limit: 6 });
  const { data: sections } = useHomepageSections();
  const { data: settings = {} } = useSiteSettings();
  const wa = whatsappHref(settings.contact?.whatsapp);
  const map = sections?.map ?? {};
  const approach = map["approach"];

  return (
    <PublicLayout overlay>
      <SeoHead pageKey="impact" />

      {/* ---------------- Hero with impact numbers ---------------- */}
      <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
        {map["impact"]?.image_url ? (
          <img
            src={map["impact"].image_url}
            alt="Limra Academy workshop audience"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
        ) : (
          <div aria-hidden className="royal-gradient absolute inset-0 -z-20" />
        )}
        <div aria-hidden className="side-veil absolute inset-0 -z-10" />
        <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-14 sm:px-8 sm:pt-36 sm:pb-16">
          <Rise className="max-w-3xl">
            <Eyebrow invert>Our impact</Eyebrow>
            <h1 className="display-lg mt-4 text-dark-foreground">Experience measured in people trained.</h1>
          </Rise>
          {stats.length ? (
            <dl className="mt-12 grid gap-x-10 gap-y-8 border-t border-dark-foreground/15 pt-10 sm:grid-cols-3">
              {stats.map((s, i) => (
                <Rise key={s.id} delay={i * 80}>
                  <BigStat invert value={s.value} label={s.label} description={s.description} />
                </Rise>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      {/* ---------------- Approach ---------------- */}
      <Shell tone="white">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] lg:gap-16">
          <Rise>
            <Eyebrow>Our approach</Eyebrow>
            <h2 className="display-md text-balance-tight mt-4">{approach?.heading || "Why it works"}</h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              {approach?.subheading ||
                "It is not a lecture but a technique-oriented, psychology-based and activity-oriented workshop."}
            </p>
          </Rise>
          <Rise delay={80}>
            <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="border-t border-border pt-4">
                  <dt className="font-display text-base font-bold">{p.title}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</dd>
                </div>
              ))}
            </dl>
          </Rise>
        </div>
      </Shell>

      {/* ---------------- Training reach ---------------- */}
      {countries.length ? (
        <Shell tone="lavender">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <Rise>
              <Eyebrow>Training reach</Eyebrow>
              <h2 className="display-md text-balance-tight mt-4">
                {countries.length} countries with training experience.
              </h2>
            </Rise>
            <Rise delay={80}>
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {countries.map((c) => (
                  <li key={c.id} className="border-t border-border pt-3">
                    <p className="font-display text-base font-bold">{c.name}</p>
                    {c.training_count ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{c.training_count} trainings</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
        </Shell>
      ) : null}

      {/* ---------------- Selected institutions ---------------- */}
      {institutions.length ? (
        <Shell tone="white">
          <div className="grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
            <Rise className="min-w-0">
              <Eyebrow>Selected institutions</Eyebrow>
              <h2 className="display-md text-balance-tight mt-4">Where we have trained.</h2>
            </Rise>
            <SecondaryButton to="/institutions" size="default">
              All institutions
            </SecondaryButton>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {institutions.slice(0, 12).map((inst) => (
              <InstitutionCard
                key={inst.id}
                name={inst.name}
                logo={inst.logo_url}
                meta={[inst.city, inst.country_name].filter(Boolean).join(", ") || inst.institution_type}
              />
            ))}
          </div>
        </Shell>
      ) : null}

      {/* ---------------- Photographs ---------------- */}
      {gallery.length ? (
        <Shell tone="lavender">
          <Rise>
            <Eyebrow>From the room</Eyebrow>
            <h2 className="display-md text-balance-tight mt-4 max-w-2xl">Training photographs.</h2>
          </Rise>
          <div className="mt-8">
            <GalleryMasonry images={gallery} />
          </div>
          <div className="mt-8">
            <SecondaryButton to="/gallery" size="default">
              View gallery
            </SecondaryButton>
          </div>
        </Shell>
      ) : null}

      <CTASection
        title="Add your institution to this list"
        body="Talk to us about a workshop for your students, teachers or team."
        whatsappHref={wa}
      />
    </PublicLayout>
  );
}
