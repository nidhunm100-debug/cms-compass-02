import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Quote } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Motion primitives                                                   */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setInView(true);
        obs.disconnect();
      }
    }, options ?? { rootMargin: "-60px" });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return { ref, inView };
}

/** Fade + rise on scroll into view. Respects prefers-reduced-motion via CSS. */
export function Rise({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "figure" | "header";
}) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref as never}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", inView && "reveal-in", className)}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Section shell                                                       */
/* ------------------------------------------------------------------ */

export function Shell({
  tone = "white",
  className,
  children,
  id,
  bleed,
}: {
  tone?: "white" | "lavender" | "dark" | "royal";
  className?: string;
  children: ReactNode;
  id?: string;
  bleed?: boolean;
}) {
  const tones = {
    white: "bg-background text-foreground",
    lavender: "bg-surface text-foreground",
    dark: "bg-dark text-dark-foreground",
    royal: "royal-gradient text-dark-foreground",
  } as const;
  return (
    <section id={id} className={cn("relative overflow-hidden", tones[tone], className)}>
      <div className={cn("relative mx-auto max-w-7xl", bleed ? "" : "px-5 py-24 sm:px-8 sm:py-32")}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children, invert }: { children: ReactNode; invert?: boolean }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", invert && "text-dark-foreground/60")}>
      <span
        aria-hidden
        className={cn("inline-block h-px w-8", invert ? "bg-dark-foreground/40" : "bg-primary/50")}
      />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Statistics                                                          */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || !target) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const steps = 46;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / steps, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress === 1) window.clearInterval(id);
    }, 22);
    return () => window.clearInterval(id);
  }, [target, active]);
  return value;
}

/** Animates the numeric part of strings such as "60,500+" or "26 Lakh+". */
export function BigStat({
  value,
  label,
  description,
  invert,
}: {
  value: string;
  label: string;
  description?: string | null | undefined;
  invert?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const match = /^([^0-9]*)([0-9][0-9,.]*)(.*)$/.exec(value.trim());
  const numeric = match ? Number(match[2]!.replace(/[,\s]/g, "")) : 0;
  const animated = useCountUp(numeric, inView);
  const display = match && numeric ? `${match[1]}${animated.toLocaleString("en-IN")}${match[3]}` : value;

  return (
    <div ref={ref} className="min-w-0">
      <p className={cn("stat-number", invert ? "text-dark-foreground" : "text-primary")}>{display}</p>
      <p
        className={cn(
          "mt-3 text-sm font-semibold tracking-wide",
          invert ? "text-dark-foreground/85" : "text-foreground",
        )}
      >
        {label}
      </p>
      {description ? (
        <p className={cn("mt-1.5 text-sm", invert ? "text-dark-foreground/55" : "text-muted-foreground")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ImpactStrip({
  stats,
  countries,
}: {
  stats: { id?: string; value: string; label: string; description?: string | null | undefined }[];
  countries: string[];
}) {
  if (!stats.length && !countries.length) return null;
  return (
    <section className="royal-gradient grain relative">
      <div
        aria-hidden
        className="glow-purple pointer-events-none absolute -top-24 left-1/3 size-72 rounded-full opacity-70"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        {stats.length ? (
          <dl className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {stats.slice(0, 3).map((s, i) => (
              <Rise key={(s.id ?? "") + s.label} delay={i * 90}>
                <BigStat invert value={s.value} label={s.label} description={s.description} />
              </Rise>
            ))}
          </dl>
        ) : null}
        {countries.length ? (
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-dark-foreground/15 pt-8">
            <p className="eyebrow text-dark-foreground/55">International training experience</p>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {countries.map((c) => (
                <li key={c} className="font-display text-sm font-bold tracking-wide text-dark-foreground/80">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Audience panels                                                     */
/* ------------------------------------------------------------------ */

export function AudiencePanel({
  index,
  title,
  items,
  image,
  to,
  flagship,
}: {
  index: string;
  title: string;
  items: string[];
  image?: string | null | undefined;
  to: string;
  flagship?: string | null | undefined;
}) {
  return (
    <Rise as="article" className="group relative min-w-0">
      <Link
        to={to as never}
        className="block overflow-hidden rounded-[1.75rem] bg-charcoal focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <div className="relative aspect-4/5 w-full sm:aspect-3/4">
          {image ? (
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="size-full bg-lavender" />
          )}
          <div aria-hidden className="deep-veil absolute inset-0" />
          <div
            aria-hidden
            className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/25"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
            <p className="font-display text-sm font-extrabold text-dark-foreground/50">{index}</p>
            <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-dark-foreground sm:text-[1.75rem]">
              {title}
            </h3>
            {flagship ? (
              <p className="mt-2 text-xs font-semibold tracking-[0.14em] text-dark-foreground/75 uppercase">
                {flagship}
              </p>
            ) : null}
            <ul className="mt-4 space-y-1 opacity-80 transition-opacity duration-500 group-hover:opacity-100">
              {items.slice(0, 6).map((item) => (
                <li key={item} className="text-sm text-dark-foreground/85">
                  {item}
                </li>
              ))}
            </ul>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-dark-foreground">
              Explore
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </span>
          </div>
        </div>
      </Link>
    </Rise>
  );
}

/* ------------------------------------------------------------------ */
/* Skill cloud                                                         */
/* ------------------------------------------------------------------ */

export function SkillCloud({
  items,
  invert,
}: {
  items: { id: string; name: string; description?: string | null | undefined }[];
  invert?: boolean;
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);
  const active = items.find((i) => i.id === activeId) ?? items[0];
  if (!items.length) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
      <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-2 sm:gap-x-8">
        {items.map((item) => {
          const on = item.id === active?.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onMouseEnter={() => setActiveId(item.id)}
                onFocus={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "font-display text-left text-2xl font-extrabold tracking-tight uppercase transition-colors duration-300 sm:text-4xl lg:text-[2.75rem]",
                  on
                    ? invert
                      ? "text-dark-foreground"
                      : "text-primary"
                    : invert
                      ? "text-dark-foreground/30 hover:text-dark-foreground/70"
                      : "text-foreground/25 hover:text-foreground/60",
                )}
              >
                {item.name}
              </button>
            </li>
          );
        })}
      </ul>
      <div
        className={cn(
          "self-start rounded-3xl border p-6 sm:p-8",
          invert ? "border-dark-foreground/15 bg-dark-foreground/5" : "border-border bg-card",
        )}
      >
        <p className={cn("eyebrow", invert && "text-dark-foreground/60")}>Skill focus</p>
        <p
          className={cn(
            "font-display mt-3 text-xl font-extrabold",
            invert ? "text-dark-foreground" : "text-foreground",
          )}
        >
          {active?.name}
        </p>
        <p className={cn("mt-3 text-sm leading-relaxed", invert ? "text-dark-foreground/70" : "text-muted-foreground")}>
          {active?.description ||
            "Practised through guided activities and techniques inside the workshop room."}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Approach — scroll-highlighted stages                                */
/* ------------------------------------------------------------------ */

export function ApproachTrack({
  stages,
}: {
  stages: { step: string; title: string; body: string }[];
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = refs.current.findIndex((n) => n === entry.target);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((node) => node && obs.observe(node));
    return () => obs.disconnect();
  }, [stages.length]);

  return (
    <ol className="relative mt-14 border-l border-border pl-8 sm:pl-12">
      <span
        aria-hidden
        className="absolute top-0 -left-px w-0.5 bg-primary transition-[height] duration-500 ease-out"
        style={{ height: `${((active + 1) / stages.length) * 100}%` }}
      />
      {stages.map((s, i) => (
        <li
          key={s.step}
          ref={(node) => {
            refs.current[i] = node;
          }}
          className="relative py-8 sm:py-12"
        >
          <span
            aria-hidden
            className={cn(
              "absolute top-11 -left-[2.3rem] size-2.5 rounded-full transition-all duration-500 sm:-left-[3.55rem]",
              i <= active ? "scale-125 bg-primary" : "bg-border",
            )}
          />
          <p
            className={cn(
              "font-display text-sm font-extrabold transition-colors duration-500",
              i <= active ? "text-primary" : "text-muted-foreground/50",
            )}
          >
            {s.step}
          </p>
          <p
            className={cn(
              "display-md mt-2 transition-colors duration-500",
              i === active ? "text-foreground" : "text-foreground/35",
            )}
          >
            {s.title}
          </p>
          <p
            className={cn(
              "mt-3 max-w-xl text-base leading-relaxed transition-colors duration-500",
              i === active ? "text-muted-foreground" : "text-muted-foreground/50",
            )}
          >
            {s.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Trainer showcase                                                    */
/* ------------------------------------------------------------------ */

export type ShowcasePerson = {
  id: string;
  name: string;
  role?: string | null | undefined;
  qualification?: string | null | undefined;
  bio?: string | null | undefined;
  photo?: string | null | undefined;
  areas: string[];
};

export function TrainerCarousel({
  people,
  onSelect,
}: {
  people: ShowcasePerson[];
  onSelect: (person: ShowcasePerson) => void;
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const nudge = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };
  if (!people.length) return null;

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {people.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p)}
            className="group w-60 shrink-0 snap-start text-left sm:w-64"
          >
            <div className="relative overflow-hidden rounded-3xl bg-lavender">
              {p.photo ? (
                <img
                  src={p.photo}
                  alt={p.name}
                  loading="lazy"
                  className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="aspect-4/5 w-full bg-lavender" />
              )}
              <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-background/90 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <p className="font-display mt-4 text-base font-extrabold">{p.name}</p>
            {p.role ? <p className="mt-0.5 text-xs font-semibold text-primary">{p.role}</p> : null}
            {p.qualification ? (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.qualification}</p>
            ) : null}
          </button>
        ))}
      </div>
      <div className="mt-2 hidden justify-end gap-2 sm:flex">
        <button
          type="button"
          aria-label="Previous trainers"
          onClick={() => nudge(-1)}
          className="grid size-10 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Next trainers"
          onClick={() => nudge(1)}
          className="grid size-10 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Global reach                                                        */
/* ------------------------------------------------------------------ */

const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  india: { x: 60, y: 44 },
  malaysia: { x: 76, y: 62 },
  singapore: { x: 82, y: 72 },
  uae: { x: 42, y: 46 },
  "united arab emirates": { x: 42, y: 46 },
  indonesia: { x: 90, y: 80 },
  vietnam: { x: 74, y: 44 },
  "sri lanka": { x: 60, y: 66 },
};

export function GlobalReach({
  countries,
  institutionsByCountry,
}: {
  countries: { id: string; name: string; training_count?: number | null | undefined }[];
  institutionsByCountry: Record<string, string[]>;
}) {
  const [active, setActive] = useState<string | null>(countries[0]?.name ?? null);
  const placed = useMemo(
    () =>
      countries.map((c) => ({
        ...c,
        pos: MAP_POSITIONS[c.name.trim().toLowerCase()] ?? null,
      })),
    [countries],
  );
  if (!countries.length) return null;
  const activeInstitutions = active ? (institutionsByCountry[active] ?? []) : [];

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
      <div className="relative min-w-0">
        <div className="relative aspect-16/10 overflow-hidden rounded-3xl border border-dark-foreground/10 bg-dark-foreground/5">
          <svg viewBox="0 0 100 62" className="absolute inset-0 size-full opacity-25" aria-hidden>
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`h${i}`} x1="0" x2="100" y1={i * 5} y2={i * 5} stroke="currentColor" strokeWidth="0.15" />
            ))}
            {Array.from({ length: 21 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 5} x2={i * 5} y1="0" y2="62" stroke="currentColor" strokeWidth="0.15" />
            ))}
          </svg>
          <div aria-hidden className="glow-purple absolute top-1/4 left-1/2 size-64 rounded-full" />
          {placed.map((c) =>
            c.pos ? (
              <button
                key={c.id}
                type="button"
                onMouseEnter={() => setActive(c.name)}
                onClick={() => setActive(c.name)}
                style={{ left: `${c.pos.x}%`, top: `${c.pos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                aria-label={c.name}
              >
                <span className="relative grid place-items-center">
                  <span
                    aria-hidden
                    className="marker-pulse absolute size-3 rounded-full bg-bright-purple"
                  />
                  <span
                    className={cn(
                      "relative size-2.5 rounded-full transition-all duration-300",
                      active === c.name ? "scale-150 bg-dark-foreground" : "bg-bright-purple",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "font-display absolute top-4 left-1/2 -translate-x-1/2 text-[0.6rem] font-bold tracking-wide whitespace-nowrap uppercase transition-colors sm:text-xs",
                    active === c.name ? "text-dark-foreground" : "text-dark-foreground/50",
                  )}
                >
                  {c.name}
                </span>
              </button>
            ) : null,
          )}
        </div>
      </div>

      <div className="min-w-0">
        <ul className="divide-y divide-dark-foreground/10 border-y border-dark-foreground/10">
          {countries.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(c.name)}
                onClick={() => setActive(c.name)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span
                  className={cn(
                    "font-display text-lg font-extrabold tracking-tight transition-colors sm:text-xl",
                    active === c.name ? "text-dark-foreground" : "text-dark-foreground/45",
                  )}
                >
                  {c.name}
                </span>
                <ArrowUpRight
                  className={cn(
                    "size-4 shrink-0 transition-all",
                    active === c.name ? "translate-x-0 text-bright-purple opacity-100" : "-translate-x-1 opacity-0",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-6 min-h-24">
          {activeInstitutions.length ? (
            <>
              <p className="eyebrow text-dark-foreground/55">Institutions in {active}</p>
              <ul className="mt-3 space-y-1.5">
                {activeInstitutions.slice(0, 5).map((n) => (
                  <li key={n} className="text-sm text-dark-foreground/70">
                    {n}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-dark-foreground/50">
              Select a country to see the institutions recorded for it.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Institution wall                                                    */
/* ------------------------------------------------------------------ */

export function InstitutionWall({
  institutions,
}: {
  institutions: { id: string; name: string; logo_url?: string | null | undefined; meta?: string | null | undefined }[];
}) {
  if (!institutions.length) return null;
  const row = [...institutions, ...institutions];
  return (
    <div className="marquee-mask overflow-hidden">
      <div className="marquee-track gap-4 py-2">
        {row.map((inst, i) => (
          <div
            key={`${inst.id}-${i}`}
            className="flex w-64 shrink-0 items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4"
          >
            {inst.logo_url ? (
              <img
                src={inst.logo_url}
                alt={inst.name}
                loading="lazy"
                className="size-10 shrink-0 rounded-lg object-contain grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
            ) : (
              <span className="font-display grid size-10 shrink-0 place-items-center rounded-lg bg-lavender text-sm font-extrabold text-lavender-foreground">
                {inst.name.slice(0, 1)}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{inst.name}</p>
              {inst.meta ? <p className="truncate text-xs text-muted-foreground">{inst.meta}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Country presence tiles                                              */
/* ------------------------------------------------------------------ */

export function PresenceRows({
  countries,
}: {
  countries: { id: string; name: string; featured_image_url?: string | null | undefined }[];
}) {
  if (!countries.length) return null;
  return (
    <ul className="mt-14 divide-y divide-border border-y border-border">
      {countries.map((c) => (
        <li key={c.id} className="group relative isolate">
          <Link to="/global-reach" className="flex items-center justify-between gap-6 px-1 py-7 sm:py-9">
            {c.featured_image_url ? (
              <img
                src={c.featured_image_url}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 -z-10 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-70"
              />
            ) : null}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 bg-primary opacity-0 transition-opacity duration-500 group-hover:opacity-85"
            />
            <span className="font-display text-2xl font-extrabold tracking-tight uppercase transition-colors duration-500 group-hover:text-primary-foreground sm:text-4xl">
              {c.name}
            </span>
            <ArrowUpRight className="size-5 shrink-0 -translate-x-2 text-primary opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-primary-foreground group-hover:opacity-100" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery masonry                                                     */
/* ------------------------------------------------------------------ */

export function GalleryMasonry({
  images,
}: {
  images: { id: string; image_url: string; alt_text?: string | null; title?: string | null; category?: string | null }[];
}) {
  if (!images.length) return null;
  const spans = [
    "sm:col-span-2 sm:row-span-2",
    "sm:col-span-1 sm:row-span-1",
    "sm:col-span-1 sm:row-span-2",
    "sm:col-span-2 sm:row-span-1",
    "sm:col-span-1 sm:row-span-1",
    "sm:col-span-1 sm:row-span-1",
  ];
  return (
    <div className="grid auto-rows-[11rem] grid-cols-1 gap-3 sm:auto-rows-[12rem] sm:grid-cols-4 sm:gap-4">
      {images.slice(0, 6).map((img, i) => (
        <Rise
          as="figure"
          key={img.id}
          delay={i * 70}
          className={cn("group relative overflow-hidden rounded-3xl bg-lavender", spans[i % spans.length])}
        >
          <img
            src={img.image_url}
            alt={img.alt_text || img.title || "Limra Academy workshop"}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-dark/80 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="text-xs font-semibold text-dark-foreground">{img.title || img.category || "Workshop"}</span>
            <span className="rounded-full bg-background/90 px-3 py-1 text-[0.65rem] font-bold tracking-widest text-primary uppercase">
              View
            </span>
          </figcaption>
        </Rise>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export function TestimonialFeature({
  items,
}: {
  items: {
    id: string;
    quote: string;
    name: string;
    designation?: string | null | undefined;
    organization?: string | null | undefined;
    country?: string | null | undefined;
  }[];
}) {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  const item = items[index % items.length]!;
  const meta = [item.designation, item.organization, item.country].filter(Boolean).join(" · ");

  return (
    <div className="relative">
      <Quote className="size-10 text-bright-purple/60" />
      <blockquote className="mt-8 max-w-4xl">
        <p className="font-display text-2xl leading-[1.28] font-extrabold tracking-tight text-dark-foreground sm:text-3xl lg:text-[2.6rem]">
          “{item.quote}”
        </p>
        <footer className="mt-10">
          <p className="font-display text-base font-extrabold text-dark-foreground">{item.name}</p>
          {meta ? <p className="mt-1 text-sm text-dark-foreground/60">{meta}</p> : null}
        </footer>
      </blockquote>
      {items.length > 1 ? (
        <div className="mt-10 flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            className="grid size-11 place-items-center rounded-full border border-dark-foreground/25 text-dark-foreground/80 transition-colors hover:border-dark-foreground hover:text-dark-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            className="grid size-11 place-items-center rounded-full border border-dark-foreground/25 text-dark-foreground/80 transition-colors hover:border-dark-foreground hover:text-dark-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
          <span className="ml-2 text-xs text-dark-foreground/50">
            {(index % items.length) + 1} / {items.length}
          </span>
        </div>
      ) : null}
    </div>
  );
}
