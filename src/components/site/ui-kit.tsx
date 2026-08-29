import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Motion: one subtle fade-up primitive, reduced-motion aware          */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "-40px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", shown && "reveal-in", className)}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

export function Section({
  tone = "white",
  className,
  children,
  id,
}: {
  tone?: "white" | "lavender" | "purple";
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  const tones = {
    white: "bg-background text-foreground",
    lavender: "bg-surface text-foreground",
    purple: "purple-gradient text-deep-purple-foreground",
  } as const;
  return (
    <section id={id} className={cn(tones[tone], className)}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  invert,
  action,
}: {
  eyebrow?: string | null | undefined;
  title: string;
  intro?: string | null | undefined;
  align?: "left" | "center";
  invert?: boolean;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "gap-6",
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : action
            ? "grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_auto]"
            : "max-w-2xl",
      )}
    >
      <div className="min-w-0">
        {eyebrow ? <p className={cn("eyebrow", invert && "text-deep-purple-foreground/70")}>{eyebrow}</p> : null}
        <h2
          className={cn(
            "text-balance-tight mt-3 text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
            invert && "text-deep-purple-foreground",
          )}
        >
          {title}
        </h2>
        {intro ? (
          <p className={cn("mt-4 text-base leading-relaxed text-muted-foreground", invert && "text-deep-purple-foreground/75")}>
            {intro}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

const pill = "rounded-full px-6 font-semibold";

export function PrimaryButton({
  to,
  href,
  children,
  size = "lg",
  className,
  onClick,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  size?: "default" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  const cls = cn(pill, className);
  if (href) {
    return (
      <Button asChild size={size} className={cls}>
        <a href={href} onClick={onClick}>
          {children}
        </a>
      </Button>
    );
  }
  return (
    <Button asChild size={size} className={cls}>
      <Link to={(to ?? "/") as never} onClick={onClick}>
        {children}
      </Link>
    </Button>
  );
}

export function SecondaryButton({
  to,
  children,
  size = "lg",
  invert,
  className,
  onClick,
}: {
  to?: string;
  children: ReactNode;
  size?: "default" | "lg";
  invert?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      asChild
      size={size}
      variant="outline"
      className={cn(
        pill,
        invert
          ? "border-deep-purple-foreground/40 bg-transparent text-deep-purple-foreground hover:bg-deep-purple-foreground/10 hover:text-deep-purple-foreground"
          : "border-primary/40 bg-background text-primary hover:bg-secondary hover:text-primary",
        className,
      )}
    >
      <Link to={(to ?? "/") as never} onClick={onClick}>
        {children}
      </Link>
    </Button>
  );
}

export function WhatsAppButton({ href, label = "WhatsApp us" }: { href: string; label?: string }) {
  if (!href) return null;
  return (
    <Button asChild size="lg" className={cn(pill, "bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90")}>
      <a href={href} target="_blank" rel="noreferrer">
        <MessageCircle className="mr-2 size-4" /> {label}
      </a>
    </Button>
  );
}

export function FloatingWhatsApp({ href }: { href: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Limra Academy on WhatsApp"
      className="fixed right-4 bottom-5 z-50 flex size-12 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-soft transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
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
    const steps = 40;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / steps, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress === 1) window.clearInterval(id);
    }, 20);
    return () => window.clearInterval(id);
  }, [target, active]);
  return value;
}

/** Animates the numeric part of values like "60,500+" or "2 Lakh+". */
export function StatBlock({
  value,
  label,
  invert,
}: {
  value: string;
  label: string;
  invert?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const match = /^([^0-9]*)([0-9][0-9,.]*)(.*)$/.exec(value.trim());
  const numeric = match ? Number(match[2]!.replace(/[,\s]/g, "")) : 0;
  const animated = useCountUp(numeric, active);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setActive(true);
        obs.disconnect();
      }
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const display =
    match && numeric
      ? `${match[1]}${animated.toLocaleString("en-IN")}${match[3]}`
      : value;

  return (
    <div ref={ref}>
      <p
        className={cn(
          "font-display text-3xl font-extrabold tracking-tight sm:text-4xl",
          invert ? "text-deep-purple-foreground" : "text-primary",
        )}
      >
        {display}
      </p>
      <p
        className={cn(
          "mt-1.5 text-sm",
          invert ? "text-deep-purple-foreground/70" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

export function AudienceCard({
  index,
  title,
  description,
  tags,
  image,
  ctaLabel,
  ctaTo,
  reverse,
}: {
  index: string;
  title: string;
  description: string;
  tags: string[];
  image?: string | null | undefined;
  ctaLabel: string;
  ctaTo: string;
  reverse?: boolean;
}) {
  return (
    <Reveal
      as="article"
      className={cn(
        "grid items-center gap-8 rounded-3xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-2 lg:gap-14 lg:p-10",
      )}
    >
      <div className={cn("min-w-0", reverse && "lg:order-2")}>
        <p className="font-display text-sm font-extrabold text-primary/50">{index}</p>
        <h3 className="mt-2 text-2xl sm:text-3xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-lavender px-3 py-1 text-xs font-medium text-lavender-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-7">
          <SecondaryButton to={ctaTo} size="default">
            {ctaLabel} <ArrowRight className="ml-1.5 size-4" />
          </SecondaryButton>
        </div>
      </div>
      <div className={cn("min-w-0", reverse && "lg:order-1")}>
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="aspect-4/3 w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="aspect-4/3 w-full rounded-2xl bg-lavender" />
        )}
      </div>
    </Reveal>
  );
}

export function ProgramCard({
  name,
  audience,
  duration,
  format,
  description,
  image,
  to,
  featured,
}: {
  name: string;
  audience?: string | null | undefined;
  duration?: string | null | undefined;
  format?: string | null | undefined;
  description?: string | null | undefined;
  image?: string | null | undefined;
  to: string;
  featured?: boolean;
}) {
  const meta = [audience, duration, format].filter(Boolean) as string[];

  if (featured) {
    return (
      <Reveal as="article" className="group overflow-hidden rounded-3xl bg-deep-purple text-deep-purple-foreground">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 sm:p-10">
            <p className="eyebrow text-deep-purple-foreground/70">Flagship program</p>
            <h3 className="mt-3 text-3xl text-deep-purple-foreground sm:text-4xl">{name}</h3>
            {description ? (
              <p className="mt-4 text-sm leading-relaxed text-deep-purple-foreground/80">{description}</p>
            ) : null}
            <ul className="mt-6 flex flex-wrap gap-2">
              {meta.map((m) => (
                <li
                  key={m}
                  className="rounded-full border border-deep-purple-foreground/25 px-3 py-1 text-xs font-medium text-deep-purple-foreground/85"
                >
                  {m}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-background px-6 font-semibold text-primary hover:bg-background/90"
              >
                <Link to={to as never}>
                  View program <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="min-h-56">
            {image ? (
              <img src={image} alt={name} loading="lazy" className="size-full min-h-56 object-cover" />
            ) : null}
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal
      as="article"
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-transform duration-300 hover:-translate-y-1"
    >
      {image ? (
        <img src={image} alt={name} loading="lazy" className="aspect-16/10 w-full object-cover" />
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl">{name}</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {meta.map((m) => (
            <li key={m} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {m}
            </li>
          ))}
        </ul>
        {description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
        <Link
          to={to as never}
          className="mt-5 inline-flex items-center text-sm font-semibold text-primary"
        >
          View program <ArrowRight className="ml-1 size-3.5" />
        </Link>
      </div>
    </Reveal>
  );
}

export function TrainerCard({
  name,
  title,
  photo,
  compact,
}: {
  name: string;
  title?: string | null | undefined;
  photo?: string | null | undefined;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card",
        compact && "w-56 shrink-0 sm:w-auto",
      )}
    >
      {photo ? (
        <img src={photo} alt={name} loading="lazy" className="aspect-4/5 w-full object-cover" />
      ) : (
        <div className="aspect-4/5 w-full bg-lavender" />
      )}
      <div className="p-4">
        <p className="font-display text-base font-bold">{name}</p>
        {title ? <p className="mt-0.5 text-xs text-muted-foreground">{title}</p> : null}
      </div>
    </div>
  );
}

export function InstitutionCard({
  name,
  logo,
  meta,
}: {
  name: string;
  logo?: string | null | undefined;
  meta?: string | null | undefined;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      {logo ? (
        <img src={logo} alt={name} loading="lazy" className="size-10 shrink-0 rounded-lg object-contain" />
      ) : (
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-lavender font-display text-sm font-bold text-lavender-foreground">
          {name.slice(0, 1)}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name}</p>
        {meta ? <p className="truncate text-xs text-muted-foreground">{meta}</p> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

export function GalleryGrid({
  images,
}: {
  images: { id: string; image_url: string; alt_text?: string | null; title?: string | null }[];
}) {
  if (!images.length) return null;
  const spans = [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
  ];
  return (
    <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:gap-4 lg:grid-cols-4">
      {images.slice(0, 6).map((img, i) => (
        <figure
          key={img.id}
          className={cn("overflow-hidden rounded-2xl bg-lavender", spans[i % spans.length])}
        >
          <img
            src={img.image_url}
            alt={img.alt_text || img.title || "Limra workshop"}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </figure>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CTA                                                                 */
/* ------------------------------------------------------------------ */

export function CTASection({
  title,
  body,
  whatsappHref,
}: {
  title: string;
  body?: string | null | undefined;
  whatsappHref?: string;
}) {
  return (
    <section className="purple-gradient">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-24">
        <h2 className="text-balance-tight text-3xl text-deep-purple-foreground sm:text-4xl lg:text-5xl">{title}</h2>
        {body ? (
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-deep-purple-foreground/80">{body}</p>
        ) : null}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-background px-6 font-semibold text-primary hover:bg-background/90"
          >
            <Link to="/contact">Book a workshop</Link>
          </Button>
          {whatsappHref ? <WhatsAppButton href={whatsappHref} /> : null}
        </div>
      </div>
    </section>
  );
}
