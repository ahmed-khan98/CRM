"use client";

import { memo, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import { formatDisplayName } from "@/app/_Components/chat/chatUtils";

function MentionPicker({
  candidates,
  activeIndex,
  onPick,
  dark = false,
  theme,
  anchorRef,
  open = false,
}) {
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const update = () => {
      const el = anchorRef?.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({
        left: r.left,
        width: Math.max(r.width, 220),
        bottom: window.innerHeight - r.top + 6,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, anchorRef, candidates?.length]);

  if (!open || typeof document === "undefined" || !pos) return null;

  const menu =
    theme?.menu ||
    (dark
      ? "bg-[#111113] text-zinc-100 border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
      : "bg-white border-zinc-200 shadow-xl");
  const hover =
    theme?.menuItem || (dark ? "hover:bg-white/[0.06]" : "hover:bg-zinc-50");
  const activeRow = dark ? "bg-white/[0.08]" : "bg-zinc-50";

  const panel = (
    <div
      className={`fixed z-[80] max-h-52 overflow-y-auto rounded-xl border py-1 ${menu}`}
      style={{
        left: pos.left,
        bottom: pos.bottom,
        width: pos.width,
      }}
      role="listbox"
      aria-label="Mention people"
    >
      {!candidates?.length ? (
        <p className="px-3 py-2.5 text-sm text-zinc-500">No members to mention</p>
      ) : (
        candidates.map((u, idx) => (
          <button
            key={u._id || idx}
            type="button"
            role="option"
            aria-selected={idx === activeIndex}
            className={`flex w-full items-center gap-2 px-3 py-2 text-left cursor-pointer ${hover} ${
              idx === activeIndex ? activeRow : ""
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(u);
            }}
          >
            <Avatar
              src={u.image}
              name={formatDisplayName(u.fullName)}
              size="sm"
            />
            <div className="min-w-0">
              <p
                className={`truncate text-sm font-medium ${
                  dark ? "text-zinc-100" : "text-zinc-900"
                }`}
              >
                {formatDisplayName(u.fullName) || "Someone"}
              </p>
              {u.designation ? (
                <p className="truncate text-[11px] text-zinc-500">
                  {u.designation}
                </p>
              ) : null}
            </div>
          </button>
        ))
      )}
    </div>
  );

  return createPortal(panel, document.body);
}

export default memo(MentionPicker);
