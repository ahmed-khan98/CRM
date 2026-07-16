"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyEditor({
  value,
  onChange,
  height,
  compact = false,
  apiKey = '9yca5hup4vjnbwcfc9rojo6s3yos6euv28zvh3nec9h04s89'
}) {
  const editorHeight = height ?? (compact ? 180 : 420);

  const init = compact
    ? {
        height: editorHeight,
        menubar: false,
        branding: false,
        plugins: "lists link autolink",
        toolbar: "bold italic underline | bullist numlist | removeformat",
        content_style: "body { font-family: Inter, Arial, sans-serif; font-size:13px; margin: 8px; }",
      }
    : {
        height: editorHeight,
        menubar: true,
        branding: false,
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
        fontsize_formats: "10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 48px",
        content_style: "body { font-family: Inter, Arial, sans-serif; font-size:14px }",
        automatic_uploads: false,
      };

  return (
    <div className="border-1 border-gray-200 rounded-xl overflow-hidden">
      <Editor
        apiKey={apiKey}
        value={value}
        onEditorChange={(content) => onChange?.(content)}
        init={init}
      />
    </div>
  );
}
