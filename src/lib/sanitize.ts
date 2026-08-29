/**
 * Minimal HTML sanitiser for rich-text stored by the CMS editor.
 * Strips scripts, styles, iframes, event handlers and javascript: URLs before
 * the content is rendered on the public website.
 */
export function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*\/?>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}

export function stripHtml(input: string | null | undefined): string {
  return (input ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
