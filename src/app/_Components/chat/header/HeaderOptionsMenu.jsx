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
}) {
  return (
    <div className="relative" ref={headerMenuRef}>
      <button
        type="button"
        aria-label="Chat options"
        aria-expanded={headerMenuOpen}
        className="rounded-full p-1.5 hover:bg-black/5 cursor-pointer sm:p-2"
        onClick={() => setHeaderMenuOpen((v) => !v)}
      >
        <MoreVertical className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
      </button>
      {headerMenuOpen && (
        <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 text-sm shadow-lg text-zinc-800">
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
          />
        </div>
      )}
    </div>
  );
}

export default memo(HeaderOptionsMenu);
