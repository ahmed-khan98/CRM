"use client";

import { memo } from "react";
import { Building2, Calendar, ExternalLink, FolderOpen, MessageSquare, Paperclip, User2 } from "lucide-react";
import Image from "next/image";
import { STATUS_CONFIG } from "../constants";
import { formatDue, getClientDisplayName, getPlainTextFromHtml, getProjectDepartmentName } from "../utils";
import Tooltip from "@/app/_Components/ui/Tooltip";

function TaskCardBadges({ task, showProject, onProjectClick }) {
  if (!showProject) return null;

  const projectId = task.projectId?._id || task.projectId;
  const projectName = task.projectId?.name;
  const clientName = getClientDisplayName(task.projectId?.clientId);

  if (!projectName && clientName === "No client") return null;

  const handleProjectClick = (e) => {
    e.stopPropagation();
    if (projectId) onProjectClick?.(projectId);
  };

  return (
    <div className="mb-2 flex flex-wrap items-center gap-1.5">
      {projectName && (
        <button
          type="button"
          onClick={handleProjectClick}
          className="flex max-w-full items-center gap-1 rounded-lg bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
        >
          <FolderOpen className="h-2.5 w-2.5 shrink-0 text-zinc-400" />
          <span className="truncate">{projectName}</span>
          <ExternalLink className="h-2 w-2 shrink-0 opacity-40" />
        </button>
      )}
      {clientName !== "No client" && (
        <span className="flex items-center gap-1 text-[10px] text-zinc-400">
          <User2 className="h-2.5 w-2.5" />
          <span className="truncate max-w-[80px]">{clientName}</span>
        </span>
      )}
    </div>
  );
}

function TaskCardFooter({ task }) {
  const due = formatDue(task.dueDate);
  const hasAttachment = task.creatorAttachment?.url || task.assigneeAttachment?.url;
  const commentCount = task.comments?.length || 0;
  const assigneeCount = task.assignees?.length || 0;

  return (
    <div className="flex items-center justify-between gap-2 pt-2.5 mt-1 border-t border-zinc-50">
      <div className="flex items-center gap-1.5 min-w-0">
        {assigneeCount > 0 ? (
          <div className="flex -space-x-1.5">
            {task.assignees.slice(0, 3).map((a) => (
              <Tooltip key={a._id} label={a.fullName} side="top">
                <div
                  className="relative h-6 w-6 rounded-full ring-2 ring-white overflow-hidden bg-zinc-200 flex items-center justify-center"
                >
                  {a.image
                    ? <Image src={a.image} alt={a.fullName} fill className="object-cover" />
                    : <User2 className="h-3 w-3 text-zinc-500" />
                  }
                </div>
              </Tooltip>
            ))}
            {assigneeCount > 3 && (
              <div className="h-6 w-6 rounded-full ring-2 ring-white bg-zinc-100 flex items-center justify-center text-[9px] font-semibold text-zinc-500">
                +{assigneeCount - 3}
              </div>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-zinc-400 italic">Unassigned</span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {hasAttachment && <Paperclip className="h-3 w-3 text-zinc-400" />}
        {commentCount > 0 && (
          <span className="flex items-center gap-0.5 rounded-md bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
            <MessageSquare className="h-3 w-3" />{commentCount}
          </span>
        )}
        {due && (
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${due.isOverdue ? "text-red-500" : "text-zinc-400"}`}>
            <Calendar className="h-3 w-3" />{due.str}
          </span>
        )}
      </div>
    </div>
  );
}

export default memo(function TaskCardContent({ task, showProject, priority, onProjectClick }) {
  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const deptName = getProjectDepartmentName(task.projectId);

  return (
    <>
      {/* Priority + Department in one row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priority.cardBadge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>
          {deptName && (
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50/80 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
              <Building2 className="h-2.5 w-2.5" />
              <span className="truncate max-w-[72px]">{deptName}</span>
            </span>
          )}
        </div>
        {!showProject && (
          <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusCfg.style}`}>
            {statusCfg.label}
          </span>
        )}
      </div>

      <TaskCardBadges task={task} showProject={showProject} onProjectClick={onProjectClick} />

      <p className="text-sm font-semibold text-zinc-800 leading-snug line-clamp-2 mb-1">{task.title}</p>

      {task.description && (
        <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-1 mb-1">
          {getPlainTextFromHtml(task.description)}
        </p>
      )}

      <TaskCardFooter task={task} />
    </>
  );
});
