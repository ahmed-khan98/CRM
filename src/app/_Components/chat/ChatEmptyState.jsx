"use client";

import { memo } from "react";
import { Users } from "lucide-react";

function ChatEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-zinc-500 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200/80">
        <Users className="h-10 w-10 opacity-50" />
      </div>
      <p className="text-xl font-light text-zinc-700">CRM Chat</p>
      <p className="text-sm">Select a conversation to start messaging</p>
    </div>
  );
}

export default memo(ChatEmptyState);
