import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MessageCircle, Users } from "lucide-react";

import { PublicLayout, whatsappHref } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { PrimaryButton, SecondaryButton } from "@/components/site/ui-kit";
import {
  ApproachTrack,
  AudiencePanel,
  Eyebrow,
  GalleryMasonry,
  GlobalReach,
  ImpactStrip,
  InstitutionWall,
  PresenceRows,
  Rise,
  Shell,
  SkillCloud,
  TestimonialFeature,
  TrainerCarousel,
  type ShowcasePerson,
} from "@/components/site/premium";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCountries,
  useGalleryImages,
  useHomepageSections,
  useImpactStats,
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
    flagship: "Flagship — Train the Brain",
    items: ["Concentration", "Memory techniques", "Study skills", "Confidence", "Career guidance"],
  },
  {
    index: "02",
    title: "Teachers & Educators",
    flagship: "Effective Teaching Skills",
    items: ["Teaching methods", "Communication", "Classroom management", "Student psychology"],
  },
  {
    index: "03",
    title: "Corporates & Professionals",
    flagship: "Customised professional development",
    items: ["Leadership", "Communication", "Teamwork", "Lateral thinking"],
  },
] as const;

const APPROACH = [
  {
    step: "01",
    title: "Understand",
    body: "Every technique is explained in plain, practical language — no jargon, no theory for its own sake.",
  },
  {
    step: "02",
    title: "Experience",
    body: "Guided activities let participants feel the technique working before they are asked to trust it.",
  },
  {
    step: "03",
    title: "Practice",
    body: "Repetition inside the workshop room until the method becomes natural and repeatable.",
  },
  {
    step: "04",
    title: "Apply",
    body: "Participants leave with a personal plan they can use the very next morning.",
  },
];

const TTB_GROUP_ORDER = [
  "Focus & Concentration",
  "Memory & Brain",
  "Study & Academic Skills",
  "Personal Development",
  "Future & Career",
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
  const { data: gallery = [] } = useGalleryImages({ limit: 8 });
  const { data: testimonials = [] } = useTestimonials();
  const { data: topics = [] } = useTrainingTopics();
  const { data: impactStats = [] } = useImpactStats();

  const [person, setPerson] = useState<ShowcasePerson | null>(null);

  const hero = map["hero"];
  const impact = map["impact"];
  const legacyStats = (
    (impact?.extra as { stats?: { value: string; label: string }[] } | undefined)?.stats ?? []
  ).filter((s) => s.value || s.label);
  const stats = impactStats.length
    ? impactStats.map((s) => ({ id: s.id, value: s.value, label: s.label, description: s.description }))
    : legacyStats.map((s) => ({ value: s.value, label: s.label, description: null }));

  const programList = (featuredPrograms.length ? featuredPrograms : allPrograms).slice(0, 3);
  const trainerList = (featuredTrainers.length ? featuredTrainers : allTrainers).map(
    (t): ShowcasePerson => ({
      id: t.id,
      name: t.name,
      role: t.position || t.professional_title,
      qualification: t.qualification,
      bio: t.short_bio || t.full_bio,
      photo: t.photo_url,
      areas: t.training_areas ?? [],
    }),
  );
  const lead = trainerList[0];
  const institutionList = (featuredInstitutions.length ? featuredInstitutions : allInstitutions).slice(0, 14);

  const ttbSkills = useMemo(() => {
    const ordered = TTB_GROUP_ORDER.flatMap((group) => topics.filter((t) => t.topic_group === group));
    const pool = (ordered.length ? ordered : topics).slice(0, 12);
    return pool.map((t) => ({ id: t.id, name: t.name, description: t.description }));
  }, [topics]);

  const institutionsByCountry = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    allInstitutions.forEach((i) => {
      const key = i.country_name;
      if (!key) return;
      const bucket = grouped[key] ?? [];
      bucket.push(i.name);
      grouped[key] = bucket;
    });
    return grouped;
  }, [allInstitutions]);

  const audienceImages = [
    map["programs"]?.image_url ?? gallery[0]?.image_url ?? null,
    map["teacher_training"]?.image_url ?? gallery[1]?.image_url ?? null,
    map["corporate_training"]?.image_url ?? gallery[2]?.image_url ?? null,
  ];

  return (
    <PublicLayout>
      <SeoHead pageKey="home" />

      {/* ---------------- Editorial hero ---------------- */}
      <section className="relative isolate min-h-[92svh] overflow-hidden bg-dark text-dark-foreground">
        {hero?.image_url ? (
          <img
            src={hero.image_url}
            alt="Limra Academy workshop in progress"
            className="absolute inset-0 -z-20 size-full object-cover object-center"
          />
        ) : (
          <div aria-hidden className="royal-gradient absolute inset-0 -z-20" />
        )}
        <div aria-hidden className="side-veil absolute inset-0 -z-10" />
        <div aria-hidden className="grain absolute inset-0 -z-10" />

        <div className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-5 pt-32 pb-16 sm:px-8 sm:pb-20">
          <Rise className="max-w-4xl">
            <Eyebrow invert>{settings.branding?.site_name || "Limra Academy for Excellence"}</Eyebrow>
            <h1 className="display-xl mt-6 text-dark-foreground">
              {hero?.heading || "Train the Brain."}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-dark-foreground/75 sm:text-lg">
              {hero?.subheading ||
                "Practical, psychology-based and activity-oriented training for students, teachers, employees and managers — delivered across six countries."}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <PrimaryButton to={hero?.cta_link || "/contact"}>{hero?.cta_text || "Book a workshop"}</PrimaryButton>
              <Link
                to={(hero?.secondary_cta_link || "/programs") as never}
                className="link-underline text-sm font-semibold text-dark-foreground/85"
              >
                {hero?.secondary_cta_text || "Explore programs"}
              </Link>
            </div>
          </Rise>
        </div>
      </section>

      {/* ---------------- Impact strip ---------------- */}
      <ImpactStrip stats={stats} countries={countries.map((c) => c.name)} />

      {/* ---------------- Editorial statement ---------------- */}
      <Shell tone="white">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-20">
          <Rise>
            <Eyebrow>Who we are</Eyebrow>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {settings.branding?.tagline || "Train the Brain."}
            </p>
          </Rise>
          <Rise delay={90} className="min-w-0">
            <h2 className="display-lg text-balance-tight">
              {map["about"]?.heading || "Training that changes how people think, learn and perform."}
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {map["about"]?.subheading ||
                map["why_limra"]?.subheading ||
                "Limra Academy for Excellence designs and delivers workshops for schools, universities,colleges and organisations. Every session is built around techniques participants can practise in the room and use immediately afterwards."}
            </p>
            <div className="mt-10">
              <SecondaryButton to="/about" size="default">
                About Limra <ArrowRight className="ml-1.5 size-4" />
              </SecondaryButton>
            </div>
          </Rise>
        </div>
      </Shell>

      {/* ---------------- Audience panels ---------------- */}
      <Shell tone="lavender" id="who-we-serve">
        <Rise>
          <Eyebrow>Who we serve</Eyebrow>
          <h2 className="display-lg text-balance-tight mt-6 max-w-3xl">
            Three audiences. One practical method.
          </h2>
        </Rise>
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {AUDIENCES.map((a, i) => (
            <AudiencePanel
              key={a.index}
              index={a.index}
              title={a.title}
              flagship={a.flagship}
              items={[...a.items]}
              image={audienceImages[i]}
              to="/who-we-serve"
            />
          ))}
        </div>
      </Shell>

      {/* ---------------- Flagship: Train the Brain ---------------- */}
      <Shell tone="dark" className="grain">
        <div
          aria-hidden
          className="glow-purple pointer-events-none absolute -top-20 right-10 size-80 rounded-full"
        />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.5fr)] lg:items-end">
          <Rise>
            <Eyebrow invert>Flagship workshop</Eyebrow>
            <h2 className="display-lg mt-6 text-dark-foreground">Train the Brain</h2>
            <p className="mt-5 text-lg font-semibold text-bright-purple">
              Better focus. Stronger memory. Greater confidence.
            </p>
          </Rise>
          <Rise delay={90} className="flex flex-wrap gap-3 lg:justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-dark-foreground/20 px-4 py-2 text-sm font-semibold text-dark-foreground/85">
              <Users className="size-4" /> Classes VII–XII
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-dark-foreground/20 px-4 py-2 text-sm font-semibold text-dark-foreground/85">
              <Clock className="size-4" /> 5 hours
            </span>
          </Rise>
        </div>

        {ttbSkills.length ? (
          <div className="mt-16">
            <SkillCloud items={ttbSkills} invert />
          </div>
        ) : null}

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <PrimaryButton to="/contact">Bring this workshop to your school</PrimaryButton>
          <Link to="/training-areas" className="link-underline text-sm font-semibold text-dark-foreground/85">
            All training areas
          </Link>
        </div>
      </Shell>

      {/* ---------------- Programs — editorial index ---------------- */}
      {programList.length ? (
        <Shell tone="white">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Rise>
              <Eyebrow>Programs</Eyebrow>
              <h2 className="display-lg text-balance-tight mt-6 max-w-2xl">
                Programs built for a specific room.
              </h2>
            </Rise>
            <SecondaryButton to="/programs" size="default">
              All programs <ArrowRight className="ml-1.5 size-4" />
            </SecondaryButton>
          </div>

          <ul className="mt-14 divide-y divide-border border-y border-border">
            {programList.map((p, i) => (
              <Rise as="li" key={p.id} delay={i * 70}>
                <Link
                  to={`/programs/${p.slug || p.id}` as never}
                  className="group grid gap-6 py-8 sm:grid-cols-[7rem_minmax(0,1fr)_11rem] sm:items-center sm:py-10"
                >
                  <span className="font-display text-sm font-extrabold text-primary/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="display-md block transition-colors duration-300 group-hover:text-primary">
                      {p.name}
                    </span>
                    {p.short_description ? (
                      <span className="mt-3 block max-w-2xl text-base leading-relaxed text-muted-foreground">
                        {p.short_description}
                      </span>
                    ) : null}
                    <span className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                      {p.target_audience ? <span>{p.target_audience}</span> : null}
                      {p.duration ? <span>{p.duration}</span> : null}
                      {p.workshop_format ? <span>{p.workshop_format}</span> : null}
                    </span>
                  </span>
                  <span className="relative hidden h-24 overflow-hidden rounded-2xl bg-lavender sm:block">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : null}
                  </span>
                </Link>
              </Rise>
            ))}
          </ul>
        </Shell>
      ) : null}

      {/* ---------------- Approach ---------------- */}
      <Shell tone="lavender">
        <Rise>
          <Eyebrow>Our approach</Eyebrow>
          <h2 className="display-lg text-balance-tight mt-6 max-w-3xl">More than a lecture.</h2>
        </Rise>
        <ApproachTrack stages={APPROACH} />
      </Shell>

      {/* ---------------- People ---------------- */}
      {trainerList.length ? (
        <Shell tone="white">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Rise>
              <Eyebrow>Our team</Eyebrow>
              <h2 className="display-lg text-balance-tight mt-6 max-w-2xl">
                The people in front of the room.
              </h2>
            </Rise>
            <SecondaryButton to="/trainers" size="default">
              Full team <ArrowRight className="ml-1.5 size-4" />
            </SecondaryButton>
          </div>

          {lead ? (
            <Rise className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-16">
              <div className="mx-auto w-full max-w-sm lg:mx-0">
                {lead.photo ? (
                  <img
                    src={lead.photo}
                    alt={lead.name}
                    loading="lazy"
                    className="aspect-4/5 w-full rounded-[1.75rem] object-cover shadow-elegant"
                  />
                ) : (
                  <div className="aspect-4/5 w-full rounded-[1.75rem] bg-lavender" />
                )}
              </div>
              <div className="min-w-0 self-center">
                <h3 className="display-md">{lead.name}</h3>
                {lead.role ? <p className="mt-3 text-sm font-semibold text-primary">{lead.role}</p> : null}
                {lead.qualification ? (
                  <p className="mt-1.5 text-sm text-muted-foreground">{lead.qualification}</p>
                ) : null}
                {lead.bio ? (
                  <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">{lead.bio}</p>
                ) : null}
                {lead.areas.length ? (
                  <ul className="mt-7 flex flex-wrap gap-2">
                    {lead.areas.slice(0, 6).map((area) => (
                      <li
                        key={area}
                        className="rounded-full bg-lavender px-3.5 py-1.5 text-xs font-semibold text-lavender-foreground"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Rise>
          ) : null}

          {trainerList.length > 1 ? (
            <div className="mt-14">
              <TrainerCarousel people={trainerList.slice(1)} onSelect={setPerson} />
            </div>
          ) : null}
        </Shell>
      ) : null}

      {/* ---------------- Global reach ---------------- */}
      {countries.length ? (
        <Shell tone="royal" className="grain">
          <div className="max-w-3xl">
            <Rise>
              <Eyebrow invert>Global reach</Eyebrow>
              <h2 className="display-lg mt-6 text-dark-foreground">Training beyond borders.</h2>
              <p className="mt-6 text-base leading-relaxed text-dark-foreground/70 sm:text-lg">
                The same practical method, adapted to each campus, culture and classroom.
              </p>
            </Rise>
          </div>
          <div className="mt-16">
            <GlobalReach countries={countries} institutionsByCountry={institutionsByCountry} />
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-5">
            <Link to="/global-reach" className="link-underline text-sm font-semibold text-dark-foreground">
              See our global reach
            </Link>
            <Link to="/impact" className="link-underline text-sm font-semibold text-dark-foreground/70">
              Our impact
            </Link>
          </div>
        </Shell>
      ) : null}

      {/* ---------------- Country presence ---------------- */}
      {countries.length ? (
        <Shell tone="white">
          <Rise>
            <Eyebrow>Countries</Eyebrow>
            <h2 className="display-lg text-balance-tight mt-6 max-w-2xl">Where Limra has trained.</h2>
          </Rise>
          <PresenceRows countries={countries} />
        </Shell>
      ) : null}

      {/* ---------------- Institution trust wall ---------------- */}
      {institutionList.length ? (
        <Shell tone="lavender" bleed className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Rise>
              <Eyebrow>Trusted by</Eyebrow>
              <h2 className="display-lg text-balance-tight mt-6 max-w-3xl">
                Institutions that invited Limra in.
              </h2>
            </Rise>
          </div>
          <div className="mt-12">
            <InstitutionWall
              institutions={institutionList.map((i) => ({
                id: i.id,
                name: i.name,
                logo_url: i.logo_url,
                meta: [i.city, i.country_name].filter(Boolean).join(", ") || i.institution_type,
              }))}
            />
          </div>
          <div className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
            <SecondaryButton to="/institutions" size="default">
              View all institutions <ArrowRight className="ml-1.5 size-4" />
            </SecondaryButton>
          </div>
        </Shell>
      ) : null}

      {/* ---------------- Gallery ---------------- */}
      {gallery.length ? (
        <Shell tone="white">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Rise>
              <Eyebrow>Gallery</Eyebrow>
              <h2 className="display-lg text-balance-tight mt-6 max-w-2xl">Inside a Limra workshop.</h2>
            </Rise>
            <SecondaryButton to="/gallery" size="default">
              Full gallery <ArrowRight className="ml-1.5 size-4" />
            </SecondaryButton>
          </div>
          <div className="mt-14">
            <GalleryMasonry images={gallery} />
          </div>
        </Shell>
      ) : null}

      {/* ---------------- Testimonials ---------------- */}
      {testimonials.length ? (
        <Shell tone="dark" className="grain">
          <Rise>
            <Eyebrow invert>Feedback</Eyebrow>
          </Rise>
          <div className="mt-10">
            <TestimonialFeature items={testimonials} />
          </div>
        </Shell>
      ) : null}

      {/* ---------------- Final CTA ---------------- */}
      <Shell tone="royal" className="grain">
        <div
          aria-hidden
          className="glow-purple pointer-events-none absolute -bottom-24 left-1/4 size-96 rounded-full"
        />
        <div className="relative max-w-4xl">
          <h2 className="display-lg text-dark-foreground">
            {map["final_cta"]?.heading || "Bring Limra Academy to your institution."}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-dark-foreground/75 sm:text-lg">
            {map["final_cta"]?.subheading ||
              "Student development, teacher training or corporate learning — tell us the room and we will design the workshop around it."}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <PrimaryButton to="/contact">Book a workshop</PrimaryButton>
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-whatsapp-foreground transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="size-4" /> WhatsApp us
              </a>
            ) : null}
          </div>
        </div>
      </Shell>

      <Dialog open={!!person} onOpenChange={(open) => !open && setPerson(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-extrabold">{person?.name}</DialogTitle>
            <DialogDescription>{person?.role || person?.qualification || "Limra Academy trainer"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 sm:grid-cols-[10rem_minmax(0,1fr)]">
            {person?.photo ? (
              <img
                src={person.photo}
                alt={person.name}
                className="aspect-4/5 w-full rounded-2xl object-cover"
              />
            ) : null}
            <div className="min-w-0">
              {person?.qualification ? (
                <p className="text-sm text-muted-foreground">{person.qualification}</p>
              ) : null}
              {person?.bio ? <p className="mt-3 text-sm leading-relaxed">{person.bio}</p> : null}
              {person?.areas.length ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {person.areas.slice(0, 8).map((a) => (
                    <li
                      key={a}
                      className="rounded-full bg-lavender px-3 py-1 text-xs font-semibold text-lavender-foreground"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="sr-only">
        <Link to="/workshops">Upcoming workshops</Link>
        <Link to="/training-areas">Training areas</Link>
        <Link to="/who-we-serve">Who we serve</Link>
      </div>
    </PublicLayout>
  );
}
