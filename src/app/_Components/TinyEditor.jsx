"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";

/** Zinc overrides for TinyMCE oxide-dark blue chrome */
const DARK_CHROME_CSS = `
.tiny-editor-dark {
  max-width: 100%;
  overflow-x: hidden !important;
}
.tiny-editor-dark .tox-tinymce {
  border: none !important;
  border-radius: 0.75rem !important;
  max-width: 100% !important;
}
.tiny-editor-dark .tox,
.tiny-editor-dark .tox-editor-container,
.tiny-editor-dark .tox-editor-header,
.tiny-editor-dark .tox-toolbar-overlord,
.tiny-editor-dark .tox-toolbar__primary {
  max-width: 100% !important;
  overflow-x: hidden !important;
}
.tiny-editor-dark.tiny-editor-fill .tox-tinymce,
.tiny-editor-dark.tiny-editor-fill .tox {
  height: 100% !important;
}
.tiny-editor-dark .tox .tox-editor-header,
.tiny-editor-dark .tox .tox-menubar,
.tiny-editor-dark .tox .tox-toolbar,
.tiny-editor-dark .tox .tox-toolbar__primary,
.tiny-editor-dark .tox .tox-toolbar__overflow,
.tiny-editor-dark .tox .tox-toolbar-overlord,
.tiny-editor-dark .tox .tox-anchorbar {
  background: #27272a !important;
  background-color: #27272a !important;
  border-color: #3f3f46 !important;
  box-shadow: none !important;
}
.tiny-editor-dark .tox .tox-statusbar {
  background: #27272a !important;
  background-color: #27272a !important;
  border-top: 1px solid #3f3f46 !important;
  color: #a1a1aa !important;
}
.tiny-editor-dark .tox .tox-statusbar a,
.tiny-editor-dark .tox .tox-statusbar__path-item,
.tiny-editor-dark .tox .tox-statusbar__wordcount {
  color: #a1a1aa !important;
}
.tiny-editor-dark .tox .tox-mbtn,
.tiny-editor-dark .tox .tox-tbtn,
.tiny-editor-dark .tox .tox-split-button,
.tiny-editor-dark .tox .tox-tbtn__select-label {
  color: #e4e4e7 !important;
  background: transparent !important;
}
.tiny-editor-dark .tox .tox-mbtn:hover:not(:disabled),
.tiny-editor-dark .tox .tox-tbtn:hover,
.tiny-editor-dark .tox .tox-tbtn--enabled,
.tiny-editor-dark .tox .tox-mbtn--active {
  background: #3f3f46 !important;
  color: #fafafa !important;
}
.tiny-editor-dark .tox .tox-edit-area,
.tiny-editor-dark .tox .tox-edit-area__iframe {
  background: #18181b !important;
}
.tiny-editor-dark .tox .tox-toolbar__group:not(:last-of-type) {
  border-right-color: #3f3f46 !important;
}
.tiny-editor-dark .tox .tox-number-input,
.tiny-editor-dark .tox .tox-listboxfield .tox-listbox--select {
  background: #3f3f46 !important;
  color: #e4e4e7 !important;
  border-color: #52525b !important;
}
`;

export default function TinyEditor({
  value,
  onChange,
  height,
  compact = false,
  dark = false,
  fill = false,
  /** Keep full toolbar but hide File/Edit menubar (saves vertical space in compose) */
  showMenubar = true,
  apiKey = "9yca5hup4vjnbwcfc9rojo6s3yos6euv28zvh3nec9h04s89",
}) {
  const editorHeight = height ?? (compact ? 180 : 420);

  const darkContentStyle =
    "body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size:14px; background:#18181b; color:#e4e4e7; margin:8px; } a { color:#7dd3fc; }";
  const lightContentStyle =
    "body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size:14px; margin: 8px; }";

  const darkExtras = dark
    ? {
        skin: "oxide-dark",
        content_css: "dark",
      }
    : {};

  const init = compact
    ? {
        height: editorHeight,
        menubar: false,
        branding: false,
        statusbar: false,
        plugins: "lists link autolink",
        toolbar: "bold italic underline | bullist numlist | removeformat",
        content_style: dark ? darkContentStyle : lightContentStyle,
        ...darkExtras,
      }
    : {
        height: editorHeight,
        menubar: showMenubar,
        branding: false,
        statusbar: true,
        plugins:
          "advlist autolink lists link image charmap preview anchor " +
          "searchreplace visualblocks code fullscreen insertdatetime media table " +
          "codesample help wordcount",
        toolbar: [
          "undo redo | blocks fontfamily fontsize |",
          "bold italic underline strikethrough forecolor backcolor |",
          "alignleft aligncenter alignright alignjustify |",
          "bullist numlist outdent indent | blockquote |",
          "link image table hr codesample | removeformat | fullscreen",
        ].join(" "),
        block_formats:
          "Paragraph=p; Quote=blockquote; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",
        fontsize_formats:
          "10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 48px",
        content_style: dark ? darkContentStyle : lightContentStyle,
        automatic_uploads: false,
        ...darkExtras,
      };

  return (
    <>
      {dark ? <style dangerouslySetInnerHTML={{ __html: DARK_CHROME_CSS }} /> : null}
      <div
        className={`overflow-hidden border ${
          dark
            ? "tiny-editor-dark border-zinc-700 bg-zinc-900 rounded-xl"
            : "border-zinc-200 rounded-xl"
        } ${fill ? "tiny-editor-fill flex flex-col min-h-0 h-full" : ""}`}
      >
        <Editor
          apiKey={apiKey}
          value={value}
          onEditorChange={(content) => onChange?.(content)}
          init={init}
        />
      </div>
    </>
  );
}
