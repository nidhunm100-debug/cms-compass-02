import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";

export const MEDIA_CATEGORIES = [
  "Student Workshops",
  "Teacher Training",
  "Corporate Training",
  "International Training",
  "Trainers",
  "Institutions",
  "Homepage",
  "General",
] as const;

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
const MAX_BYTES = 10 * 1024 * 1024;
// 10 years — the bucket is private, so display URLs are long-lived signed links.
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export type UploadResult = {
  id: string;
  url: string;
  storage_path: string;
};

export function safeFileName(original: string) {
  const dot = original.lastIndexOf(".");
  const ext = (dot > -1 ? original.slice(dot + 1) : "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = (dot > -1 ? original.slice(0, dot) : original)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${base || "image"}-${stamp}${rand}.${ext || "jpg"}`;
}

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Image upload failed. Please use JPG, PNG, WebP or SVG.";
  }
  if (file.size > MAX_BYTES) {
    return "Image upload failed. Please use a file under 10MB.";
  }
  return null;
}

async function readDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  if (typeof window === "undefined" || file.type === "image/svg+xml") {
    return { width: null, height: null };
  }
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: null, height: null });
    };
    img.src = url;
  });
}

/** Uploads one image and records it in the media library. */
export async function uploadImage(
  file: File,
  meta: { category?: string; title?: string; alt_text?: string; caption?: string; folder?: string } = {},
): Promise<UploadResult> {
  const problem = validateImage(file);
  if (problem) throw new Error(problem);

  const category = meta.category ?? "General";
  const path = `${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${safeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw new Error("Image upload failed. Please try again.");

  const { data: signed, error: signError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signError || !signed?.signedUrl) throw new Error("Image saved but could not be prepared for display.");

  const { width, height } = await readDimensions(file);
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      storage_path: path,
      url: signed.signedUrl,
      title: meta.title ?? file.name,
      alt_text: meta.alt_text ?? null,
      caption: meta.caption ?? null,
      category,
      folder: meta.folder ?? null,
      mime_type: file.type,
      file_size: file.size,
      width,
      height,
    })
    .select("id, url, storage_path")
    .single();

  if (error || !data) throw new Error("Image uploaded but could not be saved to the library.");
  return data as UploadResult;
}

export async function deleteMedia(id: string, storagePath: string) {
  await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw new Error("Could not delete this image. Please try again.");
}
