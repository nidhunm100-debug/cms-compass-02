import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/admin/homepage")({
  head: () => ({
    meta: [
      { title: "Homepage — Limra Academy CMS" },
      { name: "description", content: "Edit every homepage section, headline, image and call to action." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Homepage — Limra Academy CMS" },
      { property: "og:description", content: "Manage homepage content sections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomepageAdminPage,
});

type Section = {
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
  extra: { stats?: { value: string; label: string }[] } | null;
  enabled: boolean;
  display_order: number;
};

function SectionEditor({ section }: { section: Section }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Section>(section);

  useEffect(() => setDraft(section), [section]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("homepage_sections")
        .update({
          heading: draft.heading,
          subheading: draft.subheading,
          body: draft.body,
          image_url: draft.image_url,
          cta_text: draft.cta_text,
          cta_link: draft.cta_link,
          secondary_cta_text: draft.secondary_cta_text,
          secondary_cta_link: draft.secondary_cta_link,
          extra: draft.extra ?? {},
          enabled: draft.enabled,
        })
        .eq("id", draft.id);
      if (error) throw new Error("Could not save this section. Please try again.");
    },
    onSuccess: () => {
      toast.success(`${section.label} saved.`);
      void queryClient.invalidateQueries({ queryKey: ["admin", "homepage_sections"] });
      void queryClient.invalidateQueries({ queryKey: ["public", "homepage_sections"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Save failed"),
  });

  const set = <K extends keyof Section>(key: K, value: Section[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const stats = draft.extra?.stats ?? [];
  const setStats = (next: { value: string; label: string }[]) =>
    setDraft((prev) => ({ ...prev, extra: { ...(prev.extra ?? {}), stats: next } }));

  return (
    <div className="space-y-5 pt-2">
      <div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-3">
        <Switch checked={draft.enabled} onCheckedChange={(v) => set("enabled", v)} id={`enabled-${draft.id}`} />
        <Label htmlFor={`enabled-${draft.id}`} className="text-sm">
          Show this section on the homepage
        </Label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Heading</Label>
          <Input value={draft.heading ?? ""} onChange={(e) => set("heading", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Subheading</Label>
          <Input value={draft.subheading ?? ""} onChange={(e) => set("subheading", e.target.value)} />
        </div>
      </div>

      {draft.section_key === "hero" || draft.section_key === "about" || draft.section_key === "why_limra" ? (
        <div className="space-y-1.5">
          <Label>Body text</Label>
          <RichTextEditor value={draft.body ?? ""} onChange={(html) => set("body", html)} />
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label>Body text (optional)</Label>
          <Textarea rows={3} value={draft.body ?? ""} onChange={(e) => set("body", e.target.value)} />
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Section image</Label>
        <ImagePicker
          value={draft.image_url}
          onChange={(url) => set("image_url", url)}
          category="Homepage"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Button text</Label>
          <Input value={draft.cta_text ?? ""} onChange={(e) => set("cta_text", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Button link</Label>
          <Input
            value={draft.cta_link ?? ""}
            placeholder="/contact"
            onChange={(e) => set("cta_link", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Secondary button text</Label>
          <Input value={draft.secondary_cta_text ?? ""} onChange={(e) => set("secondary_cta_text", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Secondary button link</Label>
          <Input
            value={draft.secondary_cta_link ?? ""}
            placeholder="/programs"
            onChange={(e) => set("secondary_cta_link", e.target.value)}
          />
        </div>
      </div>

      {draft.section_key === "impact" ? (
        <div className="space-y-3 rounded-md border border-border p-4">
          <div className="flex items-center justify-between">
            <Label>Impact statistics</Label>
            <Button type="button" size="sm" variant="outline" onClick={() => setStats([...stats, { value: "", label: "" }])}>
              <Plus className="mr-1.5 size-4" /> Add statistic
            </Button>
          </div>
          {stats.length ? (
            <ul className="space-y-2">
              {stats.map((stat, index) => (
                <li key={index} className="flex items-end gap-2">
                  <div className="w-32 space-y-1.5">
                    <Label className="text-xs">Number</Label>
                    <Input
                      value={stat.value}
                      placeholder="60,500"
                      onChange={(e) => {
                        const next = [...stats];
                        next[index] = { ...stat, value: e.target.value };
                        setStats(next);
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={stat.label}
                      placeholder="Employees & managers trained"
                      onChange={(e) => {
                        const next = [...stats];
                        next[index] = { ...stat, label: e.target.value };
                        setStats(next);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Remove statistic"
                    onClick={() => setStats(stats.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add numbers such as “60,500 employees & managers trained”.
            </p>
          )}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save section"}
        </Button>
      </div>
    </div>
  );
}

function HomepageAdminPage() {
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["admin", "homepage_sections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("homepage_sections").select("*").order("display_order");
      if (error) throw error;
      return (data ?? []) as Section[];
    },
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-2xl">Homepage</h1>
          <p className="text-sm text-muted-foreground">
            Open a section to edit its text, image and buttons. Turn a section off to hide it from the website.
          </p>
        </header>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading sections…</p>
        ) : (
          <Accordion type="single" collapsible className="rounded-lg border border-border bg-card px-4">
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>
                  <span className="flex items-center gap-2 text-left">
                    {section.enabled ? (
                      <Eye className="size-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="size-4 text-muted-foreground" />
                    )}
                    <span>
                      {section.label}
                      {!section.enabled ? (
                        <span className="ml-2 text-xs text-muted-foreground">(hidden)</span>
                      ) : null}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <SectionEditor section={section} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </AdminShell>
  );
}
