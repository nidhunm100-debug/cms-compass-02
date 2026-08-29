import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Mail, Menu, MessageCircle, Phone, X } from "lucide-react";

import { useNavigation, usePrograms, useSiteSettings } from "@/lib/public-cms";
import { Button } from "@/components/ui/button";
import { FloatingWhatsApp, PrimaryButton } from "@/components/site/ui-kit";
import { cn } from "@/lib/utils";

export function whatsappHref(number?: string | null) {
  const digits = (number ?? "").replace(/[^0-9]/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

type NavItem = { label: string; to: string; children?: { label: string; to: string }[] };

function useHeaderNav(): NavItem[] {
  const { data: programs = [] } = usePrograms();
  const programChildren = programs.slice(0, 6).map((p) => ({
    label: p.name,
    to: `/programs/${p.slug || p.id}`,
  }));

  return [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    {
      label: "Programs",
      to: "/programs",
      children: programChildren.length ? programChildren : [{ label: "All programs", to: "/programs" }],
    },
    {
      label: "Who We Serve",
      to: "/who-we-serve",
      children: [
        { label: "Schools & Students", to: "/who-we-serve" },
        { label: "Teachers & Educators", to: "/who-we-serve" },
        { label: "Corporates & Professionals", to: "/who-we-serve" },
        { label: "Training areas", to: "/training-areas" },
      ],
    },
    {
      label: "Our Impact",
      to: "/impact",
      children: [
        { label: "Impact numbers", to: "/impact" },
        { label: "Global reach", to: "/global-reach" },
        { label: "Institutions", to: "/institutions" },
        { label: "Gallery", to: "/gallery" },
      ],
    },
    { label: "Our Team", to: "/trainers" },
  ];
}

function DesktopNav({ items }: { items: NavItem[] }) {
  return (
    <ul className="hidden items-center gap-0.5 lg:flex">
      {items.map((item) => (
        <li key={item.label} className="group relative">
          <Link
            to={item.to as never}
            activeProps={{ className: "text-primary" }}
            className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
          >
            {item.label}
            {item.children ? <ChevronDown className="size-3.5 opacity-60" /> : null}
          </Link>
          {item.children ? (
            <div className="absolute left-0 hidden pt-2 group-hover:block">
              <ul className="min-w-60 rounded-2xl border border-border bg-popover p-1.5 shadow-soft">
                {item.children.map((kid) => (
                  <li key={kid.label + kid.to}>
                    <Link
                      to={kid.to as never}
                      className="block rounded-xl px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {kid.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function MobileNav({ items, onNavigate }: { items: NavItem[]; onNavigate: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            to={item.to as never}
            onClick={onNavigate}
            className="block rounded-xl px-3 py-2.5 text-base font-semibold text-foreground/85 hover:bg-secondary hover:text-primary"
          >
            {item.label}
          </Link>
          {item.children ? (
            <ul className="mb-1 ml-3 border-l border-border pl-3">
              {item.children.map((kid) => (
                <li key={kid.label + kid.to}>
                  <Link
                    to={kid.to as never}
                    onClick={onNavigate}
                    className="block rounded-lg px-2 py-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    {kid.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function PublicLayout({ children, overlay }: { children: ReactNode; overlay?: boolean }) {
  const { data: settings = {} } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const items = useHeaderNav();

  const contact = settings.contact ?? {};
  const branding = settings.branding ?? {};
  const social = settings.social ?? {};
  const footer = settings.footer ?? {};
  const wa = whatsappHref(contact.whatsapp);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-3xl transition-all duration-500",
            scrolled || open
              ? "border border-border/60 bg-background/75 shadow-soft backdrop-blur-2xl"
              : "border border-transparent bg-background/10 backdrop-blur-sm",
          )}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-2.5 sm:px-5 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
            <Link to="/" className="flex min-w-0 items-center gap-2.5">
              {branding.logo_url ? (
                <img src={branding.logo_url} alt={branding.site_name || "Limra Academy"} className="h-9 w-auto" />
              ) : (
                <span className="font-display grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground">
                  L
                </span>
              )}
              <span
                className={cn(
                  "font-display min-w-0 truncate text-sm font-extrabold tracking-tight transition-colors sm:text-base",
                  scrolled || open ? "text-foreground" : overlay ? "text-dark-foreground" : "text-foreground",
                )}
              >
                {branding.site_name || "Limra Academy for Excellence"}
              </span>
            </Link>

            <nav className="hidden justify-center lg:flex" aria-label="Main navigation">
              <DesktopNav items={items} invert={!!overlay && !scrolled && !open} />
            </nav>

            <div className="flex items-center justify-end gap-2">
              <PrimaryButton to="/contact" size="default" className="hidden sm:inline-flex">
                Book a workshop
              </PrimaryButton>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
                className={cn(
                  "rounded-full lg:hidden",
                  overlay && !scrolled && !open ? "text-dark-foreground hover:text-dark-foreground" : "",
                )}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </div>
          </div>

          {open ? (
            <div className="border-t border-border/60 px-4 pt-3 pb-5 lg:hidden">
              <MobileNav items={items} onNavigate={() => setOpen(false)} />
              <PrimaryButton to="/contact" className="mt-3 w-full" onClick={() => setOpen(false)}>
                Book a workshop
              </PrimaryButton>
            </div>
          ) : null}
        </div>
      </header>

      <main className={cn("flex-1", overlay ? "" : "pt-20 sm:pt-24")}>{children}</main>


      <footer className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div className="space-y-3">
            {footer.logo_url ? (
              <img src={footer.logo_url} alt={branding.site_name || "Limra Academy"} className="h-10 w-auto" />
            ) : (
              <p className="font-display text-lg font-extrabold">{branding.site_name || "Limra Academy for Excellence"}</p>
            )}
            <p className="text-sm leading-relaxed text-ink-foreground/70">
              {footer.description || branding.tagline}
            </p>
          </div>
          <FooterMenu title="Explore" location="footer" />
          <div className="space-y-2.5">
            <p className="eyebrow text-ink-foreground/55">Contact</p>
            {contact.phone ? (
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-ink-foreground/80">
                <Phone className="size-3.5" /> {contact.phone}
              </a>
            ) : null}
            {contact.email ? (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-ink-foreground/80">
                <Mail className="size-3.5" /> {contact.email}
              </a>
            ) : null}
            {wa ? (
              <a href={wa} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-ink-foreground/80">
                <MessageCircle className="size-3.5" /> {contact.whatsapp}
              </a>
            ) : null}
            {contact.address ? <p className="text-sm text-ink-foreground/70">{contact.address}</p> : null}
            {contact.business_hours ? <p className="text-sm text-ink-foreground/70">{contact.business_hours}</p> : null}
          </div>
          <div className="space-y-2.5">
            <p className="eyebrow text-ink-foreground/55">Follow</p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(social)
                .filter(([, url]) => !!url)
                .map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ink-foreground/80 capitalize hover:text-primary-foreground"
                  >
                    {name}
                  </a>
                ))}
            </div>
            {contact.countries_served ? (
              <p className="pt-2 text-sm text-ink-foreground/60">Serving {contact.countries_served}</p>
            ) : null}
          </div>
        </div>
        <div className="border-t border-ink-foreground/10 px-5 py-5 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 text-xs text-ink-foreground/55">
            <p>{footer.copyright || "© Limra Academy for Excellence."}</p>
            <Link to="/admin" className="hover:text-ink-foreground">
              Administrator login
            </Link>
          </div>
        </div>
      </footer>

      <FloatingWhatsApp href={wa} />
    </div>
  );
}

function FooterMenu({ title, location }: { title: string; location: "header" | "footer" }) {
  const { data: footerItems = [] } = useNavigation(location);
  const { data: headerItems = [] } = useNavigation("header");
  const items = footerItems.length ? footerItems : headerItems;

  return (
    <div className="space-y-2.5">
      <p className="eyebrow text-ink-foreground/55">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {items
          .filter((i) => !i.parent_id)
          .map((item) => (
            <li key={item.id}>
              <Link to={item.url as never} className="text-sm text-ink-foreground/80 hover:text-primary-foreground">
                {item.label}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string | undefined;
  title: string;
  intro?: string | null | undefined;
}) {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="text-balance-tight mt-3 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {intro ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
        ) : null}
      </div>
    </section>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
      <p className="font-display text-lg font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
