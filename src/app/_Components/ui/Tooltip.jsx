"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Shared CRM tooltip — replaces native browser `title` tooltips.
 * Renders via portal + fixed positioning so it never causes parent overflow/scroll.
 * Usage: <Tooltip label="Save"><button>...</button></Tooltip>
 */
export default function Tooltip({
  label,
  title,
  text,
  children,
  side = "bottom",
  className = "",
  delay = false,
}) {
  const tip = label || title || text;
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [mounted, setMounted] = useState(false);
  const tipId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 8;
    let top = 0;
    let left = 0;
    let transform = "";

    if (side === "top") {
      top = r.top - gap;
      left = r.left + r.width / 2;
      transform = "translate(-50%, -100%)";
    } else if (side === "left") {
      top = r.top + r.height / 2;
      left = r.left - gap;
      transform = "translate(-100%, -50%)";
    } else if (side === "right") {
      top = r.top + r.height / 2;
      left = r.right + gap;
      transform = "translate(0, -50%)";
    } else {
      top = r.bottom + gap;
      left = r.left + r.width / 2;
      transform = "translate(-50%, 0)";
    }

    setCoords({ top, left, transform });
  }, [side]);

  const show = () => {
    updatePosition();
    setOpen(true);
  };

  const hide = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updatePosition]);

  if (!tip) return children;

  const arrow =
    side === "top"
      ? "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-zinc-900"
      : side === "left"
        ? "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-zinc-900"
        : side === "right"
          ? "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-zinc-900"
          : "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-zinc-900";

  return (
    <span
      ref={triggerRef}
      className={`relative inline-flex shrink-0 ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={open ? tipId : undefined}
    >
      {children}
      {mounted &&
        open &&
        coords &&
        createPortal(
          <span
            id={tipId}
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: coords.transform,
            }}
            className={`pointer-events-none z-[9999] max-w-[280px] rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-50 shadow-lg shadow-black/30 ring-1 ring-white/10 ${
              String(tip).length > 48
                ? "whitespace-normal break-words text-left"
                : "whitespace-nowrap"
            } ${delay ? "delay-300" : ""}`}
          >
            {tip}
            <span
              className={`absolute h-0 w-0 border-[5px] ${arrow}`}
              aria-hidden
            />
          </span>,
          document.body
        )}
    </span>
  );
}
