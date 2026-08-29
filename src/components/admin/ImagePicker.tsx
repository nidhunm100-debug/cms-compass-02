import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Search, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { MEDIA_CATEGORIES, deleteMedia, uploadImage, validateImage } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { cn } from "@/lib/utils";

export type MediaAsset = {
  id: string;
  url: string;
  storage_path: string;
  title: string | null;
  alt_text: string | null;
  caption: string | null;
  category: string;
  created_at: string;
};

export function useMediaLibrary(search: string, category: string) {
  return useQuery({
    queryKey: ["media_assets", search, category],
    queryFn: async () => {
      let q = supabase
        .from("media_assets")
        .select("id, url, storage_path, title, alt_text, caption, category, created_at")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(300);
      if (search.trim()) q = q.or(`title.ilike.%${search}%,alt_text.ilike.%${search}%,caption.ilike.%${search}%`);
      if (category !== "all") q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as MediaAsset[];
    },
  });
}

export function MediaDropzone({
  category,
  onUploaded,
  compact,
}: {
  category: string;
  onUploaded?: (assets: MediaAsset[]) => void;
  compact?: boolean;
}) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;
      const invalid = list.map(validateImage).find(Boolean);
      if (invalid) {
        toast.error(invalid);
        return;
      }
      setBusy(true);
      const uploaded: MediaAsset[] = [];
      try {
        for (const file of list) {
          const result = await uploadImage(file, { category });
          uploaded.push({
            id: result.id,
            url: result.url,
            storage_path: result.storage_path,
            title: file.name,
            alt_text: null,
            caption: null,
            category,
            created_at: new Date().toISOString(),
          });
        }
        toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
        void queryClient.invalidateQueries({ queryKey: ["media_assets"] });
        void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        onUploaded?.(uploaded);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Image upload failed. Please try again.");
      } finally {
        setBusy(false);
      }
    },
    [category, onUploaded, queryClient],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 text-center transition-colors",
        compact ? "p-4" : "p-8",
        dragging && "border-ring bg-accent/10",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && void handleFiles(e.target.files)}
      />
      {busy ? (
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      ) : (
        <UploadCloud className="size-6 text-muted-foreground" />
      )}
      <p className="text-sm font-medium">Drag &amp; drop images here</p>
      <p className="text-xs text-muted-foreground">JPG, PNG, WebP or SVG · up to 10MB each</p>
      <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
        Choose files
      </Button>
    </div>
  );
}

export function MediaGrid({
  assets,
  selected,
  onToggle,
  onDelete,
}: {
  assets: MediaAsset[];
  selected?: string[];
  onToggle?: (asset: MediaAsset) => void;
  onDelete?: (asset: MediaAsset) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {assets.map((asset) => {
        const isSelected = selected?.includes(asset.url);
        return (
          <div
            key={asset.id}
            className={cn(
              "group relative overflow-hidden rounded-lg border bg-card",
              isSelected ? "border-ring ring-2 ring-ring" : "border-border",
            )}
          >
            <button type="button" className="block w-full" onClick={() => onToggle?.(asset)}>
              <img
                src={asset.url}
                alt={asset.alt_text ?? asset.title ?? "Media library image"}
                loading="lazy"
                className="aspect-4/3 w-full object-cover"
              />
            </button>
            <div className="space-y-0.5 p-2">
              <p className="truncate text-xs font-medium">{asset.title ?? "Untitled"}</p>
              <p className="truncate text-[11px] text-muted-foreground">{asset.category}</p>
            </div>
            {onDelete ? (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 size-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onDelete(asset)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Single-image or multi-image field with upload + reuse from the library. */
export function ImagePicker({
  value,
  onChange,
  multiple,
  defaultCategory = "General",
}: {
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  multiple?: boolean;
  defaultCategory?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [uploadCategory, setUploadCategory] = useState(defaultCategory);
  const { data: assets = [], isLoading } = useMediaLibrary(search, category);

  const values = multiple ? ((value as string[] | null) ?? []) : value ? [value as string] : [];

  const toggle = (asset: MediaAsset) => {
    if (multiple) {
      const next = values.includes(asset.url) ? values.filter((v) => v !== asset.url) : [...values, asset.url];
      onChange(next);
    } else {
      onChange(asset.url);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      {values.length ? (
        <div className="flex flex-wrap gap-2">
          {values.map((url) => (
            <div key={url} className="relative">
              <img src={url} alt="Selected" className="size-20 rounded-md border border-border object-cover" />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute -top-2 -right-2 size-6"
                onClick={() =>
                  multiple ? onChange(values.filter((v) => v !== url)) : onChange(null)
                }
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <ImagePlus className="mr-2 size-4" />
        {values.length ? "Change image" : multiple ? "Add images" : "Select image"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Media library</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="library">
            <TabsList>
              <TabsTrigger value="library">Choose existing</TabsTrigger>
              <TabsTrigger value="upload">Upload new</TabsTrigger>
            </TabsList>
            <TabsContent value="library" className="space-y-3 pt-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search images"
                    className="pl-8"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="sm:w-56">
                    <SelectValue placeholder="All categories" />
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
                <p className="py-8 text-center text-sm text-muted-foreground">Loading images…</p>
              ) : assets.length ? (
                <MediaGrid assets={assets} selected={values} onToggle={toggle} />
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm font-medium">No images yet.</p>
                  <p className="text-xs text-muted-foreground">Upload your first workshop image.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="upload" className="space-y-3 pt-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
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
              <MediaDropzone
                category={uploadCategory}
                onUploaded={(uploaded) => {
                  if (!uploaded.length) return;
                  if (multiple) onChange([...values, ...uploaded.map((u) => u.url)]);
                  else {
                    onChange(uploaded[0]!.url);
                    setOpen(false);
                  }
                }}
              />
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button type="button" onClick={() => setOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function MediaDeleteDialog({
  asset,
  onClose,
}: {
  asset: MediaAsset | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      if (!asset) return;
      await deleteMedia(asset.id, asset.storage_path);
    },
    onSuccess: () => {
      toast.success("Image deleted");
      void queryClient.invalidateQueries({ queryKey: ["media_assets"] });
      onClose();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not delete image"),
  });

  return (
    <AlertDialog open={!!asset} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this image?</AlertDialogTitle>
          <AlertDialogDescription>
            The image will be removed from the library and from any section that uses it. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
