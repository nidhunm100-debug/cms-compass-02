import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { PageHeader, PublicLayout } from "@/components/site/PublicLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { usePrograms, useSiteSettings } from "@/lib/public-cms";
import { COUNTRY_OPTIONS } from "@/lib/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Limra Academy — Book a Workshop" },
      {
        name: "description",
        content:
          "Enquire about Limra Academy workshops for your school, college, university or organization. Share your requirement and we will respond.",
      },
      { property: "og:title", content: "Contact Limra Academy" },
      { property: "og:description", content: "Book a student, teacher or corporate training workshop." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const enquirySchema = z.object({
  name: z.string().trim().min(2, { message: "Please enter your name" }).max(120),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  designation: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(60).optional().or(z.literal("")),
  training_requirement: z.string().trim().max(200).optional().or(z.literal("")),
  preferred_date: z.string().optional().or(z.literal("")),
  participants: z.string().optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const EMPTY = {
  name: "",
  organization: "",
  designation: "",
  email: "",
  phone: "",
  whatsapp: "",
  country: "",
  training_requirement: "",
  preferred_date: "",
  participants: "",
  message: "",
};

function ContactPage() {
  const { data: settings = {} } = useSiteSettings();
  const { data: programs = [] } = usePrograms();
  const [form, setForm] = useState({ ...EMPTY });
  const contact = settings.contact ?? {};
  const waDigits = (contact.whatsapp ?? "").replace(/[^0-9]/g, "");

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = enquirySchema.safeParse(form);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
      }
      const values = parsed.data;
      const { error } = await supabase.from("enquiries").insert({
        name: values.name,
        organization: values.organization || null,
        designation: values.designation || null,
        email: values.email,
        phone: values.phone || null,
        whatsapp: values.whatsapp || null,
        country: values.country || null,
        training_requirement: values.training_requirement || null,
        preferred_date: values.preferred_date || null,
        participants: values.participants ? Number(values.participants) : null,
        message: values.message || null,
      });
      if (error) throw new Error("We could not send your enquiry. Please try again.");
    },
    onSuccess: () => {
      toast.success("Thank you — your enquiry has been sent.");
      setForm({ ...EMPTY });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Something went wrong"),
  });

  const set = (key: keyof typeof EMPTY) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <PublicLayout>
      <SeoHead pageKey="contact" />
      <PageHeader
        eyebrow="Contact"
        title="Let's Talk About Your Training Requirement"
        intro="Tell us about your institution and requirement. We will get back to you."
      />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <form
          className="grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2 sm:p-8 lg:order-2"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={form.name} maxLength={120} onChange={(e) => set("name")(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" value={form.organization} maxLength={160} onChange={(e) => set("organization")(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="designation">Designation</Label>
            <Input id="designation" value={form.designation} maxLength={120} onChange={(e) => set("designation")(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={form.email} maxLength={255} onChange={(e) => set("email")(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} maxLength={40} onChange={(e) => set("phone")(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" value={form.whatsapp} maxLength={40} onChange={(e) => set("whatsapp")(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Select value={form.country} onValueChange={set("country")}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Training requirement</Label>
            <Select value={form.training_requirement} onValueChange={set("training_requirement")}>
              <SelectTrigger>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
                <SelectItem value="Other">Other / not sure yet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="preferred_date">Preferred date</Label>
            <Input id="preferred_date" type="date" value={form.preferred_date} onChange={(e) => set("preferred_date")(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="participants">Number of participants</Label>
            <Input
              id="participants"
              type="number"
              min={1}
              max={100000}
              value={form.participants}
              onChange={(e) => set("participants")(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} maxLength={2000} value={form.message} onChange={(e) => set("message")(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="rounded-full px-6 font-semibold" disabled={mutation.isPending}>
              {mutation.isPending ? "Sending…" : "Request a workshop"}
            </Button>
          </div>
        </form>

        <aside className="space-y-4 self-start rounded-3xl bg-surface p-6 sm:p-8 lg:order-1">
          <p className="eyebrow">Reach us</p>
          {contact.phone ? (
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm">
              <Phone className="size-4 text-primary" /> {contact.phone}
            </a>
          ) : null}
          {contact.email ? (
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm">
              <Mail className="size-4 text-primary" /> {contact.email}
            </a>
          ) : null}
          {waDigits ? (
            <a
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm"
            >
              <MessageCircle className="size-4 text-primary" /> {contact.whatsapp}
            </a>
          ) : null}
          {contact.address ? (
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {contact.address}
            </p>
          ) : null}
          {contact.business_hours ? <p className="text-sm text-muted-foreground">{contact.business_hours}</p> : null}
          {contact.countries_served ? (
            <p className="text-sm text-muted-foreground">Countries served: {contact.countries_served}</p>
          ) : null}
          {!contact.phone && !contact.email && !waDigits ? (
            <p className="text-sm text-muted-foreground">
              Contact details can be added in the admin panel under Settings → Contact.
            </p>
          ) : null}
        </aside>
      </section>
    </PublicLayout>
  );
}
