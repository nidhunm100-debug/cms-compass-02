import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { trainersResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/trainers")({
  head: () => ({
    meta: [
      { title: "Trainers — Limra Academy CMS" },
      { name: "description", content: "Add, edit and reorder the trainers shown on the Limra Academy website." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Trainers — Limra Academy CMS" },
      { property: "og:description", content: "Manage trainer profiles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={trainersResource} />
    </AdminShell>
  ),
});
