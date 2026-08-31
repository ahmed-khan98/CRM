"use client";

import { memo } from "react";
import { Star } from "lucide-react";
import Ticks from "@/app/_Components/chat/ChatTicks";
import { formatMessageClock } from "@/app/_Components/chat/chatUtils";

function MessageMeta({ message, myId, mine, status }) {
  return (
    <div
      className={`mt-0.5 flex items-center justify-end gap-1 text-[11px] leading-none select-none ${
        mine ? "text-zinc-300" : "text-zinc-500"
      }`}
    >
      {message.editedAt && <span className="italic">edited</span>}
      {message.starredBy?.some((id) => id === myId || id?.toString() === myId) && (
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      )}
      <span>{formatMessageClock(message.createdAt)}</span>
      {mine && <Ticks status={status} soft />}
    </div>
  );
}

export default memo(MessageMeta);
