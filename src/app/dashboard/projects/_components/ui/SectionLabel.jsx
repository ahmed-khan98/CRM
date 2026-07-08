"use client";

import { memo } from "react";

function SectionLabel({ icon: Icon, text }) {
  return (
    <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
      {Icon && <Icon className="h-3 w-3 text-zinc-400" />}
      {text}
    </p>
  );
}

export default memo(SectionLabel);
