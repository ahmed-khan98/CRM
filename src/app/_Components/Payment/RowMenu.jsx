import {
  Copy,
  EllipsisVertical,
  Trash2,
  Eye,
  Check,
  Power,
  ExternalLink,
} from "lucide-react";
import { memo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

/* ─── Portal dropdown — never clipped by overflow containers ─── */
const MENU_HEIGHT = 180;

function PortalMenu({ btnRef, open, onClose, children }) {
  const menuRef = useRef(null);
  const [style, setStyle] = useState({});

  // calculate position every time menu opens
  useEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const openUpward = spaceBelow < MENU_HEIGHT + 8;
    setStyle({
      position: "fixed",
      right: window.innerWidth - r.right,
      zIndex: 9999,
      ...(openUpward
        ? { bottom: window.innerHeight - r.top + 4 }
        : { top: r.bottom + 4 }),
    });
  }, [open, btnRef]);

  // close on outside click (but NOT when clicking inside menu)
  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      const inBtn  = btnRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inBtn && !inMenu) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, onClose, btnRef]);

  // close on any scroll so dropdown doesn't detach from its button
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
      className="w-40 rounded-xl bg-white border border-zinc-200 shadow-xl overflow-hidden"
    >
      {children}
    </div>,
    document.body
  );
}

/* ─── RowMenu ─── */
function RowMenu({ emp, paymentUrl, onCopy, isCopied, onDelete, isEnabled, onToggle }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer items-center justify-center rounded-lg p-1.5 border border-zinc-200 hover:bg-zinc-100 transition-colors"
      >
        <EllipsisVertical className="h-3.5 w-3.5 text-zinc-500" />
      </button>

      <PortalMenu btnRef={btnRef} open={open} onClose={() => setOpen(false)}>
        {emp?.paymentStatus !== "paid" && (
          <>
            {/* View */}
            <button
              onClick={() => {
                if (paymentUrl) window.open(paymentUrl, "_blank");
                setOpen(false);
              }}
              className="cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-[12px] text-zinc-700 hover:bg-zinc-50"
            >
              <Eye className="h-3.5 w-3.5 text-zinc-400" />
              View
              <ExternalLink className="h-3 w-3 ml-auto text-zinc-300" />
            </button>

            {/* Copy Link — shows "Copied!" for 1.5s then closes */}
            <button
              onClick={() => {
                onCopy(emp?._id);
                setTimeout(() => setOpen(false), 1500);
              }}
              className={`cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-[12px] hover:bg-zinc-50 ${isCopied ? "text-emerald-600" : "text-blue-600"}`}
            >
              {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {isCopied ? "Copied!" : "Copy Link"}
            </button>

            <div className="border-t border-zinc-100 my-1" />

            {/* Enable / Disable */}
            <button
              onClick={() => { onToggle(); setOpen(false); }}
              className={`cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-[12px] ${isEnabled ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`}
            >
              <Power className="h-3.5 w-3.5" />
              {isEnabled ? "Disable Link" : "Enable Link"}
            </button>

            <div className="border-t border-zinc-100 my-1" />

            {/* Delete */}
            <button
              onClick={() => { onDelete(emp?._id); setOpen(false); }}
              className="cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-[12px] text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </>
        )}
      </PortalMenu>
    </div>
  );
}

export default memo(RowMenu);