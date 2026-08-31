"use client";

import { memo } from "react";
import { FileText, Upload, X } from "lucide-react";

/**
 * Multi-file picker with a preview list before upload. Click the dashed
 * zone to browse, or click it once (to focus) then Ctrl+V to paste a
 * screenshot straight from the clipboard (Win+Shift+S → Ctrl+V).
 */
function FileUploadZone({
  files = [],
  fileRef,
  onFileChange,
  onRemoveFile,
  onPaste,
  onUpload,
  onClear,
  uploading,
  uploadLabel = "Upload",
  emptyLabel = "Click to attach (ZIP up to 50 MB), or paste (Ctrl+V)",
}) {
  const hasFiles = files.length > 0;

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept=".zip,.rar,.psd,.ai,.eps,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*,video/*"
        className="hidden"
        onChange={onFileChange}
      />

      {hasFiles && (
        <div className="mb-2 flex flex-col gap-1.5">
          {files.map((f, i) => (
            <div
              key={`${f.name}-${f.lastModified}-${i}`}
              className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#161b22] px-3 py-2"
            >
              <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
              <span className="truncate flex-1 text-xs font-semibold text-zinc-200">{f.name}</span>
              <button
                type="button"
                onClick={() => onRemoveFile(i)}
                className="shrink-0 text-zinc-400 hover:text-red-500 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => fileRef.current?.click()}
        onPaste={onPaste}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
        }}
        className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-white/15 bg-[#161b22] px-3 py-2.5 text-xs font-semibold text-zinc-400 hover:border-white/25 hover:text-zinc-200 transition cursor-pointer outline-none focus:border-white/25 focus:text-zinc-200"
      >
        <Upload className="h-3.5 w-3.5 shrink-0" />
        {hasFiles ? "Add more files, or paste (Ctrl+V)" : emptyLabel}
      </div>

      {hasFiles && (
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onUpload}
            disabled={uploading}
            className="shrink-0 rounded-xl bg-zinc-100 px-3 py-1.5 text-[11px] font-black text-zinc-950 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {uploading ? "Uploading…" : `${uploadLabel} (${files.length})`}
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={uploading}
            className="shrink-0 rounded-xl px-3 py-1.5 text-[11px] font-semibold text-zinc-500 hover:text-red-500 transition cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(FileUploadZone);
