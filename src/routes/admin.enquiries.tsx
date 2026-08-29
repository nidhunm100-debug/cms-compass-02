import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { enquiriesResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries — Limra Academy CMS" },
      { name: "description", content: "Review, track and follow up website enquiries." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Enquiries — Limra Academy CMS" },
      { property: "og:description", content: "Manage incoming website enquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={enquiriesResource} />
    </AdminShell>
  ),
});
