"use client";

import { memo, useRef } from "react";
import { Pin, MoreVertical } from "lucide-react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import {
  conversationTitle,
  conversationAvatar,
  formatChatTime,
  lastMessagePreview,
} from "@/app/_Components/chat/chatUtils";

function ConversationRow({
  conv,
  selected,
  myId,
  dark,
  theme,
  online,
  onOpen,
  onOpenMenu,
}) {
  const title = conversationTitle(conv, myId);
  const avatar = conversationAvatar(conv, myId);
  const longPressTimer = useRef(null);
  const didLongPress = useRef(false);

  const clearLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const startLongPress = () => {
    didLongPress.current = false;
    clearLongPress();
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onOpenMenu?.(conv);
    }, 450);
  };

  return (
    <div
      className={`flex w-full items-center border-b text-left transition select-none md:select-auto ${
        dark ? "border-white/[0.06]" : "border-zinc-100"
      } ${
        selected
          ? dark
            ? "bg-white/[0.08]"
            : "bg-[#f0f2f5]"
          : "hover:bg-black/[0.03]"
      }`}
      style={{ WebkitTouchCallout: "none" }}
      onTouchStart={onOpenMenu ? startLongPress : undefined}
      onTouchEnd={onOpenMenu ? clearLongPress : undefined}
      onTouchMove={onOpenMenu ? clearLongPress : undefined}
      onTouchCancel={onOpenMenu ? clearLongPress : undefined}
    >
      <button
        type="button"
        onClick={() => {
          if (didLongPress.current) {
            didLongPress.current = false;
            return;
          }
          onOpen(conv._id);
        }}
        className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
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
              <span
                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${theme.unread}`}
              >
                {conv.unreadCount}
              </span>
            )}
          </div>
        </div>
      </button>
      {onOpenMenu && (
        <button
          type="button"
          aria-label="Chat options"
          className="md:hidden shrink-0 rounded-full p-2 mr-1 text-zinc-500 hover:bg-black/5"
          onClick={(e) => {
            e.stopPropagation();
            onOpenMenu(conv);
          }}
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export default memo(ConversationRow);
