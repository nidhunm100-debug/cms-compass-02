import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { programsResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Limra Academy CMS" },
      { name: "description", content: "Manage training programs, audiences, topics and trainers." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Programs — Limra Academy CMS" },
      { property: "og:description", content: "Manage the training programs published on the website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={programsResource} />
    </AdminShell>
  ),
});
