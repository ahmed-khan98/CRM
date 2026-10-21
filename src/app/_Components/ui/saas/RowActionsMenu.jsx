"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";
import Tooltip from "@/app/_Components/ui/Tooltip";

const MENU_HEIGHT = 220;

const itemToneClass = {
  default: "text-zinc-200 hover:bg-zinc-800",
  primary: "text-sky-300 hover:bg-sky-500/10",
  warning: "text-amber-300 hover:bg-amber-500/10",
  danger: "text-rose-400 hover:bg-rose-500/10",
};

const iconBtnTone = {
  default: "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50",
  dark: "bg-ink border-zinc-700 text-zinc-300 hover:bg-zinc-800",
  info: "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-50",
  danger: "bg-rose-50 border-rose-200 text-rose-600 hover:bg-red-100",
  success: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-50",
};

function PortalMenu({ btnRef, open, onClose, children }) {
  const menuRef = useRef(null);
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < MENU_HEIGHT + 8;
    setStyle({
      position: "fixed",
      right: window.innerWidth - rect.right,
      zIndex: 9999,
      ...(openUpward
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
  }, [open, btnRef]);

  useEffect(() => {
    if (!open) return;
    const handle = (event) => {
      const inBtn = btnRef.current?.contains(event.target);
      const inMenu = menuRef.current?.contains(event.target);
      if (!inBtn && !inMenu) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose, btnRef]);

  useEffect(() => {
    if (!open) return;
    const handle = () => onClose();
    window.addEventListener("scroll", handle, true);
    return () => window.removeEventListener("scroll", handle, true);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={style}
      className="w-44 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl"
    >
      {children}
    </div>,
    document.body
  );
}

export function IconActionButton({
  icon: Icon,
  label,
  onClick,
  href,
  tone = "default",
  disabled = false,
}) {
  const className = `w-7 h-7 flex items-center justify-center rounded-lg border transition-all ${
    iconBtnTone[tone] || iconBtnTone.default
  } ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}`;

  const inner = Icon ? <Icon className="h-3.5 w-3.5" /> : null;

  const stop = (event) => event.stopPropagation();

  const control = href ? (
    <Link
      href={href}
      aria-label={label}
      className={className}
      onClick={stop}
    >
      {inner}
    </Link>
  ) : (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={(event) => {
        stop(event);
        onClick?.(event);
      }}
      className={className}
    >
      {inner}
    </button>
  );

  return label ? (
    <Tooltip label={label} side="top">
      {control}
    </Tooltip>
  ) : (
    control
  );
}

export default function RowActionsMenu({ items = [], align = "right" }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const visible = items.filter((item) => item && !item.hidden);

  if (!visible.length) return null;

  return (
    <div className={`relative ${align === "right" ? "flex justify-end" : ""}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-700 bg-ink p-1.5 text-zinc-300 transition-colors hover:bg-zinc-800"
        aria-label="Row actions"
      >
        <EllipsisVertical className="h-3.5 w-3.5" />
      </button>

      <PortalMenu btnRef={btnRef} open={open} onClose={() => setOpen(false)}>
        {visible.map((item, index) => {
          const Icon = item.icon;
          const tone = item.tone || "default";
          const className = `flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-xs ${
            itemToneClass[tone] || itemToneClass.default
          }`;
          const content = (
            <>
              {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
              {item.label}
            </>
          );

          return (
            <div key={item.key || item.label || index}>
              {item.dividerBefore ? (
                <div className="my-1 border-t border-zinc-700" />
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className={className}
                  onClick={() => setOpen(false)}
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  className={className}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpen(false);
                    item.onClick?.(event);
                  }}
                >
                  {content}
                </button>
              )}
            </div>
          );
        })}
      </PortalMenu>
    </div>
  );
}
