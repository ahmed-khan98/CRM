"use client";

import { memo } from "react";
import { Calendar, MessageSquare, Paperclip, User2 } from "lucide-react";
import Image from "next/image";
import { formatDue } from "../utils";
import Tooltip from "@/app/_Components/ui/Tooltip";

function TaskCardFooter({ task }) {
  const due = formatDue(task.dueDate);
  const hasAttachment = task.creatorAttachment?.length > 0 || task.assigneeAttachment?.length > 0;
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

export default memo(TaskCardFooter);
