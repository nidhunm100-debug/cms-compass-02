import { useEffect } from "react";
import { useSeo } from "@/lib/public-cms";

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Applies the SEO values an administrator saved in the CMS on top of the
 * route's static head metadata.
 */
export function SeoHead({ pageKey }: { pageKey: string }) {
  const { data } = useSeo(pageKey);

  useEffect(() => {
    if (!data || typeof document === "undefined") return;
    if (data.seo_title) {
      document.title = data.seo_title;
      upsertMeta('meta[property="og:title"]', "property", "og:title", data.seo_title);
    }
    if (data.meta_description) {
      upsertMeta('meta[name="description"]', "name", "description", data.meta_description);
      upsertMeta('meta[property="og:description"]', "property", "og:description", data.meta_description);
    }
    if (data.og_image_url) {
      upsertMeta('meta[property="og:image"]', "property", "og:image", data.og_image_url);
      upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", data.og_image_url);
    }
    upsertMeta('meta[name="robots"]', "name", "robots", data.robots_index ? "index, follow" : "noindex, nofollow");
    if (data.canonical_url) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = data.canonical_url;
    }
  }, [data]);

  return null;
}
