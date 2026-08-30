import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { PublicLayout, whatsappHref } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { Eyebrow, Rise, Shell } from "@/components/site/premium";
import { CTASection } from "@/components/site/ui-kit";
import {
  CertificateCard,
  CertificateViewer,
  useCertificateViewer,
} from "@/components/site/credentials";
import { useCredentials, useSiteSettings } from "@/lib/public-cms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/credentials")({
  head: () => ({
    meta: [
      { title: "Credentials & Certificates — Limra Academy for Excellence" },
      {
        name: "description",
        content:
          "Certificates, recognitions and appreciation letters awarded to Limra Academy for Excellence by universities, colleges and international conventions.",
      },
      { property: "og:title", content: "Credentials & Certificates — Limra Academy for Excellence" },
      {
        property: "og:description",
        content: "Recognition from universities, colleges and international conventions across six countries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CredentialsPage,
});

const ALL = "All";

function CredentialsPage() {
  const { data: credentials = [] } = useCredentials();
  const { data: settings = {} } = useSiteSettings();
  const wa = whatsappHref(settings.contact?.whatsapp);
  const viewer = useCertificateViewer();
  const [filter, setFilter] = useState<string>(ALL);

  const pageItems = useMemo(
    () => credentials.filter((c) => c.show_on_credentials_page),
    [credentials],
  );

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(pageItems.map((c) => c.category).filter(Boolean) as string[]))],
    [pageItems],
  );

  const visible = useMemo(
    () => (filter === ALL ? pageItems : pageItems.filter((c) => c.category === filter)),
    [pageItems, filter],
  );

  return (
    <PublicLayout overlay>
      <SeoHead pageKey="credentials" />

      <section className="relative isolate overflow-hidden bg-dark text-dark-foreground">
        <div aria-hidden className="royal-gradient absolute inset-0 -z-20" />
        <div aria-hidden className="side-veil absolute inset-0 -z-10" />
        <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-14 sm:px-8 sm:pt-36 sm:pb-20">
          <Rise className="max-w-3xl">
            <Eyebrow invert>Credentials</Eyebrow>
            <h1 className="display-lg mt-4 text-dark-foreground">Recognition from the rooms we train in.</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-dark-foreground/75 sm:text-lg">
              Certificates, recognitions and appreciation letters from universities, colleges, foundations and
              international conventions.
            </p>
            {pageItems.length ? (
              <p className="mt-8 text-sm font-semibold tracking-widest text-dark-foreground/55 uppercase">
                {pageItems.length} documented credentials
              </p>
            ) : null}
          </Rise>
        </div>
      </section>

      <Shell tone="white">
        {pageItems.length ? (
          <>
            {categories.length > 2 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter(c)}
                    className={cn(
                      "cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold tracking-wide transition-colors",
                      filter === c
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : null}

            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((c, i) => (
                <Rise as="li" key={c.id} delay={(i % 3) * 70}>
                  <CertificateCard
                    credential={c}
                    onOpen={() => viewer.open(visible.findIndex((v) => v.id === c.id))}
                  />
                </Rise>
              ))}
            </ul>
          </>
        ) : (
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Credentials will appear here once they are published from the admin panel.
          </p>
        )}
      </Shell>

      <CTASection
        title="Work with a recognised training team"
        body="Tell us your audience and objective — we will design the workshop around it."
        whatsappHref={wa}
      />

      <CertificateViewer
        credentials={visible}
        index={viewer.index}
        onClose={viewer.close}
        onIndexChange={viewer.setIndex}
      />
    </PublicLayout>
  );
}
