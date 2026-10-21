"use client";

import { memo } from "react";
import { Check, Download, Loader2 } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";

/**
 * WhatsApp-style circular download button.
 * progress: null = idle | number 0–99 = downloading | 100 = done (brief)
 * indeterminate: true when server didn't send Content-Length
 */
function DownloadProgressBtn({
  progress = null,
  indeterminate = false,
  done = false,
  onClick,
  disabled = false,
  label = "Download",
  size = 32,
  className = "",
  iconClassName = "h-4 w-4",
  color = "currentColor",
}) {
  const busy = progress != null || indeterminate;
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const pct = typeof progress === "number" ? Math.max(0, Math.min(100, progress)) : 0;
  const dashOffset = c - (pct / 100) * c;

  const tip = done
    ? "Downloaded"
    : indeterminate
      ? "Downloading…"
      : busy
        ? `Downloading ${pct}%`
        : label;

  return (
    <ChatTooltip label={tip} side="top">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || busy}
        aria-label={tip}
        className={`relative flex shrink-0 items-center justify-center rounded-full disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed ${className}`}
        style={{ width: size, height: size, color }}
      >
        {(busy || done) && (
          <svg
            className="pointer-events-none absolute inset-0 -rotate-90"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            aria-hidden
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="2.5"
            />
            {indeterminate && !done ? (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray={`${c * 0.25} ${c}`}
                className="animate-spin origin-center"
                style={{ transformOrigin: "center" }}
              />
            ) : (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={done ? 0 : dashOffset}
                style={{ transition: "stroke-dashoffset 0.15s linear" }}
              />
            )}
          </svg>
        )}
        {done ? (
          <Check className={iconClassName} stroke="currentColor" />
        ) : indeterminate && busy ? (
          <Loader2 className={`${iconClassName} animate-spin`} stroke="currentColor" />
        ) : busy ? (
          <span className="text-[9px] font-bold tabular-nums leading-none">{pct}</span>
        ) : (
          <Download className={iconClassName} stroke="currentColor" />
        )}
      </button>
    </ChatTooltip>
  );
}

export default memo(DownloadProgressBtn);
