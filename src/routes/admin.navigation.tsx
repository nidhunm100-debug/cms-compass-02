import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { navigationResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/navigation")({
  head: () => ({
    meta: [
      { title: "Navigation — Limra Academy CMS" },
      { name: "description", content: "Manage the website header and footer menus." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Navigation — Limra Academy CMS" },
      { property: "og:description", content: "Manage menus and menu order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={navigationResource} />
    </AdminShell>
  ),
});
