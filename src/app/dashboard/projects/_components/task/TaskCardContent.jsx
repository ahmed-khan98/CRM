"use client";

import { memo } from "react";
import { Building2 } from "lucide-react";
import { STATUS_CONFIG } from "../constants";
import { getPlainTextFromHtml, getProjectDepartmentName } from "../utils";
import TaskCardBadges from "./TaskCardBadges";
import TaskCardFooter from "./TaskCardFooter";

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
