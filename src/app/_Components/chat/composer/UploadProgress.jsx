"use client";

import { memo } from "react";

function UploadProgress({ uploadPct }) {
  if (uploadPct == null) return null;
  return (
    <div className="px-4 py-1">
      <div className="h-1 overflow-hidden rounded bg-zinc-200">
        <div
          className="h-full bg-zinc-900 transition-all"
          style={{ width: `${uploadPct}%` }}
        />
      </div>
    </div>
  );
}

export default memo(UploadProgress);
