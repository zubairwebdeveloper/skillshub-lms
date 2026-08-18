"use client";

import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Mention from "@tiptap/extension-mention";
import { TableKit } from "@tiptap/extension-table";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { Placeholder, CharacterCount } from "@tiptap/extensions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

import { cn } from "@/lib/utils";
import { createMentionSuggestion } from "./mention-suggestion";
import "./editor.css";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  Code2,
  Link2,
  Link2Off,
  ImageIcon,
  Video as VideoIcon,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  Undo2,
  Redo2,
  RemoveFormatting,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  AtSign,
  Table2,
  Loader2,
  CornerDownLeft,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ---- platform-aware modifier key label (⌘ on Mac, Ctrl elsewhere) ----
const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const MOD = isMac ? "⌘" : "Ctrl";
const ALT = isMac ? "⌥" : "Alt";

const TEXT_COLORS = [
  "#0F172A",
  "#DC2626",
  "#D97706",
  "#16A34A",
  "#2563EB",
  "#7C3AED",
  "#DB2777",
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#FEF08A" },
  { label: "Green", value: "#BBF7D0" },
  { label: "Blue", value: "#BFDBFE" },
  { label: "Pink", value: "#FBCFE8" },
  { label: "Purple", value: "#E9D5FF" },
];

// All heading levels the editor supports — keep this in sync with the
// StarterKit `heading.levels` config below and the <Select> options.
const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  shortcut,
  children,
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
            "text-muted-foreground transition-all duration-150",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-40",
            isActive && "bg-primary/10 text-primary",
          )}
        >
          {children}
        </button>
      </TooltipTrigger>

      <TooltipContent
        side="bottom"
        sideOffset={6}
        className="flex items-center gap-2"
      >
        <span>{title}</span>

        {shortcut && (
          <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarSeparator() {
  return <div className="mx-1 h-6 w-px shrink-0 bg-border" />;
}

function SwatchPopover({ icon, title, shortcut, colors, onPick, isActive }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
              "text-muted-foreground transition-all duration-150",
              "hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive && "bg-primary/10 text-primary",
            )}
          >
            {icon}
          </button>
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          sideOffset={6}
          className="flex items-center gap-2"
        >
          <span>{title}</span>

          {shortcut && (
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {shortcut}
            </kbd>
          )}
        </TooltipContent>
      </Tooltip>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-9 z-50 flex gap-1.5 rounded-md border bg-popover p-2 shadow-md">
            {colors.map((c) => {
              const value = typeof c === "string" ? c : c.value;
              const label = typeof c === "string" ? c : c.label;
              return (
                <button
                  key={value}
                  type="button"
                  title={label}
                  onClick={() => {
                    onPick(value);
                    setOpen(false);
                  }}
                  className="h-6 w-6 rounded-full border shadow-sm"
                  style={{ backgroundColor: value }}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  mentionItems,
  className,
}) {
  const [uploadingImage, setUploadingImage] = useState(false);

  // remember last-picked color/highlight so the keyboard shortcut can toggle them
  const lastTextColorRef = useRef(TEXT_COLORS[0]);
  const lastHighlightRef = useRef(HIGHLIGHT_COLORS[0].value);

  const editor = useEditor({
    immediatelyRender: false, // avoids SSR hydration mismatch in Next.js
    content: value || "",
    editorProps: {
      attributes: {
        class: "rte-content",
      },
      handleKeyDown: (view, event) => {
        const mod = event.metaKey || event.ctrlKey;
        if (!mod || !event.shiftKey) return false;

        const key = event.key.toLowerCase();

        // Ctrl/⌘ + Shift + M -> toggle text color (last used, default first swatch)
        if (key === "m") {
          event.preventDefault();
          const color = lastTextColorRef.current;
          if (editor.isActive("textStyle", { color })) {
            editor.chain().focus().unsetColor().run();
          } else {
            editor.chain().focus().setColor(color).run();
          }
          return true;
        }

        // Ctrl/⌘ + Shift + H -> toggle highlight (last used, default first swatch)
        if (key === "h") {
          event.preventDefault();
          const color = lastHighlightRef.current;
          editor.chain().focus().toggleHighlight({ color }).run();
          return true;
        }

        // Ctrl/⌘ + Shift + L -> align left
        if (key === "l") {
          event.preventDefault();
          editor.chain().focus().setTextAlign("left").run();
          return true;
        }

        // Ctrl/⌘ + Shift + E -> align center
        if (key === "e") {
          event.preventDefault();
          editor.chain().focus().setTextAlign("center").run();
          return true;
        }

        // Ctrl/⌘ + Shift + R -> align right
        if (key === "r") {
          event.preventDefault();
          editor.chain().focus().setTextAlign("right").run();
          return true;
        }

        // Ctrl/⌘ + Shift + J -> justify
        if (key === "j") {
          event.preventDefault();
          editor.chain().focus().setTextAlign("justify").run();
          return true;
        }

        return false;
      },
    },
    extensions: [
      StarterKit.configure({
        // FIX: was capped at [1, 2, 3] — headings 4-6 couldn't be applied
        // at all (the extension silently rejects levels outside this list),
        // which is why the toolbar dropdown "did nothing" past H3.
        heading: { levels: HEADING_LEVELS },
        link: false, // registered separately below with custom config
        underline: false, // registered separately below
        codeBlock: {
          HTMLAttributes: { spellcheck: "false" },
        },
        // Hard break (the <br> tag) — on by default in StarterKit with the
        // Shift+Enter shortcut, kept explicit here so it's easy to find.
        hardBreak: {
          keepMarks: true,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      ImageExtension.configure({ inline: false }),
      Youtube.configure({ width: 560, height: 315, nocookie: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Superscript,
      Subscript,
      Mention.configure({
        HTMLAttributes: { class: "mention" },
        suggestion: createMentionSuggestion(mentionItems),
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
      Placeholder.configure({ placeholder }),
    ],
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addVideo = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter YouTube URL");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  const uploadImage = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !editor) return;
      setUploadingImage(true);
      try {
        const fileRef = ref(
          storage,
          `course-content/${Date.now()}-${file.name}`,
        );
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        console.error(err);
        window.alert("Image upload failed. Please try again.");
      } finally {
        setUploadingImage(false);
      }
    },
    [editor],
  );

  if (!editor) return null;

  // FIX: previously only checked levels 1-3, so H4/H5/H6 always fell
  // through to "paragraph" in the dropdown even when a heading of that
  // level was actually active in the document.
  const activeHeadingLevel = HEADING_LEVELS.find((level) =>
    editor.isActive("heading", { level }),
  );
  const blockType = activeHeadingLevel ? `h${activeHeadingLevel}` : "paragraph";

  const setBlockType = (val) => {
    if (val === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .setHeading({ level: Number(val.slice(1)) })
        .run();
    }
  };

  const characters = editor.storage.characterCount?.characters() ?? 0;
  const words = editor.storage.characterCount?.words() ?? 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border bg-background",
        className,
      )}
    >
      {/* ================= TOOLBAR ================= */}
      <TooltipProvider delayDuration={300}>
        <div className="sticky top-0 z-50 flex flex-wrap items-center gap-0.5 border-b bg-background/95 p-1.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <ToolbarButton
            title="Undo"
            shortcut={`${MOD}+Z`}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Redo"
            shortcut={`${MOD}+Shift+Z`}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          {/* Block type: Paragraph + H1-H6. Each heading level has a
              built-in Mod+Alt+<level> shortcut (e.g. Mod+Alt+4 for H4),
              and Paragraph is Mod+Alt+0 — shown in the tooltip below. */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select value={blockType} onValueChange={setBlockType}>
                  <SelectTrigger className="h-8 w-[132px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    {HEADING_LEVELS.map((level) => (
                      <SelectItem key={level} value={`h${level}`}>
                        Heading {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              {`${MOD}+${ALT}+1..6 for headings, ${MOD}+${ALT}+0 for paragraph`}
            </TooltipContent>
          </Tooltip>

          <ToolbarSeparator />

          <ToolbarButton
            title="Bold"
            shortcut={`${MOD}+B`}
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            shortcut={`${MOD}+I`}
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            shortcut={`${MOD}+U`}
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Strikethrough"
            shortcut={`${MOD}+Shift+S`}
            isActive={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Inline code"
            shortcut={`${MOD}+E`}
            isActive={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code2 className="h-4 w-4" />
          </ToolbarButton>

          <SwatchPopover
            icon={<Palette className="h-4 w-4" />}
            title="Text color"
            shortcut={`${MOD}+Shift+M`}
            colors={TEXT_COLORS}
            onPick={(c) => {
              lastTextColorRef.current = c;
              editor.chain().focus().setColor(c).run();
            }}
            isActive={editor.isActive("textStyle")}
          />
          <SwatchPopover
            icon={<Highlighter className="h-4 w-4" />}
            title="Highlight"
            shortcut={`${MOD}+Shift+H`}
            colors={HIGHLIGHT_COLORS}
            onPick={(c) => {
              lastHighlightRef.current = c;
              editor.chain().focus().toggleHighlight({ color: c }).run();
            }}
            isActive={editor.isActive("highlight")}
          />

          <ToolbarButton
            title="Superscript"
            shortcut={`${MOD}+.`}
            isActive={editor.isActive("superscript")}
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <SuperscriptIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Subscript"
            shortcut={`${MOD}+,`}
            isActive={editor.isActive("subscript")}
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <SubscriptIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Clear formatting"
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
          >
            <RemoveFormatting className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          <ToolbarButton
            title="Bullet list"
            shortcut={`${MOD}+Shift+8`}
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Numbered list"
            shortcut={`${MOD}+Shift+7`}
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Task list"
            shortcut={`${MOD}+Shift+9`}
            isActive={editor.isActive("taskList")}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListTodo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Blockquote"
            shortcut={`${MOD}+Shift+B`}
            isActive={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Code block"
            shortcut={`${MOD}+Alt+C`}
            isActive={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          <ToolbarButton
            title="Align left"
            shortcut={`${MOD}+Shift+L`}
            isActive={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Align center"
            shortcut={`${MOD}+Shift+E`}
            isActive={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Align right"
            shortcut={`${MOD}+Shift+R`}
            isActive={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            title="Justify"
            shortcut={`${MOD}+Shift+J`}
            isActive={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarSeparator />

          <ToolbarButton
            title={editor.isActive("link") ? "Remove link" : "Add link"}
            isActive={editor.isActive("link")}
            onClick={setLink}
          >
            {editor.isActive("link") ? (
              <Link2Off className="h-4 w-4" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
          </ToolbarButton>

          <Tooltip>
            <TooltipTrigger asChild>
              <label
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  uploadingImage && "pointer-events-none opacity-50",
                )}
              >
                {uploadingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadImage}
                />
              </label>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              Insert image
            </TooltipContent>
          </Tooltip>

          <ToolbarButton title="Insert video" onClick={addVideo}>
            <VideoIcon className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Insert table"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <Table2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Mention someone"
            shortcut="@"
            onClick={() => editor.chain().focus().insertContent("@").run()}
          >
            <AtSign className="h-4 w-4" />
          </ToolbarButton>

          {/* Line break (<br>) — inserts a break inside the current
              block instead of starting a new paragraph. Built-in
              shortcut is Shift+Enter; button added for discoverability. */}
          <ToolbarButton
            title="Line break"
            shortcut="Shift+Enter"
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            <CornerDownLeft className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            title="Horizontal rule"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </TooltipProvider>

      {/* ================= CONTENT ================= */}
      <EditorContent editor={editor} />

      {/* ================= FOOTER ================= */}
      <div className="flex items-center justify-end gap-3 border-t bg-muted/10 px-3 py-1.5 text-xs text-muted-foreground">
        <span>{words} words</span>
        <span className="h-3 w-px bg-border" />
        <span>{characters} characters</span>
      </div>
    </div>
  );
}
