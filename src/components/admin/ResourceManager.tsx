import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { cn } from "@/lib/utils";

type Row = {
  id?: string;
  created_at?: string;
  updated_at?: string;
  slug?: string | null;
  deleted_at?: string | null;
  [key: string]: any;
};

/**
 * This engine works with table names chosen at runtime, so queries go through an
 * untyped view of the client. Database row-level security still enforces access.
 */
const db = supabase as unknown as { from: (table: string) => any };

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "switch"
  | "select"
  | "image"
  | "gallery"
  | "tags"
  | "date"
  | "time"
  | "relation"
  | "multirelation"
  | "readonly";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  relation?: { table: string; labelColumn: string };
  join?: { table: string; selfColumn: string; otherColumn: string };
  placeholder?: string;
  help?: string;
  required?: boolean;
  full?: boolean;
  mediaCategory?: string;
};

export type ResourceConfig = {
  table: string;
  title: string;
  singular: string;
  description?: string;
  fields: Field[];
  listPrimary: string;
  listSecondary?: string[];
  imageColumn?: string;
  searchColumns: string[];
  filters?: { column: string; label: string; options?: string[]; relation?: { table: string; labelColumn: string } }[];
  orderColumn?: string;
  publishColumn?: string;
  featuredColumn?: string;
  statusColumn?: string;
  softDelete?: boolean;
  duplicate?: boolean;
  canCreate?: boolean;
  previewPath?: string;
  emptyTitle: string;
  emptyBody: string;
  defaultValues?: Row;
};

function emptyValue(field: Field) {
  switch (field.type) {
    case "switch":
      return false;
    case "gallery":
    case "tags":
    case "multirelation":
      return [];
    case "number":
      return null;
    default:
      return "";
  }
}

function useRelationOptions(fields: Field[], filters: ResourceConfig["filters"]) {
  const specs = useMemo(() => {
    const map = new Map<string, string>();
    fields.forEach((f) => {
      if (f.relation) map.set(f.relation.table, f.relation.labelColumn);
      if (f.join) map.set(f.join.table, "id");
    });
    filters?.forEach((f) => {
      if (f.relation) map.set(f.relation.table, f.relation.labelColumn);
    });
    return Array.from(map.entries());
  }, [fields, filters]);

  return useQuery({
    queryKey: ["relation-options", specs.map(([t]) => t).join(",")],
    enabled: specs.length > 0,
    queryFn: async () => {
      const result: Record<string, { id: string; label: string }[]> = {};
      for (const [table, labelColumn] of specs) {
        if (labelColumn === "id") continue;
        const { data } = await db.from(table).select(`id, ${labelColumn}`).order(labelColumn);
        result[table] = ((data ?? []) as Row[]).map((r) => ({ id: r.id, label: r[labelColumn] ?? "Untitled" }));
      }
      return result;
    },
  });
}

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});
  const [joins, setJoins] = useState<Record<string, string[]>>({});
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const relationFields = useMemo(() => config.fields.filter((f) => f.relation), [config.fields]);
  const { data: relationOptions = {} } = useRelationOptions(config.fields, config.filters);

  const listQuery = useQuery({
    queryKey: [config.table, "admin-list", showArchived],
    queryFn: async () => {
      let q = db.from(config.table).select("*");
      if (config.softDelete) {
        q = showArchived ? q.not("deleted_at", "is", null) : q.is("deleted_at", null);
      }
      if (config.orderColumn) q = q.order(config.orderColumn, { ascending: true });
      q = q.order("created_at", { ascending: false });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const joinQuery = useQuery({
    queryKey: [config.table, "joins", editing?.id ?? "new"],
    enabled: !!editing?.id,
    queryFn: async () => {
      const result: Record<string, string[]> = {};
      for (const field of config.fields) {
        if (!field.join) continue;
        const { data } = await db
          .from(field.join.table)
          .select(field.join.otherColumn)
          .eq(field.join.selfColumn, editing!.id);
        result[field.name] = ((data ?? []) as Row[]).map((r) => r[field.join!.otherColumn]);
      }
      return result;
    },
  });

  const rows = useMemo(() => {
    let items = listQuery.data ?? [];
    const term = search.trim().toLowerCase();
    if (term) {
      items = items.filter((row) =>
        config.searchColumns.some((c) => String(row[c] ?? "").toLowerCase().includes(term)),
      );
    }
    Object.entries(filterValues).forEach(([column, value]) => {
      if (!value || value === "all") return;
      items = items.filter((row) => String(row[column] ?? "") === value);
    });
    return items;
  }, [listQuery.data, search, filterValues, config.searchColumns]);

  const openCreate = () => {
    const next: Row = { ...(config.defaultValues ?? {}) };
    config.fields.forEach((f) => {
      if (next[f.name] === undefined) next[f.name] = emptyValue(f);
    });
    setJoins({});
    setForm(next);
    setEditing({});
  };

  const openEdit = (row: Row) => {
    const next: Row = {};
    config.fields.forEach((f) => {
      next[f.name] = row[f.name] ?? emptyValue(f);
    });
    setForm(next);
    setJoins({});
    setEditing(row);
  };

  const effectiveJoins = useMemo(() => ({ ...(joinQuery.data ?? {}), ...joins }), [joinQuery.data, joins]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: Row = {};
      config.fields.forEach((f) => {
        if (f.type === "multirelation" || f.type === "readonly") return;
        let value = form[f.name];
        if (value === "") value = null;
        if (f.type === "number" && value !== null) value = Number(value);
        payload[f.name] = value;
      });

      let id = editing?.id as string | undefined;
      if (id) {
        const { error } = await db.from(config.table).update(payload).eq("id", id);
        if (error) throw error;
      } else {
        if (config.orderColumn) {
          payload[config.orderColumn] = (listQuery.data?.length ?? 0) + 1;
        }
        const { data, error } = await db.from(config.table).insert(payload).select("id").single();
        if (error) throw error;
        id = (data as Row).id;
      }

      for (const field of config.fields) {
        if (!field.join || !id) continue;
        const selected: string[] = effectiveJoins[field.name] ?? [];
        await db.from(field.join.table).delete().eq(field.join.selfColumn, id);
        if (selected.length) {
          await db
            .from(field.join.table)
            .insert(selected.map((other) => ({ [field.join!.selfColumn]: id, [field.join!.otherColumn]: other })));
        }
      }
    },
    onSuccess: () => {
      toast.success(`${config.singular} saved`);
      setEditing(null);
      void queryClient.invalidateQueries({ queryKey: [config.table] });
      void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      void queryClient.invalidateQueries({ queryKey: ["public"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : `Could not save this ${config.singular.toLowerCase()}`),
  });

  const patchMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Row }) => {
      const { error } = await db.from(config.table).update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [config.table] });
      void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      void queryClient.invalidateQueries({ queryKey: ["public"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not update"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (row: Row) => {
      if (config.softDelete && !showArchived) {
        const { error } = await db
          .from(config.table)
          .update({ deleted_at: new Date().toISOString(), ...(config.publishColumn ? { [config.publishColumn]: false } : {}) })
          .eq("id", row.id);
        if (error) throw error;
      } else {
        const { error } = await db.from(config.table).delete().eq("id", row.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(config.softDelete && !showArchived ? `${config.singular} archived` : `${config.singular} deleted`);
      setDeleteTarget(null);
      void queryClient.invalidateQueries({ queryKey: [config.table] });
      void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      void queryClient.invalidateQueries({ queryKey: ["public"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not delete"),
  });

  const duplicateMutation = useMutation({
    mutationFn: async (row: Row) => {
      const copy: Row = { ...row };
      delete copy.id;
      delete copy.created_at;
      delete copy.updated_at;
      if (copy.slug) copy.slug = `${copy.slug}-copy-${Date.now().toString(36)}`;
      copy[config.listPrimary] = `${row[config.listPrimary]} (copy)`;
      if (config.publishColumn) copy[config.publishColumn] = false;
      const { error } = await db.from(config.table).insert(copy);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Duplicated as a draft");
      void queryClient.invalidateQueries({ queryKey: [config.table] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not duplicate"),
  });

  const reorder = async (draggedId: string, targetId: string) => {
    if (!config.orderColumn || draggedId === targetId) return;
    const current = [...rows];
    const from = current.findIndex((r) => r.id === draggedId);
    const to = current.findIndex((r) => r.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = current.splice(from, 1);
    current.splice(to, 0, moved!);
    await Promise.all(
      current.map((row, index) =>
        db.from(config.table).update({ [config.orderColumn!]: index + 1 }).eq("id", row.id),
      ),
    );
    toast.success("Order saved");
    void queryClient.invalidateQueries({ queryKey: [config.table] });
    void queryClient.invalidateQueries({ queryKey: ["public"] });
  };

  const renderField = (field: Field) => {
    const value = form[field.name];
    const setValue = (v: unknown) => setForm((prev) => ({ ...prev, [field.name]: v }));

    switch (field.type) {
      case "readonly":
        return (
          <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
            {value ? String(value) : "—"}
          </p>
        );
      case "textarea":
        return (
          <Textarea rows={3} value={value ?? ""} placeholder={field.placeholder} onChange={(e) => setValue(e.target.value)} />
        );
      case "richtext":
        return <RichTextEditor value={value ?? ""} onChange={setValue} />;
      case "number":
        return (
          <Input
            type="number"
            value={value ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => setValue(e.target.value === "" ? null : Number(e.target.value))}
          />
        );
      case "switch":
        return (
          <div className="flex h-10 items-center">
            <Switch checked={!!value} onCheckedChange={setValue} />
          </div>
        );
      case "date":
        return <Input type="date" value={value ?? ""} onChange={(e) => setValue(e.target.value)} />;
      case "time":
        return <Input type="time" value={value ?? ""} onChange={(e) => setValue(e.target.value)} />;
      case "select":
        return (
          <Select value={value ? String(value) : ""} onValueChange={setValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {(field.options ?? []).map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "relation": {
        const options = relationOptions[field.relation!.table] ?? [];
        return (
          <Select value={value ? String(value) : "none"} onValueChange={(v) => setValue(v === "none" ? null : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Not linked" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not linked</SelectItem>
              {options.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      case "multirelation": {
        const options = relationOptions[field.relation!.table] ?? [];
        const selected: string[] = effectiveJoins[field.name] ?? [];
        return (
          <div className="max-h-44 space-y-2 overflow-y-auto rounded-md border border-input p-3">
            {options.length ? (
              options.map((o) => (
                <label key={o.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selected.includes(o.id)}
                    onCheckedChange={(checked) =>
                      setJoins((prev) => ({
                        ...prev,
                        [field.name]: checked
                          ? [...selected, o.id]
                          : selected.filter((id) => id !== o.id),
                      }))
                    }
                  />
                  {o.label}
                </label>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nothing to link yet.</p>
            )}
          </div>
        );
      }
      case "tags":
        return (
          <Input
            value={Array.isArray(value) ? value.join(", ") : (value ?? "")}
            placeholder={field.placeholder ?? "Separate with commas"}
            onChange={(e) =>
              setValue(
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        );
      case "image":
        return (
          <ImagePicker
            value={value ?? null}
            onChange={(v) => setValue(v)}
            defaultCategory={field.mediaCategory ?? "General"}
          />
        );
      case "gallery":
        return (
          <ImagePicker
            multiple
            value={Array.isArray(value) ? value : []}
            onChange={(v) => setValue(v)}
            defaultCategory={field.mediaCategory ?? "General"}
          />
        );
      default:
        return <Input value={value ?? ""} placeholder={field.placeholder} onChange={(e) => setValue(e.target.value)} />;
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{config.title}</h1>
          {config.description ? <p className="text-sm text-muted-foreground">{config.description}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {config.softDelete ? (
            <Button variant="outline" size="sm" onClick={() => setShowArchived((v) => !v)}>
              {showArchived ? "Show active" : "Show archived"}
            </Button>
          ) : null}
          {config.canCreate === false ? null : (
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 size-4" />
              Add {config.singular}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${config.title.toLowerCase()}`}
            className="pl-8"
          />
        </div>
        {(config.filters ?? []).map((filter) => {
          const options = filter.relation ? (relationOptions[filter.relation.table] ?? []) : null;
          return (
            <Select
              key={filter.column}
              value={filterValues[filter.column] ?? "all"}
              onValueChange={(v) => setFilterValues((prev) => ({ ...prev, [filter.column]: v }))}
            >
              <SelectTrigger className="sm:w-52">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label.toLowerCase()}</SelectItem>
                {options
                  ? options.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))
                  : (filter.options ?? []).map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          );
        })}
      </div>

      {listQuery.isLoading ? (
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card p-10 text-center">
          <p className="text-base font-medium">{search ? "No matching results." : config.emptyTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{search ? "Try a different search." : config.emptyBody}</p>
          {config.canCreate === false || search ? null : (
            <Button className="mt-4" size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 size-4" /> Add {config.singular}
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li
                key={row.id}
                draggable={!!config.orderColumn}
                onDragStart={() => setDragId(row.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragId) void reorder(dragId, row.id);
                  setDragId(null);
                }}
                className={cn(
                  "flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap",
                  dragId === row.id && "opacity-50",
                )}
              >
                {config.orderColumn ? (
                  <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" />
                ) : null}
                {config.imageColumn ? (
                  row[config.imageColumn] ? (
                    <img
                      src={row[config.imageColumn]}
                      alt=""
                      className="size-11 shrink-0 rounded-md border border-border object-cover"
                    />
                  ) : (
                    <div className="size-11 shrink-0 rounded-md border border-dashed border-border" />
                  )
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{row[config.listPrimary] || "Untitled"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {(config.listSecondary ?? [])
                      .map((c) => row[c])
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {config.statusColumn && row[config.statusColumn] ? (
                    <Badge variant="secondary">{row[config.statusColumn]}</Badge>
                  ) : null}
                  {config.featuredColumn ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      title={row[config.featuredColumn] ? "Remove from featured" : "Mark as featured"}
                      onClick={() =>
                        patchMutation.mutate({
                          id: row.id,
                          patch: { [config.featuredColumn!]: !row[config.featuredColumn!] },
                        })
                      }
                    >
                      <Star
                        className={cn("size-4", row[config.featuredColumn] && "fill-accent text-accent")}
                      />
                    </Button>
                  ) : null}
                  {config.publishColumn ? (
                    <Button
                      variant={row[config.publishColumn] ? "secondary" : "outline"}
                      size="sm"
                      onClick={() =>
                        patchMutation.mutate({
                          id: row.id,
                          patch: { [config.publishColumn!]: !row[config.publishColumn!] },
                        })
                      }
                    >
                      {row[config.publishColumn] ? (
                        <>
                          <Eye className="mr-1.5 size-3.5" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1.5 size-3.5" /> Draft
                        </>
                      )}
                    </Button>
                  ) : null}
                  {config.previewPath ? (
                    <Button asChild variant="ghost" size="icon" title="Preview on website">
                      <Link to={config.previewPath as never} target="_blank">
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                  ) : null}
                  {config.duplicate ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Duplicate"
                      onClick={() => duplicateMutation.mutate(row)}
                    >
                      <Copy className="size-4" />
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(row)}>
                    <Pencil className="size-4" />
                  </Button>
                  {showArchived ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Restore"
                      onClick={() => patchMutation.mutate({ id: row.id, patch: { deleted_at: null } })}
                    >
                      <RotateCcw className="size-4" />
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    onClick={() => setDeleteTarget(row)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? `Edit ${config.singular.toLowerCase()}` : `Add ${config.singular.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>
              Content saved as a draft stays hidden until you publish it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {config.fields.map((field) => (
              <div
                key={field.name}
                className={cn(
                  "space-y-1.5",
                  (field.full ||
                    field.type === "richtext" ||
                    field.type === "textarea" ||
                    field.type === "gallery") &&
                    "sm:col-span-2",
                )}
              >
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required ? <span className="text-destructive"> *</span> : null}
                </Label>
                {renderField(field)}
                {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              disabled={saveMutation.isPending}
              onClick={() => {
                const missing = config.fields.find((f) => f.required && !form[f.name]);
                if (missing) {
                  toast.error(`${missing.label} is required.`);
                  return;
                }
                saveMutation.mutate();
              }}
            >
              {saveMutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this {config.singular.toLowerCase()}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {config.softDelete && !showArchived
                ? "It will be archived and removed from the public website. You can restore it later from the archive."
                : "This will permanently remove the record."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {relationFields.length && !Object.keys(relationOptions).length ? null : null}
    </div>
  );
}
