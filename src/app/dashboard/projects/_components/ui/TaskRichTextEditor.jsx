"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Strikethrough,
  Quote,
} from "lucide-react";

function ToolbarButton({ active, onClick, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-lg transition cursor-pointer ${
        active
          ? "bg-white/15 text-white"
          : "text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
      }`}
    >
      {children}
    </button>
  );
}

export default function TaskRichTextEditor({
  value = "",
  onChange,
  placeholder = "Write here...",
  compact = false,
  minHeight = compact ? 100 : 140,
  maxHeight = minHeight,
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: compact ? false : { levels: [2, 3] },
        blockquote: !compact,
      }),
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor: ed }) => onChange?.(ed.getHTML()),
    editorProps: {
      attributes: {
        class:
          "px-3 py-2.5 text-sm text-zinc-200 leading-relaxed focus:outline-none " +
          "[&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 " +
          "[&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-400 " +
          "[&.is-editor-empty:first-child::before]:text-zinc-500 [&.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] " +
          "[&.is-editor-empty:first-child::before]:float-left [&.is-editor-empty:first-child::before]:h-0 [&.is-editor-empty:first-child::before]:pointer-events-none " +
          "[&::-webkit-scrollbar]:hidden",
        style:
          `min-height: ${minHeight}px; max-height: ${maxHeight}px; ` +
          "overflow-y: auto; scrollbar-width: none;",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (current !== next) {
      editor.commands.setContent(next, false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-[#161b22] transition focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/10">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/[0.08] bg-[#12171d] px-2 py-1.5">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        {!compact && (
          <ToolbarButton
            title="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolbarButton>
        )}

        <span className="mx-1 h-4 w-px bg-white/10" />

        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>

        {!compact && (
          <ToolbarButton
            title="Quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-3.5 w-3.5" />
          </ToolbarButton>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
