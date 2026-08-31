"use client";

import { memo } from "react";
import { FileText, X } from "lucide-react";
import IconButton from "@/app/_Components/chat/ui/IconButton";

function PendingFilesStrip({ files, onRemove }) {
  if (!files?.length) return null;
  return (
    <div className="mb-2 flex gap-3 overflow-x-auto px-1 pt-2 pb-1">
      {files.map((f) => (
        <div key={f.id} className="relative shrink-0">
          <div className="overflow-hidden rounded-xl border border-zinc-200/60 shadow-sm">
            {f.kind === "image" ? (
              <img src={f.previewUrl} alt={f.file.name} className="h-16 w-16 object-cover" />
            ) : f.kind === "video" ? (
              <video src={f.previewUrl} className="h-16 w-16 bg-black object-cover" />
            ) : (
              <div className="flex h-16 w-16 flex-col items-center justify-center gap-1 bg-zinc-100 px-1 text-center">
                <FileText className="h-5 w-5 text-sky-600" />
                <span className="w-full truncate px-0.5 text-[9px] text-zinc-500">
                  {f.file.name}
                </span>
              </div>
            )}
          </div>
          <IconButton
            label="Remove"
            onClick={() => onRemove(f.id)}
            className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-white shadow-md ring-2 ring-white"
          >
            <X className="h-3 w-3" />
          </IconButton>
        </div>
      ))}
    </div>
  );
}

export default memo(PendingFilesStrip);
