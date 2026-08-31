"use client";

import { memo } from "react";
import { QUICK_EMOJIS } from "@/app/_Components/chat/chatUtils";

const EXTRA_EMOJIS = [
  "😀",
  "😁",
  "😅",
  "😍",
  "🤔",
  "👏",
  "🎉",
  "💯",
  "😎",
  "🤝",
  "😴",
  "🙌",
];

function EmojiPicker({ onPick }) {
  return (
    <div className="absolute bottom-12 left-0 z-30 grid w-56 grid-cols-8 gap-1 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl">
      {[...QUICK_EMOJIS, ...EXTRA_EMOJIS].map((em) => (
        <button
          key={em}
          type="button"
          className="text-lg hover:scale-110 cursor-pointer"
          onClick={() => onPick(em)}
        >
          {em}
        </button>
      ))}
    </div>
  );
}

export default memo(EmojiPicker);
