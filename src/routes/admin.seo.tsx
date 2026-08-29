import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { seoResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/seo")({
  head: () => ({
    meta: [
      { title: "SEO — Limra Academy CMS" },
      { name: "description", content: "Manage page titles, meta descriptions and social preview images." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "SEO — Limra Academy CMS" },
      { property: "og:description", content: "Per-page SEO settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={seoResource} />
    </AdminShell>
  ),
});
