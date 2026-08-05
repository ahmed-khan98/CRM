"use client";

import { memo, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionLabel from "../ui/SectionLabel";
import TaskDetailHeader from "./TaskDetailHeader";
import TaskDetailAttachments from "./TaskDetailAttachments";
import TaskDetailComments from "./TaskDetailComments";
import TaskDetailSidebar from "./TaskDetailSidebar";
import TaskDetailMobileStrip from "./TaskDetailMobileStrip";
import RichTextContent from "../ui/RichTextContent";
import { useTaskPermissions } from "../../_hooks/useTaskPermissions";

function TaskDetailModal({
  isOpen,
  onClose,
  task,
  currentUser,
  onEdit,
  onDelete,
  projectId,
  onProjectClick,
  project,
  canEdit: canEditProp,
  canDelete: canDeleteProp,
}) {
  const { currentUserId, isAdminRole, canEditTask, canDeleteTask } =
    useTaskPermissions(currentUser);

  const permissions = useMemo(() => {
    if (!task) return {};
    const isCreator =
      task.createdBy?._id?.toString() === currentUserId?.toString();
    const isAssignee = task.assignees?.some(
      (a) => a._id?.toString() === currentUserId?.toString()
    );
    const canEdit = canEditProp ?? canEditTask(task);
    const canDelete = canDeleteProp ?? canDeleteTask(task);
    return {
      canEdit,
      canDelete,
      canReplaceCreatorFile: canEdit,
      canUploadAssigneeFile: isAssignee && !isCreator,
    };
  }, [
    task,
    currentUserId,
    canEditTask,
    canDeleteTask,
    canEditProp,
    canDeleteProp,
  ]);

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full sm:max-w-3xl h-[92dvh] sm:h-auto sm:max-h-[95vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-white/[0.08] bg-[#0f1419] shadow-2xl overflow-hidden"
        >
          <TaskDetailHeader
            task={task}
            onClose={onClose}
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={permissions.canEdit}
            canDelete={permissions.canDelete}
          />

          <TaskDetailMobileStrip
            task={task}
            project={project}
            onProjectClick={onProjectClick}
          />

          <div className="flex flex-1 min-h-0 flex-col sm:flex-row overflow-hidden">
            <div className="custom-scrollbar-dark flex-1 min-h-0 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-4 sm:gap-5">
              <div>
                <SectionLabel text="Description" />
                <div className="text-sm text-zinc-300 [&_p]:text-zinc-300 [&_a]:text-zinc-200">
                  <RichTextContent
                    html={task.description}
                    emptyFallback={
                      <p className="text-[11px] text-zinc-500 italic">
                        No description provided.
                      </p>
                    }
                  />
                </div>
              </div>

              <TaskDetailAttachments
                task={task}
                projectId={projectId}
                canReplaceCreatorFile={permissions.canReplaceCreatorFile}
                canUploadAssigneeFile={permissions.canUploadAssigneeFile}
              />

              <TaskDetailComments
                task={task}
                projectId={projectId}
                currentUserId={currentUserId}
                isAdminRole={isAdminRole}
              />
            </div>

            <TaskDetailSidebar
              task={task}
              project={project}
              onProjectClick={onProjectClick}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default memo(TaskDetailModal);
