"use client";

import { memo, useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import AttachmentRow from "../attachments/AttachmentRow";
import FileUploadZone from "../attachments/FileUploadZone";
import { extractFilesFromClipboard } from "@/app/_utils/clipboardFiles";

function AttachmentSection({
  label,
  attachments,
  canUpload,
  onUpload,
  onDelete,
  emptyLabel,
  replaceLabel,
}) {
  const fileRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const list = attachments || [];

  const handleUpload = useCallback(async () => {
    if (!files.length) return;
    setUploading(true);
    try {
      await onUpload(files);
      setFiles([]);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }, [files, onUpload]);

  const handleFileChange = useCallback((e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length) setFiles((prev) => [...prev, ...picked]);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const handlePaste = useCallback((e) => {
    const pasted = extractFilesFromClipboard(e);
    if (pasted.length) {
      e.preventDefault();
      setFiles((prev) => [...prev, ...pasted]);
    }
  }, []);

  const handleRemoveFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClear = useCallback(() => {
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const handleDeleteExisting = useCallback(
    async (publicId) => {
      setDeletingId(publicId);
      try {
        await onDelete(publicId);
      } catch {
        toast.error("Failed to remove attachment");
      } finally {
        setDeletingId(null);
      }
    },
    [onDelete]
  );

  return (
    <div>
      <p className="mb-1 text-[11px] font-medium text-zinc-500">{label}</p>
      {list.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {list.map((attachment) => (
            <AttachmentRow
              key={attachment.publicId || attachment.url}
              label={label}
              attachment={attachment}
              onDelete={canUpload ? () => handleDeleteExisting(attachment.publicId) : undefined}
              deleting={deletingId === attachment.publicId}
            />
          ))}
        </div>
      ) : (
        <p className="text-[11px] italic text-zinc-400">No {label.toLowerCase()} attachments.</p>
      )}
      {canUpload && (
        <div className="mt-2">
          <FileUploadZone
            files={files}
            fileRef={fileRef}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            onPaste={handlePaste}
            onUpload={handleUpload}
            onClear={handleClear}
            uploading={uploading}
            uploadLabel={list.length ? "Add" : "Upload"}
            emptyLabel={list.length ? replaceLabel : emptyLabel}
          />
        </div>
      )}
    </div>
  );
}

export default memo(AttachmentSection);
