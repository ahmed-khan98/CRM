"use client";

import { memo } from "react";

function MetaRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-medium text-zinc-500">{label}</p>
      <div className="text-xs font-normal text-zinc-800">{children}</div>
    </div>
  );
}

export default memo(MetaRow);
