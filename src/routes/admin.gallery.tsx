import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { albumsResource, galleryImagesResource } from "@/lib/resources";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Limra Academy CMS" },
      { name: "description", content: "Manage workshop photographs, captions and albums." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Gallery — Limra Academy CMS" },
      { property: "og:description", content: "Manage gallery images and albums." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GalleryAdminPage,
});

function GalleryAdminPage() {
  return (
    <AdminShell>
      <Tabs defaultValue="images">
        <TabsList>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
        </TabsList>
        <TabsContent value="images" className="mt-6">
          <ResourceManager config={galleryImagesResource} />
        </TabsContent>
        <TabsContent value="albums" className="mt-6">
          <ResourceManager config={albumsResource} />
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}
