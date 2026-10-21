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

function EmojiPicker({ onPick, dark = false, theme }) {
  const menu = theme?.menu || (dark
    ? "bg-[#111113] text-zinc-100 border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
    : "bg-white border-zinc-200 shadow-xl");
  return (
    <div className={`absolute bottom-12 left-0 z-30 grid w-56 grid-cols-8 gap-1 rounded-xl border p-2 ${menu}`}>
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
