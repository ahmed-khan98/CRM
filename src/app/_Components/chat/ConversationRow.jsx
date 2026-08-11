"use client";

import { memo } from "react";
import { Pin } from "lucide-react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import {
  conversationTitle,
  conversationAvatar,
  formatChatTime,
  lastMessagePreview,
} from "@/app/_Components/chat/chatUtils";

function ConversationRow({ conv, selected, myId, dark, theme, online, onOpen }) {
  const title = conversationTitle(conv, myId);
  const avatar = conversationAvatar(conv, myId);

  return (
    <button
      type="button"
      onClick={() => onOpen(conv._id)}
      className={`flex w-full items-center gap-3 px-3 py-3 text-left transition ${
        selected
          ? dark
            ? "bg-white/[0.08]"
            : "bg-[#f0f2f5]"
          : "hover:bg-black/[0.03]"
      }`}
    >
      <Avatar src={avatar} name={title} online={online} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-semibold text-sm">{title}</span>
          <span className="shrink-0 text-[11px] text-zinc-500">
            {formatChatTime(conv.lastMessage?.createdAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="truncate text-xs text-zinc-500">
            {conv.myMeta?.pinned && (
              <Pin className="mr-1 inline h-3 w-3 text-zinc-400" />
            )}
            {lastMessagePreview(conv.lastMessage)}
          </p>
          {conv.unreadCount > 0 && (
            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${theme.unread}`}>
              {conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default memo(ConversationRow);
