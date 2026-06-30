"use client";

import { memo } from "react";
import { Loader2 } from "lucide-react";

function TableLoader({
  title = "Loading data",
  rows = 5,
  dark = false,
  className = "",
}) {
  const shellClass = dark
    ? "border-zinc-800 bg-zinc-900 text-zinc-100"
    : "border-zinc-200 bg-white text-zinc-900";
  const lineClass = dark ? "bg-zinc-800" : "bg-zinc-100";

  return (
    <div
      className={`rounded-3xl border p-4 shadow-lg ${shellClass} ${className}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-current/10 bg-current/[0.04]">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        <div>
          <p className="text-sm font-black">{title}</p>
          <p className="text-[11px] font-semibold opacity-50">
            Please wait a moment
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={`h-10 animate-pulse rounded-2xl ${lineClass}`}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(TableLoader);
