"use client";

import { memo } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../constants";
import Tooltip from "@/app/_Components/ui/Tooltip";

const DARK_PRIORITY = {
  critical: "bg-red-500/15 text-red-300 border-red-500/25",
  high: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/25",
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
};

const DARK_STATUS = {
  todo: "bg-white/5 text-zinc-300 border-white/10",
  "in-progress": "bg-blue-500/15 text-blue-300 border-blue-500/25",
  "in-review": "bg-amber-500/15 text-amber-300 border-amber-500/25",
  done: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
};

function TaskDetailHeader({ task, onClose, onEdit, onDelete, canEdit, canDelete }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const priorityClass = DARK_PRIORITY[task.priority] || DARK_PRIORITY.medium;
  const statusClass = DARK_STATUS[task.status] || DARK_STATUS.todo;

  return (
    <div className="shrink-0 border-b border-white/[0.07] bg-[#0f1419] px-5 pt-4 pb-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${priorityClass}`}
            >
              <span className={`h-1 w-1 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
            <span
              className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${statusClass}`}
            >
              {statusCfg.label}
            </span>
          </div>
          <h2 className="text-base font-semibold text-white leading-snug">
            {task.title}
          </h2>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {canEdit && (
            <Tooltip label="Edit task" side="bottom">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit?.(task);
                }}
                aria-label="Edit task"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-zinc-100 transition cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
          )}
          {canDelete && (
            <Tooltip label="Delete task" side="bottom">
              <button
                type="button"
                onClick={() => onDelete?.(task)}
                aria-label="Delete task"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
          )}
          <Tooltip label="Close" side="bottom">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-zinc-100 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default memo(TaskDetailHeader);
