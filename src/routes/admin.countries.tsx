import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { countriesResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/countries")({
  head: () => ({
    meta: [
      { title: "Countries — Limra Academy CMS" },
      { name: "description", content: "Manage the countries and regions shown on the global reach page." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Countries — Limra Academy CMS" },
      { property: "og:description", content: "Manage countries and training counts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={countriesResource} />
    </AdminShell>
  ),
});
