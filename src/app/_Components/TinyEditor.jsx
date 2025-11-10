"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyEditor({
  value,
  onChange,
  height = 420,
  apiKey = '9yca5hup4vjnbwcfc9rojo6s3yos6euv28zvh3nec9h04s89'
}) {
  return (
    <div className="border-1 border-gray-200 rounded-xl overflow-hidden">
      <Editor
        apiKey={apiKey}
        value={value}
        onEditorChange={(content) => onChange?.(content)}
        init={{
          height,
          menubar: true,
          branding: false,
          // Full power plugins:
          plugins:
            "advlist autolink lists link image charmap preview anchor " +
            "searchreplace visualblocks code fullscreen insertdatetime media table " +
            "codesample help wordcount",
          // Super-rich toolbar with everything you asked:
          toolbar: [
            "undo redo | blocks fontfamily fontsize |",
            "bold italic underline strikethrough forecolor backcolor |",
            "alignleft aligncenter alignright alignjustify |",
            "bullist numlist outdent indent | blockquote |",
            "link image table hr codesample | removeformat | fullscreen",
          ].join(" "),
          // Block menu includes paragraph, headings, and blockquote
          block_formats:
            "Paragraph=p; Quote=blockquote; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",
          // Optional: predefine font sizes menu
          fontsize_formats:
            "10px 12px 14px 16px 18px 20px 24px 28px 32px 36px 48px",
          // Clean content style for email templates
          content_style:
            "body { font-family: Inter, Arial, sans-serif; font-size:14px }",
          // Paste/URL image support (upload handler optional)
          automatic_uploads: false,
          // If you later implement uploads:
          // images_upload_handler: async (blobInfo, progress) => {
          //   const form = new FormData();
          //   form.append('file', blobInfo.blob(), blobInfo.filename());
          //   const res = await fetch('/api/upload', { method: 'POST', body: form });
          //   const json = await res.json();
          //   return json.url; // must return a public URL
          // },
        }}
      />
    </div>
  );
}
