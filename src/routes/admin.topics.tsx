import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { topicsResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/topics")({
  head: () => ({
    meta: [
      { title: "Training Topics — Limra Academy CMS" },
      { name: "description", content: "Manage the training topics used across programs and trainer profiles." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Training Topics — Limra Academy CMS" },
      { property: "og:description", content: "Manage reusable training topics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={topicsResource} />
    </AdminShell>
  ),
});
