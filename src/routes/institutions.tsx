import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Search } from "lucide-react";

import { EmptyState, PageHeader, PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { useInstitutions } from "@/lib/public-cms";
import { COUNTRY_OPTIONS, INSTITUTION_TYPES } from "@/lib/resources";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "Institutions We Have Trained — Limra Academy" },
      {
        name: "description",
        content:
          "Schools, colleges, universities and corporate organizations across Asia and the Middle East that have hosted Limra Academy training.",
      },
      { property: "og:title", content: "Institutions We Have Trained — Limra Academy" },
      { property: "og:description", content: "Our partner schools, colleges, universities and corporates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const { data: institutions = [], isLoading } = useInstitutions();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [country, setCountry] = useState("all");
  const [region, setRegion] = useState("all");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");

  const uniques = (values: (string | null)[]) =>
    Array.from(new Set(values.filter((v): v is string => !!v && v.trim().length > 0))).sort();
  const inCountry = institutions.filter((i) => country === "all" || i.country_name === country);
  const regionOptions = uniques(inCountry.map((i) => i.state_region));
  const cityOptions = uniques(
    inCountry.filter((i) => region === "all" || i.state_region === region).map((i) => i.city),
  );
  const categoryOptions = uniques(institutions.map((i) => i.training_category));

  const term = search.trim().toLowerCase();
  const filtered = institutions.filter((i) => {
    const matchesTerm = term
      ? [i.name, i.city, i.state_region, i.country_name, i.training_conducted]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term))
      : true;
    const matchesType = type === "all" || i.institution_type === type;
    const matchesCountry = country === "all" || i.country_name === country;
    const matchesRegion = region === "all" || i.state_region === region;
    const matchesCity = city === "all" || i.city === city;
    const matchesCategory = category === "all" || i.training_category === category;
    return matchesTerm && matchesType && matchesCountry && matchesRegion && matchesCity && matchesCategory;
  });

  return (
    <PublicLayout>
      <SeoHead pageKey="institutions" />
      <PageHeader
        eyebrow="Institutions"
        title="Institutions We Have Trained"
        intro="Schools, colleges, universities and corporate organizations that have hosted Limra workshops."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search institutions"
              className="pl-8"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {INSTITUTION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={country}
            onValueChange={(v) => {
              setCountry(v);
              setRegion("all");
              setCity("all");
            }}
          >
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {COUNTRY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6 flex flex-col gap-2 sm:flex-row">
          <Select
            value={region}
            onValueChange={(v) => {
              setRegion(v);
              setCity("all");
            }}
          >
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="All regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions / states</SelectItem>
              {regionOptions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cityOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="sm:w-56">
              <SelectValue placeholder="All training types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All training types</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="mb-6 text-sm text-muted-foreground">
          Showing {filtered.length} of {institutions.length} institutions
        </p>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading institutions…</p>
        ) : filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((institution) => (
              <article key={institution.id} className="overflow-hidden rounded-lg border border-border bg-card">
                {institution.cover_image_url ? (
                  <img
                    src={institution.cover_image_url}
                    alt={institution.name}
                    loading="lazy"
                    className="aspect-16/9 w-full object-cover"
                  />
                ) : null}
                <div className="space-y-2 p-5">
                  <div className="flex items-start gap-3">
                    {institution.logo_url ? (
                      <img
                        src={institution.logo_url}
                        alt=""
                        className="size-10 shrink-0 object-contain"
                        loading="lazy"
                      />
                    ) : null}
                    <div>
                      <h2 className="font-display text-lg leading-tight">{institution.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {[institution.city, institution.state_region, institution.country_name]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary">{institution.institution_type}</Badge>
                    {institution.training_category ? (
                      <Badge variant="outline">{institution.training_category}</Badge>
                    ) : null}
                    {institution.year ? <Badge variant="outline">{institution.year}</Badge> : null}
                  </div>
                  {institution.training_conducted ? (
                    <p className="text-sm text-muted-foreground">Training: {institution.training_conducted}</p>
                  ) : null}
                  {institution.website_url ? (
                    <a
                      href={institution.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary"
                    >
                      Visit website <ExternalLink className="size-3.5" />
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title={term || type !== "all" || country !== "all" || region !== "all" || city !== "all" || category !== "all" ? "No institutions match your filters." : "No institutions published yet."}
            body="An administrator can add institutions in the admin panel."
          />
        )}
      </section>
    </PublicLayout>
  );
}
