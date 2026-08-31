"use client";

import { memo } from "react";
import ClickAway from "@/app/_Components/chat/ui/ClickAway";

/**
 * HOC: only mounts `Component` while `open`, and closes on outside click / Escape.
 * The wrapped component receives the original props plus `onClose`.
 */
export default function withClickAway(Component) {
  function ClickAwayBound({ open, onClose, wrapClassName, ...props }) {
    if (!open) return null;
    return (
      <ClickAway enabled onAway={onClose} className={wrapClassName}>
        <Component {...props} onClose={onClose} />
      </ClickAway>
    );
  }

  const name = Component.displayName || Component.name || "Component";
  ClickAwayBound.displayName = `withClickAway(${name})`;
  return memo(ClickAwayBound);
}
