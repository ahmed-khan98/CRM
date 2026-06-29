import { memo, useState, useRef, useEffect } from "react";
import {
  Trash2,
  Edit, 
  EllipsisVertical,
  Link
} from "lucide-react";
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
      className="w-40 rounded-xl bg-white border border-zinc-200 shadow-xl overflow-hidden"
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
        className="inline-flex cursor-pointer items-center justify-center rounded-lg p-1.5 border border-zinc-200 hover:bg-zinc-100 transition-colors"
      >
        <EllipsisVertical className="h-3.5 w-3.5 text-zinc-500" />
      </button>

      <PortalMenu btnRef={btnRef} open={open} onClose={() => setOpen(false)}>
        {/* 1. Create Payment Link */}
        <button
         onClick={() => router.push(`/dashboard/paymentLink/${emp?._id}`)}
          className="cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-[12px] text-blue-600 hover:bg-blue-50"
        >
          <Link className="h-3.5 w-3.5" />
          Create Payment Link
        </button>

        {/* 2. Create Sale */}
        {/* <button
          onClick={() => {
            window.location.href = `/sales/create`;
            setOpen(false);
          }}
          className="cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-[12px] text-emerald-600 hover:bg-emerald-50"
        >
          <Check className="h-3.5 w-3.5" />
          Create Sale
        </button> */}

        <div className="border-t border-zinc-100 my-1" />

        {/* 3. Edit */}
        <button
          onClick={()=>{
            setOpen()
            handleEdit()}}
          className="cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-[12px] text-amber-600 hover:bg-amber-50"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </button>

        <div className="border-t border-zinc-100 my-1" />

        {/* 4. Delete (existing logic) */}
        <button
          onClick={()=>{
            setOpen()
            onDelete()}}
          className="cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-[12px] text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </PortalMenu>
    </div>
  );
}

export default memo(ClientRowMenu);
