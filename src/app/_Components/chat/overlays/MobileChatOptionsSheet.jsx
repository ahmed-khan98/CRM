"use client";

import { memo } from "react";
import ChatOptionsMenu from "@/app/_Components/chat/ChatOptionsMenu";
import { conversationTitle } from "@/app/_Components/chat/chatUtils";

function MobileChatOptionsSheet({
  conv,
  myId,
  meRole,
  onClose,
  updateConv,
  setConfirmDeleteChat,
  setConfirmAction,
  onAddMembers,
  adminDisable,
  adminEnable,
}) {
  if (!conv) return null;
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Close chat options"
        className="fixed inset-0 z-40 bg-black/40 cursor-pointer"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 overflow-hidden rounded-t-2xl border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] text-sm text-zinc-800 shadow-2xl">
        <div className="flex justify-center pt-2 pb-1">
          <span className="h-1 w-10 rounded-full bg-zinc-300" />
        </div>
        <p className="truncate px-4 pb-2 text-xs font-semibold text-zinc-500">
          {conversationTitle(conv, myId)}
        </p>
        <ChatOptionsMenu
          conv={conv}
          myId={myId}
          meRole={meRole}
          onClose={onClose}
          updateConv={updateConv}
          setConfirmDeleteChat={setConfirmDeleteChat}
          setConfirmAction={setConfirmAction}
          onAddMembers={onAddMembers}
          adminDisable={adminDisable}
          adminEnable={adminEnable}
        />
      </div>
    </div>
  );
}

export default memo(MobileChatOptionsSheet);
