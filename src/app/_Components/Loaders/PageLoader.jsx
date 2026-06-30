"use client";

import { memo } from "react";
import { Loader2 } from "lucide-react";

function PageLoader({
  title = "Loading",
  subtitle = "Preparing your workspace...",
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-xl shadow-zinc-200/70">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-zinc-900/[0.04]" />
        <div className="pointer-events-none absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-indigo-500/[0.06]" />

        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border border-zinc-200 bg-zinc-50">
          <Loader2 className="h-7 w-7 animate-spin text-zinc-900" />
        </div>
        <h2 className="relative mt-4 text-base font-black text-zinc-900">
          {title}
        </h2>
        <p className="relative mt-1 text-xs font-semibold text-zinc-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default memo(PageLoader);
