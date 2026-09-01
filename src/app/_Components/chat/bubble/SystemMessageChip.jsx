"use client";

import { memo } from "react";

function SystemMessageChip({ theme, message }) {
  return (
    <div className="my-2 flex justify-center">
      <span className={`rounded-lg px-3 py-1 text-[11px] ${theme.dayChip}`}>
        {message.deletedForMe
          ? "You deleted this message"
          : message.deletedForEveryone
            ? message.body || "This message was deleted"
            : message.body}
      </span>
    </div>
  );
}

export default memo(SystemMessageChip);
