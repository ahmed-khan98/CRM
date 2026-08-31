"use client";

import { memo } from "react";
import { PhoneCall, Video } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import { conversationAvatar, conversationTitle } from "@/app/_Components/chat/chatUtils";

function HeaderCallButtons({ active, activeId, myId, peer, startOutgoing }) {
  if (!(peer || active.type === "group")) return null;

  const start = (callType) =>
    startOutgoing({
      conversationId: activeId,
      peerUserId: active.type === "group" ? undefined : peer?._id,
      peer: active.type === "group" ? undefined : peer || null,
      callType,
      groupCall: active.type === "group",
      groupName: active.type === "group" ? conversationTitle(active, myId) : undefined,
      groupImage: active.type === "group" ? conversationAvatar(active, myId) : undefined,
    });

  return (
    <>
      <ChatTooltip
        label={active.type === "group" ? "Group voice call" : "Voice call"}
        side="bottom"
      >
        <button
          type="button"
          aria-label="Voice call"
          className="rounded-full p-1.5 hover:bg-black/5 cursor-pointer sm:p-2"
          onClick={() => start("voice")}
        >
          <PhoneCall className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </button>
      </ChatTooltip>
      <ChatTooltip
        label={active.type === "group" ? "Group video call" : "Video call"}
        side="bottom"
      >
        <button
          type="button"
          aria-label="Video call"
          className="rounded-full p-1.5 hover:bg-black/5 cursor-pointer sm:p-2"
          onClick={() => start("video")}
        >
          <Video className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </button>
      </ChatTooltip>
    </>
  );
}

export default memo(HeaderCallButtons);
