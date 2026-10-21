"use client";

import { X } from "lucide-react";

export default function LeaveSlideOver({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = "max-w-lg",
  fill = false,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <button
        type="button"
        aria-label="Close panel"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        className={`relative flex h-full w-full ${width} flex-col overflow-hidden border-l border-white/[0.08] bg-[#050505] shadow-2xl`}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-white/[0.07] px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            {subtitle ? (
              <p className="mt-0.5 text-xs text-zinc-400">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div
          className={`min-h-0 flex-1 px-5 py-4 text-zinc-200 ${
            fill ? "flex flex-col overflow-hidden" : "overflow-y-auto"
          }`}
        >
          {children}
        </div>
        {footer ? (
          <div className="shrink-0 border-t border-white/[0.06] px-5 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
