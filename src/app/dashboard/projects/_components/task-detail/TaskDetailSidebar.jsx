"use client";

import { memo } from "react";
import { Building2, Calendar, Clock, FolderOpen } from "lucide-react";
import MetaRow from "../ui/MetaRow";
import Avatar from "../ui/Avatar";
import { formatDate, getTaskProjectInfo } from "../utils";

function TaskDetailSidebar({ task, project, onProjectClick }) {
  const { projectId, projectName, departmentName } = getTaskProjectInfo(
    task,
    project
  );
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className="hidden sm:flex sm:w-52 shrink-0 border-l border-white/[0.07] bg-[#121820] px-4 py-4 flex-col gap-4 overflow-y-auto custom-scrollbar-dark">
      {(projectName || departmentName) && (
        <>
          {projectName && (
            <MetaRow label="Project">
              {onProjectClick && projectId ? (
                <button
                  type="button"
                  onClick={() => onProjectClick(projectId)}
                  className="flex items-center gap-1.5 text-xs font-normal text-zinc-200 hover:text-white transition cursor-pointer text-left"
                >
                  <FolderOpen className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                  <span className="leading-snug">{projectName}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-zinc-200">
                  <FolderOpen className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                  <span className="leading-snug">{projectName}</span>
                </div>
              )}
            </MetaRow>
          )}

          {departmentName && (
            <MetaRow label="Department">
              <div className="flex items-center gap-1.5 text-zinc-200">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                <span className="capitalize leading-snug">{departmentName}</span>
              </div>
            </MetaRow>
          )}
        </>
      )}

      <MetaRow label="Created by">
        <div className="flex items-center gap-2">
          <Avatar user={task.createdBy} size={7} />
          <div className="min-w-0">
            <p className="capitalize leading-tight text-zinc-200">
              {task.createdBy?.fullName || "—"}
            </p>
            {task.createdBy?.departmentId?.name && (
              <p className="text-[10px] text-zinc-500 capitalize mt-0.5">
                {task.createdBy.departmentId.name}
              </p>
            )}
          </div>
        </div>
      </MetaRow>

      {task.dueDate && (
        <MetaRow label="Due date">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            <span className={isOverdue ? "text-red-400 font-medium" : "text-zinc-200"}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        </MetaRow>
      )}

      {task.assignees?.length > 0 && (
        <MetaRow label="Assignees">
          <div className="flex flex-col gap-2.5">
            {task.assignees.map((a) => (
              <div key={a._id} className="flex items-center gap-2">
                <Avatar user={a} size={6} />
                <div className="min-w-0">
                  <p className="capitalize leading-tight text-zinc-200">
                    {a.fullName}
                  </p>
                  {a.departmentId?.name && (
                    <p className="text-[10px] text-zinc-500 capitalize mt-0.5">
                      {a.departmentId.name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </MetaRow>
      )}

      <MetaRow label="Created">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-zinc-400">{formatDate(task.createdAt)}</span>
        </div>
      </MetaRow>
    </div>
  );
}

export default memo(TaskDetailSidebar);
