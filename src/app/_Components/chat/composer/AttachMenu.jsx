"use client";

import { memo } from "react";
import { Image as ImageIcon, FileText } from "lucide-react";

function AttachMenu({ onPhotos, onDocument, dark = false, theme }) {
  const menu = theme?.menu || (dark
    ? "bg-[#111113] text-zinc-100 border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
    : "bg-white text-zinc-900 border-zinc-200 shadow-xl");
  const item = theme?.menuItem || (dark ? "hover:bg-white/[0.06]" : "hover:bg-zinc-50");

  return (
    <div className={`absolute bottom-12 left-0 z-30 w-44 overflow-hidden rounded-xl border py-1 ${menu}`}>
      <button
        type="button"
        className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm cursor-pointer ${item}`}
        onClick={onPhotos}
      >
        <ImageIcon className={`h-4 w-4 ${dark ? "text-purple-400" : "text-purple-600"}`} /> Photos & videos
      </button>
      <button
        type="button"
        className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm cursor-pointer ${item}`}
        onClick={onDocument}
      >
        <FileText className={`h-4 w-4 ${dark ? "text-sky-700" : "text-sky-700"}`} /> Document
      </button>
    </div>
  );
}

export default memo(AttachMenu);
