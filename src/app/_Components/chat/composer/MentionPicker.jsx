"use client";

import { memo } from "react";
import Avatar from "@/app/_Components/chat/ChatAvatar";

function MentionPicker({ candidates, activeIndex, onPick }) {
  if (!candidates?.length) return null;
  return (
    <div className="absolute bottom-full left-0 right-0 z-40 mb-1 max-h-52 overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-xl">
      {candidates.map((u, idx) => (
        <button
          key={u._id || idx}
          type="button"
          className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-zinc-50 cursor-pointer ${
            idx === activeIndex ? "bg-zinc-100" : ""
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            onPick(u);
          }}
        >
          <Avatar src={u.image} name={u.fullName} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">{u.fullName}</p>
            {u.designation ? (
              <p className="truncate text-[11px] text-zinc-500">{u.designation}</p>
            ) : null}
          </div>
        </button>
      ))}
    </div>
  );
}

export default memo(MentionPicker);
