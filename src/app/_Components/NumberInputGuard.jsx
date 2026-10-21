"use client";

import { useEffect } from "react";

/**
 * Globally: mouse-wheel on focused number inputs must not change the value.
 * Spinners are hidden via globals.css.
 */
export default function NumberInputGuard() {
  useEffect(() => {
    const onWheel = (e) => {
      const el = e.target;
      if (!(el instanceof HTMLInputElement)) return;
      if (el.type !== "number") return;
      if (document.activeElement !== el) return;
      e.preventDefault();
    };
    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () =>
      document.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  return null;
}
