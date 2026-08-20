"use client";

import { memo, useCallback } from "react";
import { Paperclip } from "lucide-react";
import toast from "react-hot-toast";
import SectionLabel from "../ui/SectionLabel";
import {
  useUploadCreatorAttachmentMutation,
  useUploadAssigneeAttachmentMutation,
  useDeleteCreatorAttachmentMutation,
  useDeleteAssigneeAttachmentMutation,
} from "@/app/_Services/task/page";
import AttachmentSection from "./AttachmentSection";

function TaskDetailAttachments({ task, projectId, canReplaceCreatorFile, canUploadAssigneeFile }) {
  const [uploadCreator] = useUploadCreatorAttachmentMutation();
  const [uploadAssignee] = useUploadAssigneeAttachmentMutation();
  const [deleteCreatorAttachment] = useDeleteCreatorAttachmentMutation();
  const [deleteAssigneeAttachment] = useDeleteAssigneeAttachmentMutation();

  const handleCreatorUpload = useCallback(
    async (files) => {
      await uploadCreator({ id: task._id, files, projectId }).unwrap();
      toast.success(files.length > 1 ? "Attachments uploaded" : "Attachment uploaded");
    },
    [uploadCreator, task._id, projectId]
  );

  const handleAssigneeUpload = useCallback(
    async (files) => {
      await uploadAssignee({ id: task._id, files, projectId }).unwrap();
      toast.success(files.length > 1 ? "Attachments uploaded" : "Attachment uploaded successfully");
    },
    [uploadAssignee, task._id, projectId]
  );

  const handleDeleteCreator = useCallback(
    async (publicId) => {
      await deleteCreatorAttachment({ id: task._id, publicId, projectId }).unwrap();
      toast.success("Attachment removed");
    },
    [deleteCreatorAttachment, task._id, projectId]
  );

  const handleDeleteAssignee = useCallback(
    async (publicId) => {
      await deleteAssigneeAttachment({ id: task._id, publicId, projectId }).unwrap();
      toast.success("Attachment removed");
    },
    [deleteAssigneeAttachment, task._id, projectId]
  );

  return (
    <div className="flex flex-col gap-2">
      <SectionLabel icon={Paperclip} text="Attachments" />
      <AttachmentSection
        label="Creator"
        attachments={task.creatorAttachment}
        canUpload={canReplaceCreatorFile}
        onUpload={handleCreatorUpload}
        onDelete={handleDeleteCreator}
        emptyLabel="Upload your attachment(s)"
        replaceLabel="Add another attachment"
      />
      <AttachmentSection
        label="Assignee"
        attachments={task.assigneeAttachment}
        canUpload={canUploadAssigneeFile}
        onUpload={handleAssigneeUpload}
        onDelete={handleDeleteAssignee}
        emptyLabel="Upload your work file(s)"
        replaceLabel="Add another attachment"
      />
    </div>
  );
}

export default memo(TaskDetailAttachments);
