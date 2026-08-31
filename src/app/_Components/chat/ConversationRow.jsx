"use client";

import { memo, useRef } from "react";
import {
  Pin,
  MoreVertical,
  Image as ImageIcon,
  FileText,
  Video,
  Mic,
  Phone,
} from "lucide-react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import Ticks from "@/app/_Components/chat/ChatTicks";
import {
  conversationTitle,
  conversationAvatar,
  formatChatTime,
  lastMessagePreviewMeta,
  lastMessageTickStatus,
} from "@/app/_Components/chat/chatUtils";

const PREVIEW_ICONS = {
  image: ImageIcon,
  file: FileText,
  video: Video,
  audio: Mic,
  call: Phone,
};

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
  const preview = lastMessagePreviewMeta(conv.lastMessage);
  const PreviewIcon = PREVIEW_ICONS[preview.kind];
  const tickStatus = lastMessageTickStatus(conv, myId);
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
      className={`flex w-full cursor-pointer items-center border-b text-left transition select-none md:select-auto ${
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
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-3 py-3 text-left"
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
            <p className="flex min-w-0 items-center gap-1 text-xs text-zinc-500">
              {conv.myMeta?.pinned && (
                <Pin className="h-3 w-3 shrink-0 text-zinc-400" />
              )}
              {tickStatus && <Ticks status={tickStatus} />}
              {PreviewIcon && (
                <PreviewIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400" strokeWidth={2} />
              )}
              <span className="truncate">{preview.text}</span>
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
          className="md:hidden shrink-0 rounded-full p-2 mr-1 text-zinc-500 hover:bg-black/5 cursor-pointer"
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
