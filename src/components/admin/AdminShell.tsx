import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Building2,
  CalendarDays,
  Globe2,
  Home,
  Image,
  LayoutDashboard,
  Layers,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Navigation as NavIcon,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/programs", label: "Programs", icon: Layers },
  { to: "/admin/topics", label: "Training Topics", icon: Sparkles },
  { to: "/admin/trainers", label: "Trainers", icon: Users },
  { to: "/admin/institutions", label: "Institutions", icon: Building2 },
  { to: "/admin/countries", label: "Countries", icon: Globe2 },
  { to: "/admin/media", label: "Media Library", icon: Image },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/workshops", label: "Workshops", icon: CalendarDays },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/navigation", label: "Navigation", icon: NavIcon, superAdmin: true },
  { to: "/admin/seo", label: "SEO", icon: Search, superAdmin: true },
  { to: "/admin/settings", label: "Settings", icon: Settings, superAdmin: true },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const { loading, session, isStaff, isSuperAdmin, user } = useAdminAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading admin panel…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-muted/30 px-4 text-center">
        <p className="text-base font-medium">Please sign in to continue.</p>
        <Button onClick={() => navigate({ to: "/admin", replace: true })}>Go to admin login</Button>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-muted/30 px-4 text-center">
        <h1 className="text-lg font-semibold">No admin access</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This account is signed in but has not been granted an administrator role. Ask a Super Admin to grant access.
        </p>
        <Button variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin", replace: true });
  }

  const items = NAV_ITEMS.filter((item) => !("superAdmin" in item && item.superAdmin) || isSuperAdmin);

  return (
    <div className="min-h-screen bg-muted/30">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm font-semibold tracking-wide">LIMRA ADMIN</p>
            <p className="text-[11px] text-sidebar-foreground/60">Content management</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
        <nav className="space-y-0.5 px-2 pb-8">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {open ? (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="size-4" />
          </Button>
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search this page…" className="pl-8" disabled />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary">{isSuperAdmin ? "Super Admin" : "Content Manager"}</Badge>
            <span className="hidden max-w-40 truncate text-sm text-muted-foreground sm:inline">{user?.email}</span>
            <Button asChild variant="outline" size="sm">
              <Link to="/" target="_blank">
                View site
              </Link>
            </Button>
            <Button variant="ghost" size="icon" title="Sign out" onClick={() => void signOut()}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
