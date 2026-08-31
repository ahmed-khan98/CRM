"use client";

import { memo } from "react";
import { Reply, X } from "lucide-react";
import IconButton from "@/app/_Components/chat/ui/IconButton";

function ReplyBar({ theme, replyTo, onCancel }) {
  if (!replyTo) return null;
  return (
    <div className={`flex items-center gap-2 border-t px-3 py-2 ${theme.header}`}>
      <Reply className="h-4 w-4 text-zinc-500" />
      <div className="min-w-0 flex-1 text-xs">
        <p className="font-semibold">Replying</p>
        <p className="truncate text-zinc-500">{replyTo.body || replyTo.type}</p>
      </div>
      <IconButton label="Cancel reply" onClick={onCancel}>
        <X className="h-4 w-4" />
      </IconButton>
    </div>
  );
}

export default memo(ReplyBar);
