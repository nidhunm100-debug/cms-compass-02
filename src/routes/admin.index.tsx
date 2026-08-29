import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — Limra Academy CMS" },
      { name: "description", content: "Secure sign-in for Limra Academy website administrators." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Sign In — Limra Academy CMS" },
      { property: "og:description", content: "Administrator access to the Limra Academy content management system." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLoginPage,
});

const credentialsSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(72),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { session, isStaff, loading } = useAdminAuth();
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isStaff) {
      navigate({ to: "/admin/dashboard", replace: true });
    }
  }, [loading, session, isStaff, navigate]);

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setBusy(false);
    if (error) {
      toast.error("Incorrect email or password.");
      return;
    }
    toast.success("Welcome back.");
    navigate({ to: "/admin/dashboard", replace: true });
  }

  async function handleForgot(event: React.FormEvent) {
    event.preventDefault();
    const parsed = z.string().trim().email().safeParse(email);
    if (!parsed.success) {
      toast.error("Please enter a valid email address");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error("Could not send the reset email. Please try again.");
      return;
    }
    toast.success("If that email is registered, a reset link is on its way.");
    setMode("signin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
      <div className="w-full max-w-sm rounded-xl border border-border/20 bg-card p-8 shadow-xl">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="size-5" />
          <p className="text-sm font-semibold tracking-wide">LIMRA ADMIN</p>
        </div>
        <h1 className="font-display mt-4 text-2xl">
          {mode === "signin" ? "Sign in to the CMS" : "Reset your password"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Manage website content, media and enquiries."
            : "We will email you a secure link to set a new password."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={mode === "signin" ? handleSignIn : handleForgot}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {mode === "signin" ? (
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                maxLength={72}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          ) : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Send reset link"}
          </Button>
        </form>

        <button
          type="button"
          className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => setMode(mode === "signin" ? "forgot" : "signin")}
        >
          {mode === "signin" ? "Forgot your password?" : "Back to sign in"}
        </button>

        {session && !isStaff ? (
          <p className="mt-6 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            You are signed in but this account has no administrator role yet. Ask a Super Admin to grant access.
          </p>
        ) : null}
      </div>
    </div>
  );
}
