"use client";

import { memo } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import {
  conversationTitle,
  conversationAvatar,
} from "@/app/_Components/chat/chatUtils";

function ForwardModal({
  message,
  conversations = [],
  activeId,
  myId,
  onClose,
  onForward,
}) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#050505] p-4 text-zinc-100 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-white">Forward to…</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-72 space-y-1 overflow-y-auto">
          {conversations
            .filter((c) => c._id !== activeId)
            .map((c) => (
              <button
                key={c._id}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.06]"
                onClick={async () => {
                  await onForward({
                    messageId: message._id,
                    targetConversationIds: [c._id],
                  });
                  toast.success("Forwarded");
                  onClose();
                }}
              >
                <Avatar
                  src={conversationAvatar(c, myId)}
                  name={conversationTitle(c, myId)}
                  size="sm"
                />
                <span className="text-sm font-medium text-zinc-100">
                  {conversationTitle(c, myId)}
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default memo(ForwardModal);
