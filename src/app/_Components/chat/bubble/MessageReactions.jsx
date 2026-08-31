"use client";

import { memo } from "react";

function MessageReactions({ reactions, mine }) {
  if (!reactions?.length) return null;
  return (
    <div className="mt-0.5 flex flex-wrap gap-1">
      {reactions.map((r, i) => (
        <span
          key={`${r.emoji}-${i}`}
          className={`rounded-full px-1.5 text-xs shadow-sm ${
            mine ? "bg-black/25" : "bg-zinc-100"
          }`}
        >
          {r.emoji}
        </span>
      ))}
    </div>
  );
}

export default memo(MessageReactions);
