"use client";

import { memo, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionLabel from "../ui/SectionLabel";
import TaskDetailHeader from "./TaskDetailHeader";
import TaskDetailAttachments from "./TaskDetailAttachments";
import TaskDetailComments from "./TaskDetailComments";
import TaskDetailSidebar from "./TaskDetailSidebar";
import TaskDetailMobileStrip from "./TaskDetailMobileStrip";
import { useTaskPermissions } from "../../_hooks/useTaskPermissions";

function TaskDetailModal({
  isOpen, onClose, task, currentUser, onEdit, onDelete, projectId, onProjectClick, project,
}) {
  const { currentUserId, isAdminRole } = useTaskPermissions(currentUser);

  const permissions = useMemo(() => {
    if (!task) return {};
    const isCreator = task.createdBy?._id?.toString() === currentUserId?.toString();
    const isAssignee = task.assignees?.some((a) => a._id?.toString() === currentUserId?.toString());
    return {
      canEdit: isCreator || isAdminRole,
      canReplaceCreatorFile: isCreator || isAdminRole,
      canUploadAssigneeFile: isAssignee && !isCreator,
    };
  }, [task, currentUserId, isAdminRole]);

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full sm:max-w-3xl h-[92dvh] sm:h-auto sm:max-h-[95vh] flex flex-col rounded-t-2xl sm:rounded-3xl border border-zinc-200 bg-white shadow-2xl overflow-hidden"
        >
          <TaskDetailHeader
            task={task}
            onClose={onClose}
            onEdit={onEdit}
            onDelete={onDelete}
            canEdit={permissions.canEdit}
          />

          <TaskDetailMobileStrip
            task={task}
            project={project}
            onProjectClick={onProjectClick}
          />

          <div className="flex flex-1 min-h-0 flex-col sm:flex-row overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-4 sm:gap-5">
              <div>
                <SectionLabel text="Description" />
                {task.description
                  ? <p className="text-xs leading-relaxed font-normal text-zinc-600">{task.description}</p>
                  : <p className="text-[11px] text-zinc-400 italic">No description provided.</p>
                }
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

            <TaskDetailSidebar task={task} project={project} onProjectClick={onProjectClick} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default memo(TaskDetailModal);
