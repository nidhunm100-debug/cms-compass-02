import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageHeader, PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { useGalleryAlbums, useGalleryImages } from "@/lib/public-cms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Workshop Gallery — Limra Academy" },
      {
        name: "description",
        content: "Photographs from Limra Academy student, teacher, corporate and international training workshops.",
      },
      { property: "og:title", content: "Workshop Gallery — Limra Academy" },
      { property: "og:description", content: "Moments from Limra Academy workshops around the world." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: images = [], isLoading } = useGalleryImages();
  const { data: albums = [] } = useGalleryAlbums();
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const categories = Array.from(new Set(images.map((i) => i.category).filter(Boolean))) as string[];
  const filtered = filter === "all" ? images : images.filter((i) => i.category === filter);
  const activeImage = images.find((i) => i.id === lightbox);

  return (
    <PublicLayout>
      <SeoHead pageKey="gallery" />
      <PageHeader eyebrow="Gallery" title="Moments from Our Workshops" intro="Real photographs from Limra training sessions." />
      <section className="mx-auto max-w-6xl px-4 py-14">
        {categories.length ? (
          <div className="mb-8 flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        ) : null}

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading gallery…</p>
        ) : filtered.length ? (
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {filtered.map((image) => (
              <figure key={image.id} className="mb-3 break-inside-avoid">
                <button type="button" onClick={() => setLightbox(image.id)} className="block w-full">
                  <img
                    src={image.image_url}
                    alt={image.alt_text ?? image.title ?? "Limra Academy workshop"}
                    loading="lazy"
                    className={cn("w-full rounded-lg border border-border object-cover transition-opacity hover:opacity-90")}
                  />
                </button>
                {image.caption ? (
                  <figcaption className="mt-1.5 text-xs text-muted-foreground">{image.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : (
          <EmptyState title="No gallery images yet." body="An administrator can upload workshop photographs in the admin panel." />
        )}

        {albums.length ? (
          <div className="mt-14">
            <h2 className="font-display text-2xl">Albums</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {albums.map((album) => (
                <li key={album.id} className="overflow-hidden rounded-lg border border-border bg-card">
                  {album.cover_image_url ? (
                    <img src={album.cover_image_url} alt={album.name} loading="lazy" className="aspect-16/9 w-full object-cover" />
                  ) : null}
                  <div className="p-4">
                    <p className="font-medium">{album.name}</p>
                    {album.category ? <p className="text-xs text-muted-foreground">{album.category}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <Dialog open={!!activeImage} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-4xl">
          {activeImage ? (
            <figure>
              <img
                src={activeImage.image_url}
                alt={activeImage.alt_text ?? activeImage.title ?? "Limra Academy workshop"}
                className="max-h-[75vh] w-full rounded-md object-contain"
              />
              <figcaption className="mt-3 text-sm text-muted-foreground">
                {[activeImage.title, activeImage.caption, activeImage.city, activeImage.country]
                  .filter(Boolean)
                  .join(" · ")}
              </figcaption>
            </figure>
          ) : null}
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
}
