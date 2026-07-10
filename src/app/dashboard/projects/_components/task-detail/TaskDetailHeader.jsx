"use client";

import { memo } from "react";
import { Edit2, Trash2, X } from "lucide-react";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "../constants";

function TaskDetailHeader({ task, onClose, onEdit, onDelete, canEdit, canDelete }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;

  return (
    <div className="shrink-0 border-b border-zinc-100 bg-white px-5 pt-4 pb-2">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${priority.badge}`}>
              <span className={`h-1 w-1 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
            <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${statusCfg.style}`}>
              {statusCfg.label}
            </span>
          </div>
          <h2 className="text-base font-semibold text-zinc-900 leading-snug">{task.title}</h2>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {canEdit && (
            <button type="button" onClick={() => { onClose(); onEdit?.(task); }} title="Edit task"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition cursor-pointer">
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
          {canDelete && (
            <button type="button" onClick={() => onDelete?.(task)} title="Delete task"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition cursor-pointer">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-100 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 transition cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(TaskDetailHeader);
