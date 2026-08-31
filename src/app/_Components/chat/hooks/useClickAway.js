"use client";

import { useEffect } from "react";

/**
 * Calls `onAway` on outside pointerdown or Escape while `enabled`.
 * Pass a ref that wraps both the trigger and the panel so the toggle
 * click is not treated as an outside click.
 */
export default function useClickAway(ref, onAway, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (e) => {
      if (ref?.current?.contains(e.target)) return;
      onAway?.(e);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") onAway?.(e);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, onAway, enabled]);
}
