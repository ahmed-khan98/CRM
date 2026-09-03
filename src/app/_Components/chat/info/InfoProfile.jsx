"use client";

import { memo } from "react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import { conversationAvatar, conversationTitle, isSelfChat } from "@/app/_Components/chat/chatUtils";

function InfoProfile({ active, myId, peer }) {
  const selfChat = isSelfChat(active, myId);
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-6">
      <Avatar
        src={conversationAvatar(active, myId)}
        name={conversationTitle(active, myId)}
        size="lg"
      />
      <p className="max-w-full truncate px-2 text-center text-lg font-bold">
        {conversationTitle(active, myId)}
      </p>
      {selfChat ? (
        <p className="text-center text-xs text-zinc-500">Message yourself</p>
      ) : peer ? (
        <div className="text-center text-xs text-zinc-500 space-y-0.5">
          {peer.designation ? <p>{peer.designation}</p> : null}
        </div>
      ) : null}
      {active.type === "group" && (
        <p className="text-center text-sm text-zinc-500">{active.description}</p>
      )}
    </div>
  );
}

export default memo(InfoProfile);
