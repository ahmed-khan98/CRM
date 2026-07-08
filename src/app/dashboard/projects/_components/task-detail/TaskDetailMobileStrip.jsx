"use client";

import { memo } from "react";
import { Building2, Calendar, Clock, FolderOpen } from "lucide-react";
import Avatar from "../ui/Avatar";
import { formatDate, getTaskProjectInfo } from "../utils";

function TaskDetailMobileStrip({ task, project, onProjectClick }) {
  const { projectId, projectName, departmentName } = getTaskProjectInfo(task, project);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className="sm:hidden shrink-0 border-b border-zinc-100 bg-zinc-50/60 px-4 py-2.5">
      {(projectName || departmentName) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 text-xs text-zinc-700">
          {projectName && (
            onProjectClick && projectId ? (
              <button
                type="button"
                onClick={() => onProjectClick(projectId)}
                className="inline-flex items-center gap-1 font-medium hover:text-zinc-900 cursor-pointer"
              >
                <FolderOpen className="h-3 w-3 text-zinc-400" />
                {projectName}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1">
                <FolderOpen className="h-3 w-3 text-zinc-400" />
                {projectName}
              </span>
            )
          )}
          {projectName && departmentName && <span className="text-zinc-300">·</span>}
          {departmentName && (
            <span className="inline-flex items-center gap-1 capitalize">
              <Building2 className="h-3 w-3 text-zinc-400" />
              {departmentName}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-600">
        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : ""}`}>
            <Calendar className="h-3 w-3" />
            {formatDate(task.dueDate)}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDate(task.createdAt)}
        </span>
        {task.createdBy && (
          <span className="inline-flex items-center gap-1 capitalize">
            <Avatar user={task.createdBy} size={5} />
            {task.createdBy.fullName}
          </span>
        )}
      </div>

      {task.assignees?.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-zinc-100/80">
          <div className="flex -space-x-1">
            {task.assignees.slice(0, 4).map((a) => (
              <Avatar key={a._id} user={a} size={5} />
            ))}
          </div>
          <span className="text-[11px] text-zinc-500 truncate">
            {task.assignees.map((a) => a.fullName).join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}

export default memo(TaskDetailMobileStrip);
