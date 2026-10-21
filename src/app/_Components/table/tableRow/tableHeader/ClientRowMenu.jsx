import { memo, useState, useRef, useEffect } from "react";
import { Trash2, Edit, EllipsisVertical, Link, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

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
      const inBtn = btnRef.current?.contains(e.target);
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
      className="w-40 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl"
    >
      {children}
    </div>,
    document.body,
  );
}

/* ─── RowMenu ─── */
function ClientRowMenu({ emp, handleEdit, onDelete, isEnabled, onToggle }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const router = useRouter();

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-700 bg-ink p-1.5 text-zinc-300 transition-colors hover:bg-zinc-800"
      >
        <EllipsisVertical className="h-3.5 w-3.5" />
      </button>

      <PortalMenu btnRef={btnRef} open={open} onClose={() => setOpen(false)}>
        <button
          onClick={() => {
            router.push(`/dashboard/client/${emp?._id}`);
            setOpen(false);
          }}
          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[12px] text-zinc-200 hover:bg-zinc-800"
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </button>

        <div className="my-1 border-t border-zinc-700" />

        {/* 1. Create Payment Link */}
        <button
          onClick={() => {
            router.push(`/dashboard/paymentLink/${emp?._id}`);
            setOpen(false);
          }}
          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[12px] text-sky-300 hover:bg-sky-500/10"
        >
          <Link className="h-3.5 w-3.5" />
          Create Link
        </button>

        <div className="my-1 border-t border-zinc-700" />

        {/* 3. Edit */}
        <button
          onClick={() => {
            setOpen(false);
            handleEdit();
          }}
          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[12px] text-amber-300 hover:bg-amber-500/10"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </button>

        <div className="my-1 border-t border-zinc-700" />

        {/* 4. Delete (existing logic) */}
        <button
          onClick={() => {
            setOpen(false);
            onDelete();
          }}
          className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[12px] text-rose-400 hover:bg-rose-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </PortalMenu>
    </div>
  );
}

export default memo(ClientRowMenu);
