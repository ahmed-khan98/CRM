"use client";

import { memo } from "react";
import { FileText, Upload, X } from "lucide-react";

function FileUploadZone({
  file,
  fileRef,
  onFileChange,
  onUpload,
  onClear,
  uploading,
  uploadLabel = "Upload",
  emptyLabel = "Click to attach a file",
}) {
  return (
    <>
      <input ref={fileRef} type="file" className="hidden" onChange={onFileChange} />
      {file ? (
        <div className="flex items-center gap-2 rounded-2xl border border-zinc-100 bg-zinc-50 px-3 py-2.5">
          <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
          <span className="truncate flex-1 text-xs font-semibold text-zinc-700">{file.name}</span>
          <button
            type="button"
            onClick={onUpload}
            disabled={uploading}
            className="shrink-0 rounded-xl bg-zinc-900 px-3 py-1.5 text-[11px] font-black text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {uploading ? "Uploading…" : uploadLabel}
          </button>
          <button type="button" onClick={onClear} className="text-zinc-400 hover:text-red-500 transition cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-zinc-200 px-3 py-2.5 text-xs font-semibold text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 transition cursor-pointer"
        >
          <Upload className="h-3.5 w-3.5" />
          {emptyLabel}
        </button>
      )}
    </>
  );
}

export default memo(FileUploadZone);
