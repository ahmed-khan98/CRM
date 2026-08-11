"use client";

import { memo } from "react";
import {
  Video,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
} from "lucide-react";
import Ticks from "@/app/_Components/chat/ChatTicks";
import { formatMessageClock } from "@/app/_Components/chat/chatUtils";

function CallMessageBubble({
  message,
  mine = false,
  timeLabel = "",
  receiptStatus = null,
}) {
  const status = (message.callMeta?.status || "").toLowerCase();
  const callType = message.callMeta?.callType || "voice";
  const duration = Number(message.callMeta?.duration) || 0;
  const isVideo = callType === "video";
  const missed =
    status === "missed" || status === "rejected" || status === "no_answer";
  const ended =
    status === "ended" || status === "accepted" || status === "completed";

  const mins = Math.floor(duration / 60);
  const secs = duration % 60;
  const durLabel =
    duration > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : null;

  let title;
  if (missed) {
    title = isVideo ? "Missed video call" : "Missed voice call";
  } else if (status === "rejected" || status === "declined") {
    title = "Call declined";
  } else if (ended || duration > 0) {
    title = isVideo ? "Video call" : "Voice call";
  } else if (status === "ringing" || status === "ongoing") {
    title = isVideo ? "Video call" : "Voice call";
  } else {
    title = isVideo ? "Video call" : "Voice call";
  }

  const Icon = missed
    ? PhoneMissed
    : isVideo
      ? Video
      : mine
        ? PhoneOutgoing
        : PhoneIncoming;

  const iconWrap = missed
    ? "bg-red-500/15 text-red-500"
    : mine
      ? "bg-white/15 text-zinc-100"
      : "bg-zinc-900/8 text-zinc-700";

  const subLeft = durLabel
    ? durLabel
    : missed
      ? "Tap to call back"
      : isVideo
        ? "Video"
        : "Voice";

  const clock = timeLabel || formatMessageClock(message.createdAt);

  return (
    <div className="flex items-center gap-2.5 px-0.5 py-1 min-w-[180px]">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconWrap}`}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-[12.5px] font-medium leading-tight ${
            missed ? "text-red-500" : ""
          }`}
        >
          {title}
        </p>
        <div
          className={`mt-0.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 text-[10.5px] leading-none ${
            mine ? "text-zinc-300" : "text-zinc-500"
          }`}
        >
          <span className="truncate">{subLeft}</span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-[10px] tabular-nums">
            {clock}
            {receiptStatus ? <Ticks status={receiptStatus} soft /> : null}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(CallMessageBubble);
