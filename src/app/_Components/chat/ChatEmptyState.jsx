"use client";

import { memo } from "react";
import { MessageSquare } from "lucide-react";

function ChatEmptyState({ dark = false }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
          dark
            ? "bg-white/[0.06] text-zinc-300 ring-1 ring-white/10"
            : "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
        }`}
      >
        <MessageSquare className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <div className="space-y-1.5">
        <p className={`text-lg font-semibold tracking-tight ${dark ? "text-zinc-100" : "text-zinc-900"}`}>
          Select a conversation
        </p>
        <p className="max-w-xs text-[13px] leading-relaxed text-zinc-500">
          Choose a teammate from the left, or start a new chat to keep work in one place.
        </p>
      </div>
    </div>
  );
}

export default memo(ChatEmptyState);
