"use client";

import { memo } from "react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import { conversationAvatar, conversationTitle } from "@/app/_Components/chat/chatUtils";

function InfoProfile({ active, myId, peer }) {
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
      {peer && (
        <div className="text-center text-xs text-zinc-500 space-y-0.5">
          {peer.designation ? <p>{peer.designation}</p> : null}
        </div>
      )}
      {active.type === "group" && (
        <p className="text-center text-sm text-zinc-500">{active.description}</p>
      )}
    </div>
  );
}

export default memo(InfoProfile);
