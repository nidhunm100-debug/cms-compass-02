import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PublicLayout, whatsappHref } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { Eyebrow, Rise, Shell } from "@/components/site/premium";
import { CTASection, PrimaryButton, SecondaryButton } from "@/components/site/ui-kit";
import { useHomepageSections, usePrograms, useSiteSettings, useTrainingTopics } from "@/lib/public-cms";
import { cn } from "@/lib/utils";

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
    slug: "schools-students",
    target: "School Students – Classes VII to XII",
    intro:
      "Our flagship Train the Brain workshop gives students practical techniques for concentration, memory, study planning and confidence.",
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
    sectionKey: "who_we_serve",
  },
  {
    index: "02",
    title: "Teachers & Educators",
    slug: "teachers-educators",
    target: "Teachers & Educators",
    intro:
      "A full-day workshop on effective teaching skills — classroom communication, student psychology, engagement and creative teaching techniques.",
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
    sectionKey: "teacher_training",
  },
  {
    index: "03",
    title: "Corporates & Professionals",
    slug: "corporates-professionals",
    target: "Employees, Managers & Professionals",
    intro:
      "Customised professional development for organisations — communication, leadership, teamwork, thinking skills and personal effectiveness.",
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
    topicCategories: [
      "Corporate & Professional Development",
      "Communication & Leadership",
      "Other Professional Training",
    ],
    sectionKey: "corporate_training",
  },
] as const;

function WhoWeServePage() {
  const { data: programs = [] } = usePrograms();
  const { data: topics = [] } = useTrainingTopics();
  const { data: sections } = useHomepageSections();
  const { data: settings = {} } = useSiteSettings();
  const wa = whatsappHref(settings.contact?.whatsapp);
  const map = sections?.map ?? {};
  const intro = map["who_we_serve"];

  return (
    <PublicLayout overlay>
      <SeoHead pageKey="who-we-serve" />

      {/* ---------------- Compact hero ---------------- */}
      <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
        {intro?.image_url ? (
          <img
            src={intro.image_url}
            alt="Limra Academy participants"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
        ) : (
          <div aria-hidden className="royal-gradient absolute inset-0 -z-20" />
        )}
        <div aria-hidden className="side-veil absolute inset-0 -z-10" />
        <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-14 sm:px-8 sm:pt-36 sm:pb-20">
          <Rise className="max-w-3xl">
            <Eyebrow invert>Who we serve</Eyebrow>
            <h1 className="display-lg mt-4 text-dark-foreground">
              {intro?.heading || "Three audiences. One practical method."}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-dark-foreground/75 sm:text-lg">
              {intro?.subheading ||
                "Every Limra workshop is designed for a specific room — students, educators or professional teams."}
            </p>
          </Rise>
        </div>
      </section>

      {AUDIENCES.map((audience, i) => {
        const audiencePrograms = programs.filter((p) => p.category === audience.programCategory);
        const audienceTopics = topics.filter((t) => audience.topicCategories.includes((t.category ?? "") as never));
        const image = map[audience.sectionKey]?.image_url;
        const reverse = i % 2 === 1;

        return (
          <Shell key={audience.index} tone={i % 2 === 0 ? "white" : "lavender"} id={audience.slug}>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
              {image ? (
                <Rise className={cn("min-w-0", reverse && "lg:order-2")}>
                  <figure className="overflow-hidden rounded-3xl">
                    <img
                      src={image}
                      alt={audience.title}
                      loading="lazy"
                      className="aspect-4/3 w-full object-cover lg:aspect-3/4 lg:max-h-[32rem]"
                    />
                  </figure>
                </Rise>
              ) : null}

              <Rise delay={80} className={cn("min-w-0", reverse && "lg:order-1")}>
                <p className="eyebrow">Audience {audience.index}</p>
                <h2 className="display-md text-balance-tight mt-3">{audience.title}</h2>
                <p className="mt-3 text-sm font-semibold text-violet">{audience.target}</p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{audience.intro}</p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {audience.focus.map((f) => (
                    <li key={f} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
                      {f}
                    </li>
                  ))}
                </ul>

                {audiencePrograms.length ? (
                  <ul className="mt-7 divide-y divide-border border-y border-border">
                    {audiencePrograms.map((p) => (
                      <li key={p.id} className="py-4">
                        <a
                          href={`/programs/${p.slug || p.id}`}
                          className="group flex items-baseline justify-between gap-4"
                        >
                          <span className="min-w-0">
                            <span className="font-display block text-base font-bold">{p.name}</span>
                            {p.short_description ? (
                              <span className="mt-1 block text-sm text-muted-foreground">{p.short_description}</span>
                            ) : null}
                          </span>
                          <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 text-sm text-muted-foreground">No programs currently listed for this audience.</p>
                )}

                {audienceTopics.length ? (
                  <div className="mt-7">
                    <p className="eyebrow">Training areas covered</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {audienceTopics.slice(0, 14).map((t) => (
                        <li
                          key={t.id}
                          className="rounded-full bg-lavender px-3 py-1 text-xs font-medium text-lavender-foreground"
                        >
                          {t.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-3">
                  <PrimaryButton to="/contact">Enquire for this audience</PrimaryButton>
                  <SecondaryButton to="/programs" size="default">
                    All programs
                  </SecondaryButton>
                </div>
              </Rise>
            </div>
          </Shell>
        );
      })}

      <CTASection
        title="Bring the right workshop to your team"
        body="Share your audience and objective and we will design the session around it."
        whatsappHref={wa}
      />
    </PublicLayout>
  );
}
