"use client";

import { memo } from "react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import {
  conversationAvatar,
  conversationTitle,
  formatChatTime,
  isSelfChat,
} from "@/app/_Components/chat/chatUtils";

function HeaderIdentity({
  active,
  myId,
  peer,
  peerOnline,
  peerPresence,
  typingLabel,
  recordingLabel,
  onOpenInfo,
}) {
  const selfChat = isSelfChat(active, myId);
  return (
    <button
      type="button"
      className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 overflow-hidden text-left sm:gap-3"
      onClick={onOpenInfo}
    >
      <Avatar
        src={conversationAvatar(active, myId)}
        name={conversationTitle(active, myId)}
        online={selfChat ? false : peerOnline}
        size="sm"
      />
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="truncate text-sm font-semibold leading-tight sm:text-[15px]">
          {conversationTitle(active, myId)}
        </p>
        <p className="truncate text-[11px] leading-tight text-zinc-500 sm:text-xs">
          {recordingLabel.length
            ? `${recordingLabel.join(", ")} recording…`
            : typingLabel.length
              ? `${typingLabel.join(", ")} typing…`
              : selfChat
                ? "Message yourself"
                : peer
                  ? peerOnline
                    ? "\u00A0"
                    : peerPresence?.lastSeen
                      ? `last seen ${formatChatTime(peerPresence.lastSeen)}`
                      : ""
                  : `${active.participants?.length || 0} members`}
        </p>
      </div>
    </button>
  );
}

export default memo(HeaderIdentity);
