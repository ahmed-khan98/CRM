"use client";

import { memo } from "react";
import { formatDisplayName } from "@/app/_Components/chat/chatUtils";

function replyTargetId(replyTo) {
  if (!replyTo) return null;
  if (typeof replyTo === "string") return replyTo;
  return replyTo._id || replyTo.id || null;
}

function ReplyQuote({ mine, replyTo, onJump }) {
  if (!replyTo) return null;
  const targetId = replyTargetId(replyTo);
  const clickable = Boolean(targetId && onJump);

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={
        clickable
          ? (e) => {
              e.stopPropagation();
              onJump(targetId);
            }
          : undefined
      }
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onJump(targetId);
              }
            }
          : undefined
      }
      className={`mb-1 rounded-md border-l-4 px-2 py-1 text-xs ${
        mine ? "border-zinc-200 bg-black/20" : "border-zinc-500 bg-black/[0.04]"
      } ${clickable ? "cursor-pointer hover:brightness-110 active:scale-[0.99] transition" : ""}`}
      title={clickable ? "Jump to message" : undefined}
    >
      <p className="font-semibold opacity-80 truncate">
        {(formatDisplayName(replyTo.senderId?.fullName) || "Reply").split(" ")[0]}
      </p>
      <p className="opacity-70 truncate">
        {(replyTo.body || replyTo.type || "").slice(0, 80)}
      </p>
    </div>
  );
}

export default memo(ReplyQuote);
