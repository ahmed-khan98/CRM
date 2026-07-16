"use client";

import { getPlainTextFromHtml } from "../utils";

export default function RichTextContent({ html, className = "", emptyFallback = null }) {
  if (!html || !getPlainTextFromHtml(html)) {
    return emptyFallback;
  }

  const isHtml = /<[^>]+>/.test(html);

  if (isHtml) {
    return (
      <div
        className={`rich-text-content text-xs leading-relaxed font-normal text-zinc-700 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_strong]:font-semibold ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <p className={`text-xs leading-relaxed font-normal text-zinc-700 whitespace-pre-wrap ${className}`}>{html}</p>;
}
