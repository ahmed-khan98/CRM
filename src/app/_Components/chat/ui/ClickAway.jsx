"use client";

import { memo, useCallback, useRef } from "react";
import useClickAway from "@/app/_Components/chat/hooks/useClickAway";

/** Wraps trigger + panel. Outside click / Escape runs `onAway`. */
function ClickAway({ enabled, onAway, className, children }) {
  const ref = useRef(null);
  const handleAway = useCallback(() => onAway?.(), [onAway]);
  useClickAway(ref, handleAway, enabled);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default memo(ClickAway);
