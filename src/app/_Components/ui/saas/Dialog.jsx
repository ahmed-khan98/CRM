"use client";

import { X } from "lucide-react";

const widths = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Dialog({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  size = "md",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="crm-dialog-title"
        aria-describedby={description ? "crm-dialog-desc" : undefined}
        className={`w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#050505] shadow-2xl ${
          widths[size] || widths.md
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <div className="min-w-0">
            <h2
              id="crm-dialog-title"
              className="text-lg font-semibold text-white"
            >
              {title}
            </h2>
            {description ? (
              <p id="crm-dialog-desc" className="mt-1 text-sm text-zinc-400">
                {description}
              </p>
            ) : null}
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="px-5 py-4 text-zinc-200">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-2 border-t border-white/[0.06] px-5 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
