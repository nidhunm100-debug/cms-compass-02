import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { MediaDropzone, useMediaLibrary } from "@/components/admin/ImagePicker";
import { MEDIA_CATEGORIES, deleteMedia } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [
      { title: "Media Library — Limra Academy CMS" },
      { name: "description", content: "Upload, organise and reuse photographs across the Limra Academy website." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Media Library — Limra Academy CMS" },
      { property: "og:description", content: "Central image library for the website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MediaPage,
});

function MediaPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [uploadCategory, setUploadCategory] = useState<string>(MEDIA_CATEGORIES[0]);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; storage_path: string } | null>(null);

  const { data: assets = [], isLoading } = useMediaLibrary(search, category);

  const remove = useMutation({
    mutationFn: async (asset: { id: string; storage_path: string }) => deleteMedia(asset.id, asset.storage_path),
    onSuccess: () => {
      toast.success("Image deleted.");
      void queryClient.invalidateQueries({ queryKey: ["media_assets"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Delete failed"),
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-2xl">Media Library</h1>
          <p className="text-sm text-muted-foreground">
            Upload images once and reuse them anywhere. JPG, PNG, WebP or SVG up to 10MB.
          </p>
        </header>

        <section className="space-y-3 rounded-lg border border-border bg-card p-5">
          <div className="max-w-xs space-y-1.5">
            <Label>Upload into category</Label>
            <Select value={uploadCategory} onValueChange={setUploadCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEDIA_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <MediaDropzone category={uploadCategory} />
        </section>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, caption or alt text"
              className="pl-8"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {MEDIA_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading media…</p>
        ) : assets.length ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {assets.map((asset) => (
              <li key={asset.id} className="overflow-hidden rounded-lg border border-border bg-card">
                <img src={asset.url} alt={asset.alt_text ?? asset.title ?? ""} loading="lazy" className="aspect-square w-full object-cover" />
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs font-medium">{asset.title ?? "Untitled"}</p>
                  <p className="text-[11px] text-muted-foreground">{asset.category}</p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        void navigator.clipboard.writeText(asset.url);
                        toast.success("Image link copied.");
                      }}
                    >
                      <Copy className="mr-1 size-3.5" /> Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-destructive"
                      onClick={() => setPendingDelete({ id: asset.id, storage_path: asset.storage_path })}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <p className="font-display text-lg">No images yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">Upload your first images using the box above.</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              The image will be removed from the library and from any page that uses it. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) remove.mutate(pendingDelete);
                setPendingDelete(null);
              }}
            >
              Delete image
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminShell>
  );
}
