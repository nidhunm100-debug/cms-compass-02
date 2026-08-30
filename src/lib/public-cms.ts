import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SettingsGroup = {
  [key: string]: string | undefined;
  site_name?: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  footer_note?: string;
  copyright?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  business_hours?: string;
  countries_served?: string;
  map_embed_url?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
  default_title?: string;
  default_description?: string;
  default_og_image?: string;
  google_analytics_id?: string;
};

export type SiteSettings = {
  [key: string]: SettingsGroup | undefined;
  branding?: SettingsGroup;
  contact?: SettingsGroup;
  social?: SettingsGroup;
  footer?: SettingsGroup;
  seo_defaults?: SettingsGroup;
};

export type HomepageSection = {
  id: string;
  section_key: string;
  label: string;
  heading: string | null;
  subheading: string | null;
  body: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  secondary_cta_text: string | null;
  secondary_cta_link: string | null;
  extra: Record<string, unknown>;
  enabled: boolean;
  display_order: number;
};

export type Trainer = {
  id: string;
  name: string;
  person_type: string | null;
  professional_title: string | null;
  qualification: string | null;
  position: string | null;
  short_bio: string | null;
  full_bio: string | null;
  photo_url: string | null;
  training_areas: string[];
  regions: string[];
  linkedin_url: string | null;
  featured: boolean;
};

export type Program = {
  id: string;
  slug: string | null;
  name: string;
  category: string | null;
  short_description: string | null;
  full_description: string | null;
  target_audience: string | null;
  duration: string | null;
  workshop_format: string | null;
  image_url: string | null;
  gallery_images: string[];
  cta_text: string | null;
  cta_link: string | null;
  featured: boolean;
};

export type ImpactStat = {
  id: string;
  value: string;
  label: string;
  description: string | null;
  icon: string | null;
};


export type Institution = {
  id: string;
  name: string;
  institution_type: string;
  country_name: string | null;
  state_region: string | null;
  city: string | null;
  website_url: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  training_conducted: string | null;
  training_category: string | null;
  year: number | null;
  description: string | null;
  featured: boolean;
};

export type Country = {
  id: string;
  name: string;
  code: string | null;
  flag_emoji: string | null;
  description: string | null;
  training_count: number | null;
  featured_image_url: string | null;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  title: string | null;
  caption: string | null;
  alt_text: string | null;
  category: string | null;
  city: string | null;
  country: string | null;
  taken_on: string | null;
  album_id: string | null;
  featured: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  designation: string | null;
  organization: string | null;
  country: string | null;
  photo_url: string | null;
  quote: string;
  rating: number | null;
};

export type Workshop = {
  id: string;
  name: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  country: string | null;
  city: string | null;
  description: string | null;
  image_url: string | null;
  registration_link: string | null;
  status: string;
};

export type TrainingTopic = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  topic_group: string | null;
  icon: string | null;
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["public", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      const map: SiteSettings = {};
      (data ?? []).forEach((row: { key: string; value: unknown }) => {
        map[row.key] = (row.value ?? {}) as SettingsGroup;
      });
      return map;
    },
  });
}

export function useNavigation(location: "header" | "footer" = "header") {
  return useQuery({
    queryKey: ["public", "navigation", location],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("navigation")
        .select("id, label, url, parent_id, display_order, visible, location")
        .eq("location", location)
        .eq("visible", true)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as {
        id: string;
        label: string;
        url: string;
        parent_id: string | null;
        display_order: number;
      }[];
    },
  });
}

export function useHomepageSections() {
  return useQuery({
    queryKey: ["public", "homepage_sections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("homepage_sections").select("*").order("display_order");
      if (error) throw error;
      const rows = (data ?? []) as HomepageSection[];
      const map: Record<string, HomepageSection> = {};
      rows.forEach((row) => {
        map[row.section_key] = row;
      });
      return { rows, map };
    },
  });
}

export function useTrainers(options: { featured?: boolean } = {}) {
  return useQuery({
    queryKey: ["public", "trainers", options.featured ?? false],
    queryFn: async () => {
      let q = supabase
        .from("trainers")
        .select(
          "id, name, person_type, professional_title, qualification, position, short_bio, full_bio, photo_url, training_areas, regions, linkedin_url, featured",
        )
        .eq("published", true)
        .is("deleted_at", null)
        .order("display_order");
      if (options.featured) q = q.eq("featured", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Trainer[];
    },
  });
}

export function usePrograms(options: { featured?: boolean } = {}) {
  return useQuery({
    queryKey: ["public", "programs", options.featured ?? false],
    queryFn: async () => {
      let q = supabase
        .from("programs")
        .select(
          "id, slug, name, category, short_description, full_description, target_audience, duration, workshop_format, image_url, gallery_images, cta_text, cta_link, featured",
        )
        .eq("published", true)
        .is("deleted_at", null)
        .order("display_order");
      if (options.featured) q = q.eq("featured", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Program[];
    },
  });
}

export function useInstitutions(options: { featured?: boolean } = {}) {
  return useQuery({
    queryKey: ["public", "institutions", options.featured ?? false],
    queryFn: async () => {
      let q = supabase
        .from("institutions")
        .select(
          "id, name, institution_type, country_name, state_region, city, website_url, logo_url, cover_image_url, training_conducted, training_category, year, description, featured",
        )
        .eq("published", true)
        .is("deleted_at", null)
        .order("display_order");
      if (options.featured) q = q.eq("featured", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Institution[];
    },
  });
}

export function useCountries() {
  return useQuery({
    queryKey: ["public", "countries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("countries")
        .select("id, name, code, flag_emoji, description, training_count, featured_image_url")
        .eq("published", true)
        .is("deleted_at", null)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as Country[];
    },
  });
}

export function useGalleryImages(options: { featured?: boolean; limit?: number } = {}) {
  return useQuery({
    queryKey: ["public", "gallery_images", options.featured ?? false, options.limit ?? 0],
    queryFn: async () => {
      let q = supabase
        .from("gallery_images")
        .select(
          "id, image_url, title, caption, alt_text, category, city, country, taken_on, album_id, featured",
        )
        .eq("published", true)
        .is("deleted_at", null)
        .order("display_order");
      if (options.featured) q = q.eq("featured", true);
      if (options.limit) q = q.limit(options.limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as GalleryImage[];
    },
  });
}

export function useGalleryAlbums() {
  return useQuery({
    queryKey: ["public", "gallery_albums"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_albums")
        .select("id, name, slug, description, cover_image_url, category")
        .eq("published", true)
        .is("deleted_at", null)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as { id: string; name: string; category: string | null; cover_image_url: string | null }[];
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, name, designation, organization, country, photo_url, quote, rating")
        .eq("published", true)
        .is("deleted_at", null)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as Testimonial[];
    },
  });
}

export function useWorkshops() {
  return useQuery({
    queryKey: ["public", "workshops"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workshops")
        .select(
          "id, name, event_date, start_time, end_time, location, country, city, description, image_url, registration_link, status",
        )
        .eq("published", true)
        .is("deleted_at", null)
        .order("event_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Workshop[];
    },
  });
}

export function useTrainingTopics() {
  return useQuery({
    queryKey: ["public", "training_topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_topics")
        .select("id, name, description, category, topic_group, icon")
        .eq("published", true)
        .is("deleted_at", null)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as TrainingTopic[];
    },
  });
}

export function useImpactStats() {
  return useQuery({
    queryKey: ["public", "impact_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_stats")
        .select("id, value, label, description, icon")
        .eq("published", true)
        .is("deleted_at", null)
        .order("display_order");
      if (error) throw error;
      return (data ?? []) as ImpactStat[];
    },
  });
}

export function useSeo(pageKey: string) {
  return useQuery({
    queryKey: ["public", "seo", pageKey],
    queryFn: async () => {
      const { data } = await supabase
        .from("seo_settings")
        .select("seo_title, meta_description, og_image_url, canonical_url, robots_index")
        .eq("page_key", pageKey)
        .maybeSingle();
      return data as {
        seo_title: string | null;
        meta_description: string | null;
        og_image_url: string | null;
        canonical_url: string | null;
        robots_index: boolean;
      } | null;
    },
  });
}

export type Credential = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  issuing_organization: string | null;
  certificate_date: string | null;
  year: number | null;
  category: string | null;
  alt_text: string | null;
  featured: boolean;
  show_on_homepage: boolean;
  show_on_credentials_page: boolean;
};

export function useCredentials(options: { featured?: boolean; homepage?: boolean } = {}) {
  return useQuery({
    queryKey: ["public", "credentials", options.featured ?? false, options.homepage ?? false],
    queryFn: async () => {
      let q = supabase
        .from("credentials")
        .select(
          "id, title, description, image_url, issuing_organization, certificate_date, year, category, alt_text, featured, show_on_homepage, show_on_credentials_page",
        )
        .eq("published", true)
        .is("deleted_at", null)
        .order("display_order");
      if (options.featured) q = q.eq("featured", true);
      if (options.homepage) q = q.eq("show_on_homepage", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Credential[];
    },
  });
}
