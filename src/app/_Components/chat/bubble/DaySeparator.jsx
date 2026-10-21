"use client";

import { memo } from "react";
import { formatDaySeparator } from "@/app/_Components/chat/chatUtils";

function DaySeparator({ theme, date }) {
  return (
    <div className="my-3 flex justify-center sticky top-1 z-[1]">
      <span className={`rounded-full px-3 py-1 text-[10.5px] font-semibold tracking-wide ${theme.dayChip}`}>
        {formatDaySeparator(date)}
      </span>
    </div>
  );
}

export default memo(DaySeparator);
