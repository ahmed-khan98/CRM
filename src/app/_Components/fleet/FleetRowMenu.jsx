"use client";

import { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";

function FleetRowMenu({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const menuWidth = 148;
    const menuHeight = 120;
    const gap = 4;

    let left = rect.right - menuWidth;
    let top = rect.bottom + gap;

    // Keep inside viewport
    if (left < 8) left = 8;
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }
    // Flip upward if not enough space below
    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - gap;
    }

    setCoords({ top, left });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const onScroll = () => updatePosition();
    const onClickOutside = (e) => {
      if (
        btnRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  const run = (fn) => {
    setOpen(false);
    fn?.();
  };

  return (
    <div className="relative flex justify-end">
      <button
        ref={btnRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 border border-transparent hover:border-zinc-200"
        aria-label="Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-[200] min-w-[148px] rounded-xl border border-zinc-200 bg-white py-1 shadow-xl"
          >
            {onView && (
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={() => run(onView)}
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                onClick={() => run(onEdit)}
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                onClick={() => run(onDelete)}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}

export default memo(FleetRowMenu);
