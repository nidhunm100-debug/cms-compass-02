import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

import type { Credential } from "@/lib/public-cms";
import { cn } from "@/lib/utils";

export function credentialAlt(c: Credential) {
  return (
    c.alt_text ||
    [c.title, c.issuing_organization].filter(Boolean).join(" — ") ||
    "Limra Academy certificate"
  );
}

export function credentialMeta(c: Credential) {
  const when = c.certificate_date
    ? new Date(c.certificate_date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    : c.year
      ? String(c.year)
      : null;
  return [c.issuing_organization, when].filter(Boolean).join(" · ");
}

/* ------------------------------------------------------------------ */
/* Certificate card                                                    */
/* ------------------------------------------------------------------ */

export function CertificateCard({
  credential,
  onOpen,
  className,
  invert,
}: {
  credential: Credential;
  onOpen: () => void;
  className?: string;
  invert?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group block w-full cursor-pointer text-left transition-transform duration-500 hover:-translate-y-1",
        className,
      )}
      aria-label={`View certificate: ${credential.title ?? "certificate"}`}
    >
      <figure
        className={cn(
          "relative overflow-hidden rounded-2xl border shadow-sm transition-shadow duration-500 group-hover:shadow-xl",
          invert ? "border-dark-foreground/12 bg-dark-foreground/5" : "border-border bg-card",
        )}
      >
        <img
          src={credential.image_url}
          alt={credentialAlt(credential)}
          loading="lazy"
          className="aspect-4/3 w-full bg-background object-contain p-2 transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span className="pointer-events-none absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-background/90 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Maximize2 className="size-4" />
        </span>
      </figure>
      <figcaption className="mt-3">
        <p
          className={cn(
            "font-display line-clamp-2 text-sm leading-snug font-bold",
            invert && "text-dark-foreground",
          )}
        >
          {credential.title}
        </p>
        {credentialMeta(credential) ? (
          <p className={cn("mt-1 text-xs", invert ? "text-dark-foreground/55" : "text-muted-foreground")}>
            {credentialMeta(credential)}
          </p>
        ) : null}
      </figcaption>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Homepage marquee                                                    */
/* ------------------------------------------------------------------ */

export function CertificateMarquee({
  credentials,
  onOpen,
}: {
  credentials: Credential[];
  onOpen: (index: number) => void;
}) {
  if (!credentials.length) return null;
  const loop = [...credentials, ...credentials];

  return (
    <div className="marquee-mask relative -mx-5 overflow-hidden sm:-mx-8">
      <ul className="marquee-track flex w-max items-stretch gap-5 px-5 sm:px-8">
        {loop.map((c, i) => (
          <li key={`${c.id}-${i}`} className="w-[15rem] shrink-0 sm:w-[17rem]">
            <CertificateCard credential={c} invert onOpen={() => onOpen(i % credentials.length)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox viewer                                                     */
/* ------------------------------------------------------------------ */

export function CertificateViewer({
  credentials,
  index,
  onClose,
  onIndexChange,
}: {
  credentials: Credential[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const open = index !== null && !!credentials.length;
  const current = open ? credentials[index! % credentials.length]! : null;

  const step = useCallback(
    (delta: number) => {
      if (index === null || !credentials.length) return;
      onIndexChange((index + delta + credentials.length) % credentials.length);
    },
    [index, credentials.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose, step]);

  if (!open || !current) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.title ?? "Certificate"}
      className="animate-fade-in fixed inset-0 z-100 flex flex-col bg-dark/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <p className="min-w-0 flex-1 truncate text-xs font-semibold tracking-widest text-dark-foreground/60 uppercase">
          {index! + 1} / {credentials.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-dark-foreground/10 text-dark-foreground transition-colors hover:bg-dark-foreground/20"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-2 px-3 sm:gap-4 sm:px-6">
        {credentials.length > 1 ? (
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous certificate"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-dark-foreground/10 text-dark-foreground transition-colors hover:bg-dark-foreground/20 sm:size-12"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : null}
        <img
          key={current.id}
          src={current.image_url}
          alt={credentialAlt(current)}
          className="animate-scale-in mx-auto max-h-full min-h-0 w-auto max-w-full rounded-xl bg-background object-contain shadow-2xl"
        />
        {credentials.length > 1 ? (
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next certificate"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-dark-foreground/10 text-dark-foreground transition-colors hover:bg-dark-foreground/20 sm:size-12"
          >
            <ChevronRight className="size-5" />
          </button>
        ) : null}
      </div>

      <div className="mx-auto w-full max-w-3xl px-6 py-6 text-center">
        <p className="font-display text-base font-extrabold text-dark-foreground sm:text-lg">{current.title}</p>
        {credentialMeta(current) ? (
          <p className="mt-1.5 text-sm text-dark-foreground/60">{credentialMeta(current)}</p>
        ) : null}
        {current.description ? (
          <p className="mt-3 text-sm leading-relaxed text-dark-foreground/70">{current.description}</p>
        ) : null}
      </div>
    </div>
  );
}

/** Small helper so pages can share viewer state. */
export function useCertificateViewer() {
  const [index, setIndex] = useState<number | null>(null);
  return { index, open: setIndex, close: () => setIndex(null), setIndex };
}
