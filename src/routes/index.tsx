import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Quote } from "lucide-react";

import { PublicLayout, whatsappHref } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import {
  AudienceCard,
  CTASection,
  GalleryGrid,
  InstitutionCard,
  PrimaryButton,
  ProgramCard,
  Reveal,
  Section,
  SectionHeading,
  SecondaryButton,
  StatBlock,
  TrainerCard,
} from "@/components/site/ui-kit";
import {
  useCountries,
  useGalleryImages,
  useHomepageSections,
  useInstitutions,
  usePrograms,
  useSiteSettings,
  useTestimonials,
  useTrainingTopics,
  useTrainers,
} from "@/lib/public-cms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Limra Academy for Excellence — Train the Brain, Transform Potential" },
      {
        name: "description",
        content:
          "International training organisation delivering Train the Brain, teacher training and corporate development workshops for students, educators and professionals.",
      },
      { property: "og:title", content: "Limra Academy for Excellence" },
      {
        property: "og:description",
        content: "Practical, psychology-based training for students, teachers, employees and managers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const AUDIENCES = [
  {
    index: "01",
    title: "Schools & Students",
    description:
      "Train the Brain equips students of classes VII–XII with the concentration, memory and study techniques they need to perform with confidence.",
    tags: ["Train the Brain", "Concentration", "Memory", "Study Techniques", "Career Guidance"],
    ctaLabel: "Explore student training",
    ctaTo: "/programs",
  },
  {
    index: "02",
    title: "Teachers & Educators",
    description:
      "Effective Teaching Skills helps educators strengthen classroom delivery, communication and student psychology across a focused two-day workshop.",
    tags: ["Teaching Methods", "Communication", "Classroom Management", "Student Psychology"],
    ctaLabel: "Explore teacher training",
    ctaTo: "/programs",
  },
  {
    index: "03",
    title: "Corporates & Professionals",
    description:
      "Customised professional development for employees and managers — built around your team's communication, leadership and thinking needs.",
    tags: ["Leadership", "Communication", "Teamwork", "Lateral Thinking"],
    ctaLabel: "Explore corporate training",
    ctaTo: "/programs",
  },
] as const;

const APPROACH = [
  { step: "01", title: "Understand", body: "Techniques explained in plain, practical language." },
  { step: "02", title: "Experience", body: "Guided activities that make each technique real." },
  { step: "03", title: "Practice", body: "Repetition in the room until it feels natural." },
  { step: "04", title: "Apply", body: "A plan participants use the very next day." },
] as const;

const TTB_TOPICS = [
  "Concentration Techniques",
  "Super Memory Techniques",
  "Brain Activation",
  "Study Techniques",
  "Career Guidance",
  "Self Confidence",
];

function HomePage() {
  const { data: sections } = useHomepageSections();
  const map = sections?.map ?? {};
  const { data: settings = {} } = useSiteSettings();
  const wa = whatsappHref(settings.contact?.whatsapp);

  const { data: featuredPrograms = [] } = usePrograms({ featured: true });
  const { data: allPrograms = [] } = usePrograms();
  const { data: featuredTrainers = [] } = useTrainers({ featured: true });
  const { data: allTrainers = [] } = useTrainers();
  const { data: featuredInstitutions = [] } = useInstitutions({ featured: true });
  const { data: allInstitutions = [] } = useInstitutions();
  const { data: countries = [] } = useCountries();
  const { data: gallery = [] } = useGalleryImages({ limit: 6 });
  const { data: testimonials = [] } = useTestimonials();
  const { data: topics = [] } = useTrainingTopics();

  const hero = map["hero"];
  const impact = map["impact"];
  const stats = ((impact?.extra as { stats?: { value: string; label: string }[] } | undefined)?.stats ?? []).filter(
    (s) => s.value || s.label,
  );

  const programList = (featuredPrograms.length ? featuredPrograms : allPrograms).slice(0, 3);
  const [leadProgram, ...restPrograms] = programList;
  const trainerList = featuredTrainers.length ? featuredTrainers : allTrainers;
  const [leadTrainer, ...restTrainers] = trainerList;
  const institutionList = (featuredInstitutions.length ? featuredInstitutions : allInstitutions).slice(0, 8);
  const remainingInstitutions = Math.max(allInstitutions.length - institutionList.length, 0);

  const studentTopics = topics.filter((t) => (t.category ?? "").toLowerCase().includes("student"));
  const audienceImages = [
    map["programs"]?.image_url,
    map["why_limra"]?.image_url,
    map["institutions"]?.image_url,
  ];

  return (
    <PublicLayout>
      <SeoHead pageKey="home" />

      {/* ---------------- Hero ---------------- */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-12 pb-16 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:pt-24 lg:pb-24">
          <Reveal className="min-w-0">
            <p className="eyebrow">Limra Academy for Excellence</p>
            <h1 className="text-balance-tight mt-4 text-4xl leading-[1.06] sm:text-5xl lg:text-[3.9rem]">
              <Headline text={hero?.heading || "Train the Brain. Transform Potential."} />
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero?.subheading ||
                "Practical, psychology-based and activity-oriented training for students, teachers, employees and managers."}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <PrimaryButton to={hero?.cta_link || "/contact"}>{hero?.cta_text || "Book a workshop"}</PrimaryButton>
              <SecondaryButton to={hero?.secondary_cta_link || "/programs"}>
                {hero?.secondary_cta_text || "Explore programs"}
              </SecondaryButton>
            </div>
          </Reveal>

          <Reveal className="relative min-w-0" delay={120}>
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-lavender blur-2xl"
            />
            {hero?.image_url ? (
              <img
                src={hero.image_url}
                alt="Limra Academy workshop in progress"
                width={1200}
                height={1000}
                className="aspect-4/3 w-full rounded-3xl object-cover shadow-elegant"
              />
            ) : (
              <div className="aspect-4/3 w-full rounded-3xl bg-lavender" />
            )}
          </Reveal>
        </div>

        {/* Credibility strip */}
        {stats.length ? (
          <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-6 sm:pb-20">
            <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-surface px-6 py-8 sm:grid-cols-4 sm:px-10">
              {stats.slice(0, 4).map((stat) => (
                <StatBlock key={stat.label + stat.value} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {/* ---------------- Who We Help ---------------- */}
      <Section tone="lavender" id="who-we-serve">
        <SectionHeading
          eyebrow="Who we help"
          title="Three audiences. One practical method."
          intro="Every Limra workshop is designed for a specific room — students, educators or professional teams."
        />
        <div className="mt-12 space-y-6">
          {AUDIENCES.map((a, i) => (
            <AudienceCard
              key={a.index}
              index={a.index}
              title={a.title}
              description={a.description}
              tags={[...a.tags]}
              image={audienceImages[i] ?? gallery[i]?.image_url}
              ctaLabel={a.ctaLabel}
              ctaTo={a.ctaTo}
              reverse={i % 2 === 1}
            />
          ))}
        </div>
      </Section>

      {/* ---------------- Programs ---------------- */}
      {programList.length ? (
        <Section tone="white">
          <SectionHeading
            eyebrow="Programs"
            title="Programs that create practical change"
            action={
              <SecondaryButton to="/programs" size="default">
                All programs <ArrowRight className="ml-1.5 size-4" />
              </SecondaryButton>
            }
          />
          <div className="mt-12 space-y-6">
            {leadProgram ? (
              <ProgramCard
                featured
                name={leadProgram.name}
                audience={leadProgram.target_audience}
                duration={leadProgram.duration}
                format={leadProgram.workshop_format}
                description={leadProgram.short_description}
                image={leadProgram.image_url}
                to={`/programs/${leadProgram.slug || leadProgram.id}`}
              />
            ) : null}
            {restPrograms.length ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {restPrograms.map((p) => (
                  <ProgramCard
                    key={p.id}
                    name={p.name}
                    audience={p.target_audience}
                    duration={p.duration}
                    format={p.workshop_format}
                    description={p.short_description}
                    image={p.image_url}
                    to={`/programs/${p.slug || p.id}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* ---------------- Train the Brain feature ---------------- */}
      <Section tone="lavender">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16">
          <Reveal className="min-w-0">
            <p className="eyebrow">Flagship workshop</p>
            <h2 className="text-balance-tight mt-3 text-3xl sm:text-4xl lg:text-5xl">Train the Brain</h2>
            <p className="mt-4 text-lg font-medium text-violet">
              Better Focus. Stronger Memory. Greater Confidence.
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Not a lecture — a practical, activity-oriented training experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-background px-4 py-2 text-sm font-semibold text-primary">5 hours</span>
              <span className="rounded-full bg-background px-4 py-2 text-sm font-semibold text-primary">
                One full-day workshop
              </span>
            </div>
            <div className="mt-9">
              <PrimaryButton to="/contact">Bring this workshop to your school</PrimaryButton>
            </div>
          </Reveal>
          <Reveal className="min-w-0" delay={100}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {(studentTopics.length ? studentTopics.map((t) => t.name) : TTB_TOPICS).slice(0, 6).map((name) => (
                <li key={name} className="rounded-2xl border border-border bg-card px-4 py-4 text-sm font-medium">
                  {name}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* ---------------- Impact ---------------- */}
      <Section tone="purple">
        <SectionHeading
          invert
          eyebrow="Our impact"
          title={impact?.heading || "Experience measured in impact"}
        />
        {stats.length ? (
          <dl className="mt-12 grid gap-10 sm:grid-cols-3">
            {stats.slice(0, 3).map((stat) => (
              <StatBlock key={stat.label + stat.value} value={stat.value} label={stat.label} invert />
            ))}
          </dl>
        ) : null}
        {countries.length ? (
          <div className="mt-14 border-t border-deep-purple-foreground/15 pt-8">
            <p className="eyebrow text-deep-purple-foreground/60">Training experience across</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {countries.map((c) => (
                <li key={c.id} className="text-base font-semibold text-deep-purple-foreground/90">
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      {/* ---------------- Global reach ---------------- */}
      {countries.length ? (
        <Section tone="white">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="min-w-0">
              <SectionHeading
                eyebrow="Global reach"
                title="Training beyond borders"
                intro="International training experience delivered on campus and in-house — with the same practical method adapted to each culture and classroom."
              />
              <div className="mt-8">
                <SecondaryButton to="/global-reach" size="default">
                  See our global reach <ArrowRight className="ml-1.5 size-4" />
                </SecondaryButton>
              </div>
            </Reveal>
            <Reveal className="min-w-0" delay={100}>
              <ul className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-surface p-6 sm:grid-cols-3">
                {countries.map((c) => (
                  <li key={c.id} className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="size-4 shrink-0 text-primary" />
                    <span className="truncate">{c.name}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Section>
      ) : null}

      {/* ---------------- Approach ---------------- */}
      <Section tone="lavender">
        <SectionHeading
          eyebrow="Our approach"
          title="More than a lecture"
          intro="Limra workshops are designed around practical techniques, participation and immediate application."
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {APPROACH.map((s, i) => (
            <Reveal as="li" key={s.step} delay={i * 70} className="rounded-2xl border border-border bg-card p-6">
              <p className="font-display text-sm font-extrabold text-primary/50">{s.step}</p>
              <p className="font-display mt-2 text-lg font-bold">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ---------------- Trainers ---------------- */}
      {trainerList.length ? (
        <Section tone="white">
          <SectionHeading
            eyebrow="Our team"
            title="Meet the people behind the training"
            action={
              <SecondaryButton to="/trainers" size="default">
                All trainers <ArrowRight className="ml-1.5 size-4" />
              </SecondaryButton>
            }
          />
          {leadTrainer ? (
            <Reveal className="mt-12 grid items-center gap-8 rounded-3xl border border-border bg-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-12 lg:p-10">
              <div className="min-w-0">
                {leadTrainer.photo_url ? (
                  <img
                    src={leadTrainer.photo_url}
                    alt={leadTrainer.name}
                    loading="lazy"
                    className="aspect-4/5 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="aspect-4/5 w-full rounded-2xl bg-lavender" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl sm:text-3xl">{leadTrainer.name}</h3>
                {leadTrainer.position || leadTrainer.professional_title ? (
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {leadTrainer.position || leadTrainer.professional_title}
                  </p>
                ) : null}
                {leadTrainer.qualification ? (
                  <p className="mt-1 text-sm text-muted-foreground">{leadTrainer.qualification}</p>
                ) : null}
                {leadTrainer.short_bio ? (
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">{leadTrainer.short_bio}</p>
                ) : null}
                {leadTrainer.training_areas?.length ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {leadTrainer.training_areas.slice(0, 6).map((area) => (
                      <li
                        key={area}
                        className="rounded-full bg-lavender px-3 py-1 text-xs font-medium text-lavender-foreground"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Reveal>
          ) : null}
          {restTrainers.length ? (
            <div className="mt-6 -mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
              {restTrainers.slice(0, 5).map((t) => (
                <div key={t.id} className="snap-start">
                  <TrainerCard compact name={t.name} title={t.position || t.professional_title} photo={t.photo_url} />
                </div>
              ))}
            </div>
          ) : null}
        </Section>
      ) : null}

      {/* ---------------- Institutions ---------------- */}
      {institutionList.length ? (
        <Section tone="lavender">
          <SectionHeading
            eyebrow="Trusted by"
            title="Selected institutions where Limra has conducted training"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {institutionList.map((i) => (
              <InstitutionCard
                key={i.id}
                name={i.name}
                logo={i.logo_url}
                meta={[i.city, i.country_name].filter(Boolean).join(", ") || i.institution_type}
              />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {remainingInstitutions ? (
              <p className="text-sm text-muted-foreground">+ {remainingInstitutions} more institutions</p>
            ) : null}
            <SecondaryButton to="/institutions" size="default">
              View all institutions
            </SecondaryButton>
          </div>
        </Section>
      ) : null}

      {/* ---------------- Gallery ---------------- */}
      {gallery.length ? (
        <Section tone="white">
          <SectionHeading
            eyebrow="Gallery"
            title="Inside a Limra workshop"
            action={
              <SecondaryButton to="/gallery" size="default">
                Full gallery <ArrowRight className="ml-1.5 size-4" />
              </SecondaryButton>
            }
          />
          <div className="mt-12">
            <GalleryGrid images={gallery} />
          </div>
        </Section>
      ) : null}

      {/* ---------------- Testimonials ---------------- */}
      {testimonials.length ? (
        <Section tone="lavender">
          <SectionHeading eyebrow="Feedback" title="What participants say" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal as="article" key={t.id} delay={i * 70} className="rounded-2xl border border-border bg-card p-6">
                <Quote className="size-5 text-primary/40" />
                <p className="mt-4 text-sm leading-relaxed">{t.quote}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[t.designation, t.organization, t.country].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ---------------- Final CTA ---------------- */}
      <CTASection
        title={map["final_cta"]?.heading || "Bring Limra Academy to your institution"}
        body={
          map["final_cta"]?.subheading ||
          "Whether you are looking for student development, teacher training or corporate learning, let's create a workshop around your needs."
        }
        whatsappHref={wa}
      />

      <div className="sr-only">
        <Link to="/workshops">Upcoming workshops</Link>
      </div>
    </PublicLayout>
  );
}
