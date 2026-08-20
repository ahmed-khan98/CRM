"use client";

import { memo } from "react";

function InfoItem({ label, value, capitalize = false }) {
  return (
    <div>
      <p className="text-[11px] text-zinc-500 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold text-zinc-900 break-words ${capitalize ? "capitalize" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}

export default memo(InfoItem);
