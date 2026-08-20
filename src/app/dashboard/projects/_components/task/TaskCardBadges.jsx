"use client";

import { memo } from "react";
import { ExternalLink, FolderOpen, User2 } from "lucide-react";
import { getClientDisplayName } from "../utils";

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

export default memo(TaskCardBadges);
