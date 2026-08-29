import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Limra Academy CMS" },
      { name: "description", content: "Branding, contact details, social links and administrator access." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Settings — Limra Academy CMS" },
      { property: "og:description", content: "Site settings and admin users." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

type FieldSpec = { name: string; label: string; type?: "text" | "textarea" | "image"; placeholder?: string };

const GROUPS: { key: string; title: string; description: string; fields: FieldSpec[] }[] = [
  {
    key: "branding",
    title: "Branding",
    description: "Logo, site name and tagline used across the website.",
    fields: [
      { name: "site_name", label: "Site name", placeholder: "Limra Academy for Excellence" },
      { name: "tagline", label: "Tagline", placeholder: "Training minds across borders" },
      { name: "logo_url", label: "Logo", type: "image" },
      { name: "footer_note", label: "Footer note", type: "textarea" },
    ],
  },
  {
    key: "contact",
    title: "Contact details",
    description: "Shown on the contact page and in the footer.",
    fields: [
      { name: "phone", label: "Phone", placeholder: "+91 90000 00000" },
      { name: "email", label: "Email", placeholder: "info@limraacademy.com" },
      { name: "whatsapp", label: "WhatsApp number", placeholder: "+91 90000 00000" },
      { name: "address", label: "Address", type: "textarea" },
      { name: "business_hours", label: "Business hours", placeholder: "Mon–Sat, 9am–6pm" },
      { name: "countries_served", label: "Countries served", placeholder: "India, Malaysia, UAE…" },
      { name: "map_embed_url", label: "Google Maps embed URL" },
    ],
  },
  {
    key: "social",
    title: "Social links",
    description: "Leave a field empty to hide that icon.",
    fields: [
      { name: "facebook", label: "Facebook URL" },
      { name: "instagram", label: "Instagram URL" },
      { name: "linkedin", label: "LinkedIn URL" },
      { name: "youtube", label: "YouTube URL" },
      { name: "twitter", label: "X / Twitter URL" },
    ],
  },
  {
    key: "seo_defaults",
    title: "Default SEO",
    description: "Used when a page has no specific SEO entry.",
    fields: [
      { name: "default_title", label: "Default page title" },
      { name: "default_description", label: "Default meta description", type: "textarea" },
      { name: "default_og_image", label: "Default social preview image", type: "image" },
      { name: "google_analytics_id", label: "Google Analytics ID", placeholder: "G-XXXXXXX" },
    ],
  },
];

function GroupEditor({ group }: { group: (typeof GROUPS)[number] }) {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "site_settings", group.key],
    queryFn: async () => {
      const { data: row } = await supabase.from("site_settings").select("value").eq("key", group.key).maybeSingle();
      return (row?.value ?? {}) as Record<string, string>;
    },
  });
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: group.key, value: values }, { onConflict: "key" });
      if (error) throw new Error("Could not save these settings. Please try again.");
    },
    onSuccess: () => {
      toast.success(`${group.title} saved.`);
      void queryClient.invalidateQueries({ queryKey: ["admin", "site_settings", group.key] });
      void queryClient.invalidateQueries({ queryKey: ["public", "site_settings"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Save failed"),
  });

  return (
    <div className="space-y-5 rounded-lg border border-border bg-card p-5">
      <div>
        <h2 className="font-display text-lg">{group.title}</h2>
        <p className="text-sm text-muted-foreground">{group.description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {group.fields.map((field) => (
          <div key={field.name} className={field.type === "textarea" || field.type === "image" ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
            <Label>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea
                rows={3}
                value={values[field.name] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
              />
            ) : field.type === "image" ? (
              <ImagePicker
                value={values[field.name] ?? null}
                onChange={(url) => setValues((prev) => ({ ...prev, [field.name]: typeof url === "string" ? url : "" }))}
                defaultCategory="Homepage"
              />
            ) : (
              <Input
                value={values[field.name] ?? ""}
                placeholder={field.placeholder}
                maxLength={300}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

function UsersPanel() {
  const queryClient = useQueryClient();
  const { user } = useAdminAuth();

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ["admin", "staff"],
    queryFn: async () => {
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("id, email, full_name, created_at").order("created_at"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      const roleMap = new Map<string, string>();
      ((roles ?? []) as { user_id: string; role: string }[]).forEach((r) => roleMap.set(r.user_id, r.role));
      return ((profiles ?? []) as { id: string; email: string | null; full_name: string | null }[]).map((p) => ({
        ...p,
        role: roleMap.get(p.id) ?? null,
      }));
    },
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      if (role === "none") {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId);
        if (error) throw new Error("Could not remove access.");
        return;
      }
      await supabase.from("user_roles").delete().eq("user_id", userId);
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role as "super_admin" | "content_manager" });
      if (error) throw new Error("Could not update this role.");
    },
    onSuccess: () => {
      toast.success("Access updated.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "staff"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Update failed"),
  });

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-5">
      <div>
        <h2 className="font-display text-lg">Administrator access</h2>
        <p className="text-sm text-muted-foreground">
          Anyone who creates an account appears here. Grant Super Admin or Content Manager access, or remove it.
        </p>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading accounts…</p>
      ) : (
        <ul className="divide-y divide-border">
          {staff.map((person) => (
            <li key={person.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium">{person.full_name || person.email}</p>
                <p className="text-xs text-muted-foreground">{person.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {person.id === user?.id ? <Badge variant="secondary">You</Badge> : null}
                <Select
                  value={person.role ?? "none"}
                  onValueChange={(role) => setRole.mutate({ userId: person.id, role })}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="content_manager">Content Manager</SelectItem>
                    <SelectItem value="none">No access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SettingsPage() {
  const { isSuperAdmin } = useAdminAuth();

  return (
    <AdminShell>
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-2xl">Settings</h1>
          <p className="text-sm text-muted-foreground">Branding, contact details, social links and access.</p>
        </header>

        <Tabs defaultValue="branding">
          <TabsList className="flex-wrap">
            {GROUPS.map((group) => (
              <TabsTrigger key={group.key} value={group.key}>
                {group.title}
              </TabsTrigger>
            ))}
            {isSuperAdmin ? <TabsTrigger value="users">Users</TabsTrigger> : null}
          </TabsList>
          {GROUPS.map((group) => (
            <TabsContent key={group.key} value={group.key} className="mt-6">
              <GroupEditor group={group} />
            </TabsContent>
          ))}
          {isSuperAdmin ? (
            <TabsContent value="users" className="mt-6">
              <UsersPanel />
            </TabsContent>
          ) : null}
        </Tabs>
      </div>
    </AdminShell>
  );
}
