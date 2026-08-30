import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { credentialsResource } from "@/lib/resources";

export const Route = createFileRoute("/admin/credentials")({
  head: () => ({
    meta: [
      { title: "Credentials — Limra Academy CMS" },
      { name: "description", content: "Manage certificates and appreciation letters." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCredentialsPage,
});

function AdminCredentialsPage() {
  return (
    <AdminShell>
      <ResourceManager config={credentialsResource} />
    </AdminShell>
  );
}
