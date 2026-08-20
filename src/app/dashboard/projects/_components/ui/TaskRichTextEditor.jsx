"use client";

import { memo, useCallback, useEffect } from "react";
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
import Tooltip from "@/app/_Components/ui/Tooltip";

const ToolbarButton = memo(function ToolbarButton({ active, onClick, children, title }) {
  const btn = (
    <button
      type="button"
      aria-label={title}
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
  if (!title) return btn;
  return (
    <Tooltip label={title} side="bottom">
      {btn}
    </Tooltip>
  );
});

function TaskRichTextEditor({
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

  const toggleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
  const toggleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
  const toggleUnderline = useCallback(() => editor?.chain().focus().toggleUnderline().run(), [editor]);
  const toggleStrike = useCallback(() => editor?.chain().focus().toggleStrike().run(), [editor]);
  const toggleBulletList = useCallback(() => editor?.chain().focus().toggleBulletList().run(), [editor]);
  const toggleOrderedList = useCallback(() => editor?.chain().focus().toggleOrderedList().run(), [editor]);
  const toggleBlockquote = useCallback(() => editor?.chain().focus().toggleBlockquote().run(), [editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-[#161b22] transition focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/10">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-white/[0.08] bg-[#12171d] px-2 py-1.5">
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={toggleBold}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={toggleItalic}>
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={toggleUnderline}>
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        {!compact && (
          <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={toggleStrike}>
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolbarButton>
        )}

        <span className="mx-1 h-4 w-px bg-white/10" />

        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={toggleBulletList}>
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={toggleOrderedList}>
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>

        {!compact && (
          <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={toggleBlockquote}>
            <Quote className="h-3.5 w-3.5" />
          </ToolbarButton>
        )}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

export default memo(TaskRichTextEditor);
