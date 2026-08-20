"use client";

import { memo } from "react";
import { FileText, Loader2, X } from "lucide-react";
import OpenBtn from "./OpenBtn";
import DownloadBtn from "./DownloadBtn";

function AttachmentRow({ label, attachment, onDelete, deleting }) {
  if (!attachment?.url) return null;

  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-zinc-100 bg-zinc-50 px-3 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <FileText className="h-3.5 w-3.5 text-zinc-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-zinc-800">{attachment.originalName || "Attachment"}</p>
        <p className="text-[10px] text-zinc-500">{label}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <OpenBtn url={attachment.url} filename={attachment.originalName} publicId={attachment.publicId} />
        <DownloadBtn url={attachment.url} filename={attachment.originalName} publicId={attachment.publicId} />
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            aria-label="Remove attachment"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(AttachmentRow);
