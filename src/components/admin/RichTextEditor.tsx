import { useEffect, useRef } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Type,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Command = { icon: typeof Bold; label: string; run: () => void };

/**
 * Simple WYSIWYG editor for non-technical administrators. Stores HTML which is
 * sanitised before it is rendered on the public website.
 */
export function RichTextEditor({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value ?? "")) {
      ref.current.innerHTML = value ?? "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  };

  const commands: Command[] = [
    { icon: Bold, label: "Bold", run: () => exec("bold") },
    { icon: Italic, label: "Italic", run: () => exec("italic") },
    { icon: Heading2, label: "Large heading", run: () => exec("formatBlock", "<h2>") },
    { icon: Heading3, label: "Small heading", run: () => exec("formatBlock", "<h3>") },
    { icon: Type, label: "Paragraph", run: () => exec("formatBlock", "<p>") },
    { icon: List, label: "Bullet list", run: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered list", run: () => exec("insertOrderedList") },
    { icon: Quote, label: "Quote", run: () => exec("formatBlock", "<blockquote>") },
    {
      icon: LinkIcon,
      label: "Link",
      run: () => {
        const url = window.prompt("Link address (for example https://limra.example)");
        if (url) exec("createLink", url);
      },
    },
  ];

  return (
    <div className="overflow-hidden rounded-md border border-input">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/50 p-1">
        {commands.map((c) => (
          <Button
            key={c.label}
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            title={c.label}
            aria-label={c.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={c.run}
          >
            <c.icon className="size-4" />
          </Button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        className="prose-cms min-h-40 max-w-none px-3 py-2 text-sm outline-none"
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onBlur={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
      />
    </div>
  );
}
