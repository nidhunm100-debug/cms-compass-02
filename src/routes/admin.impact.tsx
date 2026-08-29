import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { impactStatsResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/impact")({
  head: () => ({
    meta: [
      { title: "Impact Statistics — Limra Academy CMS" },
      { name: "description", content: "Edit the impact numbers shown on the homepage and Our Impact page." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Impact Statistics — Limra Academy CMS" },
      { property: "og:description", content: "Manage the published impact figures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={impactStatsResource} />
    </AdminShell>
  ),
});
