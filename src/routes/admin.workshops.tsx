import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { workshopsResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/workshops")({
  head: () => ({
    meta: [
      { title: "Workshops — Limra Academy CMS" },
      { name: "description", content: "Publish upcoming workshops and archive completed training events." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Workshops — Limra Academy CMS" },
      { property: "og:description", content: "Manage workshops and events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={workshopsResource} />
    </AdminShell>
  ),
});
