"use client";

import { memo } from "react";
import { MoreVertical } from "lucide-react";
import ChatOptionsMenu from "@/app/_Components/chat/ChatOptionsMenu";

function HeaderOptionsMenu({
  headerMenuRef,
  headerMenuOpen,
  setHeaderMenuOpen,
  closeHeaderMenu,
  active,
  myId,
  meRole,
  updateConv,
  setConfirmDeleteChat,
  setConfirmAction,
  onAddMembers,
  adminDisable,
  adminEnable,
  dark = false,
  theme,
}) {
  const menu = theme?.menu || (dark
    ? "bg-[#111113] text-zinc-100 border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
    : "bg-white text-zinc-900 border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.12)]");

  return (
    <div className="relative" ref={headerMenuRef}>
      <button
        type="button"
        aria-label="Chat options"
        aria-expanded={headerMenuOpen}
        className={`rounded-xl p-1.5 cursor-pointer sm:p-2 transition ${theme?.iconBtn || "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"}`}
        onClick={() => setHeaderMenuOpen((v) => !v)}
      >
        <MoreVertical className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
      </button>
      {headerMenuOpen && (
        <div className={`absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-2xl border py-1.5 text-sm ${menu}`}>
          <ChatOptionsMenu
            conv={active}
            myId={myId}
            meRole={meRole}
            onClose={closeHeaderMenu}
            updateConv={updateConv}
            setConfirmDeleteChat={setConfirmDeleteChat}
            setConfirmAction={setConfirmAction}
            onAddMembers={onAddMembers}
            adminDisable={adminDisable}
            adminEnable={adminEnable}
            dark={dark}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
}

export default memo(HeaderOptionsMenu);
