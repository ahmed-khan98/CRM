"use client";

import { memo } from "react";
import { QUICK_EMOJIS } from "@/app/_Components/chat/chatUtils";

function QuickReactBar({ messageId, onReact }) {
  return (
    <div className="absolute -top-3 right-2 hidden gap-0.5 rounded-full border border-zinc-200 bg-white px-1 py-0.5 shadow group-hover:flex">
      {QUICK_EMOJIS.slice(0, 5).map((em) => (
        <button
          key={em}
          type="button"
          className="text-sm hover:scale-110"
          onClick={() => onReact(messageId, em)}
        >
          {em}
        </button>
      ))}
    </div>
  );
}

export default memo(QuickReactBar);
