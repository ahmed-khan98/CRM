"use client";

import { memo, useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import toast from "react-hot-toast";
import SectionLabel from "../ui/SectionLabel";
import AttachmentRow from "../attachments/AttachmentRow";
import FileUploadZone from "../attachments/FileUploadZone";
import {
  useUploadCreatorAttachmentMutation,
  useUploadAssigneeAttachmentMutation,
} from "@/app/_Services/task/page";

function AttachmentSection({
  label,
  attachment,
  canUpload,
  onUpload,
  emptyLabel,
  replaceLabel,
}) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="mb-1 text-[11px] font-medium text-zinc-500">{label}</p>
      {attachment?.url
        ? <AttachmentRow label={label} attachment={attachment} />
        : <p className="text-[11px] italic text-zinc-400">No {label.toLowerCase()} attachment.</p>
      }
      {canUpload && (
        <div className="mt-2">
          <FileUploadZone
            file={file}
            fileRef={fileRef}
            onFileChange={(e) => setFile(e.target.files?.[0] || null)}
            onUpload={handleUpload}
            onClear={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
            uploading={uploading}
            uploadLabel={attachment?.url ? "Replace" : "Upload"}
            emptyLabel={attachment?.url ? replaceLabel : emptyLabel}
          />
        </div>
      )}
    </div>
  );
}

function TaskDetailAttachments({ task, projectId, canReplaceCreatorFile, canUploadAssigneeFile }) {
  const [uploadCreator] = useUploadCreatorAttachmentMutation();
  const [uploadAssignee] = useUploadAssigneeAttachmentMutation();

  const handleCreatorUpload = async (file) => {
    await uploadCreator({ id: task._id, file, projectId }).unwrap();
    toast.success("Creator attachment replaced");
  };

  const handleAssigneeUpload = async (file) => {
    await uploadAssignee({ id: task._id, file, projectId }).unwrap();
    toast.success("Attachment uploaded successfully");
  };

  return (
    <div className="flex flex-col gap-2">
      <SectionLabel icon={Paperclip} text="Attachments" />
      <AttachmentSection
        label="Creator"
        attachment={task.creatorAttachment}
        canUpload={canReplaceCreatorFile}
        onUpload={handleCreatorUpload}
        emptyLabel="Upload your attachment"
        replaceLabel="Replace your attachment"
      />
      <AttachmentSection
        label="Assignee"
        attachment={task.assigneeAttachment}
        canUpload={canUploadAssigneeFile}
        onUpload={handleAssigneeUpload}
        emptyLabel="Upload your work file"
        replaceLabel="Replace your attachment"
      />
    </div>
  );
}

export default memo(TaskDetailAttachments);
