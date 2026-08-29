import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Mail, Menu, MessageCircle, Phone, X } from "lucide-react";

import { useNavigation, useSiteSettings } from "@/lib/public-cms";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function whatsappHref(number: string) {
  const digits = number.replace(/[^0-9]/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

function NavLinks({ onNavigate, vertical }: { onNavigate?: () => void; vertical?: boolean }) {
  const { data: items = [] } = useNavigation("header");
  const parents = items.filter((i) => !i.parent_id);
  const childrenOf = (id: string) => items.filter((i) => i.parent_id === id);

  return (
    <ul className={cn("items-center gap-1", vertical ? "flex flex-col items-stretch gap-0.5" : "hidden lg:flex")}>
      {parents.map((item) => {
        const kids = childrenOf(item.id);
        return (
          <li key={item.id} className="group relative">
            <Link
              to={item.url as never}
              onClick={onNavigate}
              activeProps={{ className: "text-primary" }}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {item.label}
              {kids.length ? <ChevronDown className="size-3.5" /> : null}
            </Link>
            {kids.length ? (
              <ul
                className={cn(
                  "z-40 min-w-52 rounded-md border border-border bg-popover p-1 shadow-md",
                  vertical ? "ml-3" : "absolute left-0 hidden group-hover:block",
                )}
              >
                {kids.map((kid) => (
                  <li key={kid.id}>
                    <Link
                      to={kid.url as never}
                      onClick={onNavigate}
                      className="block rounded-sm px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary"
                    >
                      {kid.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const { data: settings = {} } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const contact = settings.contact ?? {};
  const branding = settings.branding ?? {};
  const social = settings.social ?? {};
  const footer = settings.footer ?? {};
  const wa = contact.whatsapp ? whatsappHref(contact.whatsapp) : "";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold tracking-tight">
              {branding.site_name || "Limra Academy"}
            </span>
          </Link>
          <nav className="ml-auto" aria-label="Main navigation">
            <NavLinks />
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {wa ? (
              <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
                <a href={wa} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-1.5 size-4" /> WhatsApp
                </a>
              </Button>
            ) : null}
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/contact">Book a workshop</Link>
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((v) => !v)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-border bg-background px-4 py-3 lg:hidden">
            <NavLinks vertical onNavigate={() => setOpen(false)} />
            <Button asChild className="mt-3 w-full" onClick={() => setOpen(false)}>
              <Link to="/contact">Book a workshop</Link>
            </Button>
          </div>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            {footer.logo_url ? (
              <img src={footer.logo_url} alt={branding.site_name || "Limra Academy"} className="h-10 w-auto" />
            ) : (
              <p className="font-display text-xl">{branding.site_name || "Limra Academy"}</p>
            )}
            <p className="text-sm text-ink-foreground/70">{footer.description || branding.tagline}</p>
          </div>
          <FooterMenu title="Quick links" location="footer" />
          <div className="space-y-2">
            <p className="eyebrow text-ink-foreground/60">Contact</p>
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
            {contact.business_hours ? (
              <p className="text-sm text-ink-foreground/70">{contact.business_hours}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <p className="eyebrow text-ink-foreground/60">Follow</p>
            <div className="flex flex-col gap-1.5">
              {Object.entries(social)
                .filter(([, url]) => !!url)
                .map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ink-foreground/80 capitalize hover:text-accent"
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
        <div className="border-t border-ink-foreground/10 px-4 py-5">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 text-xs text-ink-foreground/60">
            <p>{footer.copyright || "© Limra Academy for Excellence."}</p>
            <Link to="/admin" className="hover:text-accent">
              Administrator login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterMenu({ title, location }: { title: string; location: "header" | "footer" }) {
  const { data: footerItems = [] } = useNavigation(location);
  const { data: headerItems = [] } = useNavigation("header");
  const items = footerItems.length ? footerItems : headerItems;

  return (
    <div className="space-y-2">
      <p className="eyebrow text-ink-foreground/60">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {items
          .filter((i) => !i.parent_id)
          .map((item) => (
            <li key={item.id}>
              <Link to={item.url as never} className="text-sm text-ink-foreground/80 hover:text-accent">
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
  eyebrow?: string;
  title: string;
  intro?: string | null;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="font-display mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
        <span className="gold-rule mt-5" />
        {intro ? <p className="mt-5 max-w-2xl text-base text-muted-foreground">{intro}</p> : null}
      </div>
    </section>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
      <p className="font-display text-lg">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
