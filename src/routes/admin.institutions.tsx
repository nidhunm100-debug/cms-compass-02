import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { institutionsResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/institutions")({
  head: () => ({
    meta: [
      { title: "Institutions — Limra Academy CMS" },
      { name: "description", content: "Manage schools, colleges, universities and corporates trained by Limra Academy." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Institutions — Limra Academy CMS" },
      { property: "og:description", content: "Manage partner institutions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={institutionsResource} />
    </AdminShell>
  ),
});
