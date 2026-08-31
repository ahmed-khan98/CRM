"use client";

import { memo } from "react";

function ReplyQuote({ mine, replyTo }) {
  if (!replyTo) return null;
  return (
    <div
      className={`mb-1 rounded-md border-l-4 px-2 py-1 text-xs ${
        mine ? "border-zinc-400 bg-black/20" : "border-zinc-500 bg-black/[0.04]"
      }`}
    >
      <p className="font-semibold opacity-80 truncate">
        {(replyTo.senderId?.fullName || "Reply").split(" ")[0]}
      </p>
      <p className="opacity-70 truncate">{(replyTo.body || replyTo.type || "").slice(0, 80)}</p>
    </div>
  );
}

export default memo(ReplyQuote);
