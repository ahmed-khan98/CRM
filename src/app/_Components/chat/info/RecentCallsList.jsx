"use client";

import { memo } from "react";
import { formatChatTime } from "@/app/_Components/chat/chatUtils";

function RecentCallsList({ callsData }) {
  return (
    <>
      <p className="text-xs font-bold uppercase text-zinc-500 pt-2">Recent calls</p>
      {(callsData?.data || []).slice(0, 5).map((c) => (
        <div key={c._id} className="flex justify-between text-xs text-zinc-600">
          <span className="capitalize">
            {c.callType} · {c.status}
          </span>
          <span>{formatChatTime(c.createdAt)}</span>
        </div>
      ))}
    </>
  );
}

export default memo(RecentCallsList);
