"use client";

import { memo } from "react";
// import { Moon, Sun } from "lucide-react"; // dark/light toggle (commented out)
import { Plus } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import IconButton from "@/app/_Components/chat/ui/IconButton";

function SidebarHeader({ theme, dark, connected, onToggleDark, onNewChat }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3.5 ${theme.header}`}>
      <div className="min-w-0">
        <h1 className="text-[17px] font-semibold tracking-tight">Messages</h1>
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              connected ? "bg-emerald-500" : "bg-amber-400 animate-pulse"
            }`}
          />
          <p className="text-[11px] font-medium text-zinc-500">
            {connected ? "Online" : "Connecting…"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {/* Dark / Light mode toggle — temporarily hidden
        <ChatTooltip label={dark ? "Light mode" : "Dark mode"} side="bottom">
          <IconButton
            label={dark ? "Light mode" : "Dark mode"}
            onClick={onToggleDark}
            className={`rounded-xl p-2 transition ${theme.iconBtn}`}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </IconButton>
        </ChatTooltip>
        */}
        <ChatTooltip label="New chat" side="bottom">
          <IconButton
            label="New chat"
            onClick={onNewChat}
            className={`rounded-xl p-2 transition ${theme.accent}`}
          >
            <Plus className="h-4 w-4" />
          </IconButton>
        </ChatTooltip>
      </div>
    </div>
  );
}

export default memo(SidebarHeader);
