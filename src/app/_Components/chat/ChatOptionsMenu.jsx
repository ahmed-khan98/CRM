"use client";

import { memo } from "react";
import toast from "react-hot-toast";
import {
  Pin,
  Archive,
  Trash2,
  Ban,
  Check,
  LogOut,
  UserPlus,
} from "lucide-react";
import { conversationPeer, isConversationGroupAdmin } from "@/app/_Components/chat/chatUtils";

function ChatOptionsMenu({
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

  const peer = conversationPeer(conv, myId);
  const iAmGroupAdmin = isConversationGroupAdmin(conv, myId);
  const item = "flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-zinc-50";

  return (
    <>
      <button
        type="button"
        className={item}
        onClick={() => {
          updateConv({ id: conv._id, pinned: !conv.myMeta?.pinned });
          onClose();
        }}
      >
        <Pin className="h-4 w-4" />
        {conv.myMeta?.pinned ? "Unpin chat" : "Pin chat"}
      </button>
      <button
        type="button"
        className={item}
        onClick={() => {
          updateConv({ id: conv._id, archived: !conv.myMeta?.archived });
          onClose();
        }}
      >
        <Archive className="h-4 w-4" />
        {conv.myMeta?.archived ? "Unarchive" : "Archive"}
      </button>
      <button
        type="button"
        className={`${item} text-red-600`}
        onClick={() => {
          onClose();
          setConfirmDeleteChat(conv._id);
        }}
      >
        <Trash2 className="h-4 w-4" /> Delete chat
      </button>
      {peer && (meRole === "ADMIN" || meRole === "SUBADMIN") && (
        <>
          <button
            type="button"
            className={`${item} text-red-600`}
            onClick={async () => {
              onClose();
              try {
                await adminDisable({
                  userId: peer._id,
                  reason: "Disabled from chat UI",
                }).unwrap();
                toast.success("Chat disabled for user");
              } catch (e) {
                toast.error(e?.data?.message || "Could not disable chat");
              }
            }}
          >
            <Ban className="h-4 w-4" /> Disable chat (Admin)
          </button>
          <button
            type="button"
            className={`${item} text-emerald-700`}
            onClick={async () => {
              onClose();
              try {
                await adminEnable(peer._id).unwrap();
                toast.success("Chat enabled for user");
              } catch (e) {
                toast.error(e?.data?.message || "Could not enable chat");
              }
            }}
          >
            <Check className="h-4 w-4" /> Enable chat (Admin)
          </button>
        </>
      )}
      {conv.type === "group" && iAmGroupAdmin && (
        <button
          type="button"
          className={item}
          onClick={() => {
            onClose();
            onAddMembers?.(conv);
          }}
        >
          <UserPlus className="h-4 w-4" /> Add members
        </button>
      )}
      {conv.type === "group" && (
        <button
          type="button"
          className={`${item} text-red-600`}
          onClick={() => {
            onClose();
            setConfirmAction({
              type: "leaveGroup",
              conversationId: conv._id,
            });
          }}
        >
          <LogOut className="h-4 w-4" /> Leave group
        </button>
      )}
      {conv.type === "group" && iAmGroupAdmin && (
        <button
          type="button"
          className={`${item} text-red-600`}
          onClick={() => {
            onClose();
            setConfirmAction({
              type: "deleteGroup",
              conversationId: conv._id,
            });
          }}
        >
          <Trash2 className="h-4 w-4" /> Delete group
        </button>
      )}
    </>
  );
}

export default memo(ChatOptionsMenu);
