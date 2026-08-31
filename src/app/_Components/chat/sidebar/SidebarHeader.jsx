"use client";

import { memo } from "react";
import { Plus } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import IconButton from "@/app/_Components/chat/ui/IconButton";

function SidebarHeader({ theme, dark, connected, onToggleDark, onNewChat }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 border-b ${theme.header}`}>
      <div>
        <h1 className="text-lg font-bold">Chats</h1>
        <p className="text-[11px] text-zinc-500">{connected ? "Connected" : "Connecting…"}</p>
      </div>
      <div className="flex items-center gap-1">
        <ChatTooltip label={dark ? "Light mode" : "Dark mode"} side="bottom">
          <IconButton
            label={dark ? "Light mode" : "Dark mode"}
            onClick={onToggleDark}
            className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {dark ? "Light" : "Dark"}
          </IconButton>
        </ChatTooltip>
        <ChatTooltip label="New chat" side="bottom">
          <IconButton
            label="New chat"
            onClick={onNewChat}
            className="rounded-full p-2 hover:bg-black/5"
          >
            <Plus className="h-5 w-5" />
          </IconButton>
        </ChatTooltip>
      </div>
    </div>
  );
}

export default memo(SidebarHeader);
