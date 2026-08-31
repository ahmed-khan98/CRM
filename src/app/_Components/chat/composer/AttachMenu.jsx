"use client";

import { memo } from "react";
import { Image as ImageIcon, FileText } from "lucide-react";

function AttachMenu({ onPhotos, onDocument }) {
  return (
    <div className="absolute bottom-12 left-0 z-30 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-xl text-zinc-800">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-zinc-50 cursor-pointer"
        onClick={onPhotos}
      >
        <ImageIcon className="h-4 w-4 text-purple-600" /> Photos & videos
      </button>
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-zinc-50 cursor-pointer"
        onClick={onDocument}
      >
        <FileText className="h-4 w-4 text-sky-600" /> Document
      </button>
    </div>
  );
}

export default memo(AttachMenu);
