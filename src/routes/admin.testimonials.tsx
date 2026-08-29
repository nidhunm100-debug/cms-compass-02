import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { testimonialsResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Limra Academy CMS" },
      { name: "description", content: "Manage testimonials from principals, teachers, students and corporate clients." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Testimonials — Limra Academy CMS" },
      { property: "og:description", content: "Manage published testimonials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AdminShell>
      <ResourceManager config={testimonialsResource} />
    </AdminShell>
  ),
});
