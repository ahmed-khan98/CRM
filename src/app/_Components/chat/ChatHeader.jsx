"use client";

import { memo } from "react";
import toast from "react-hot-toast";
import {
  MoreVertical,
  PhoneCall,
  Video,
  Info,
  Check,
  Pin,
  Archive,
  Trash2,
  ArrowLeft,
  Ban,
  LogOut,
  UserPlus,
} from "lucide-react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import { conversationAvatar, conversationTitle, formatChatTime } from "@/app/_Components/chat/chatUtils";

function ChatHeader({
  theme,
  active,
  activeId,
  myId,
  peer,
  peerOnline,
  peerPresence,
  typingLabel,
  recordingLabel,
  headerMenuOpen,
  setHeaderMenuOpen,
  headerMenuRef,
  closeHeaderMenu,
  setMobileShowChat,
  setShowInfo,
  startOutgoing,
  updateConv,
  meRole,
  iAmGroupAdmin,
  setShowAddMembers,
  setConfirmAction,
  setConfirmDeleteChat,
  adminDisable,
  adminEnable,
}) {
  return (
    <header
      className={`flex shrink-0 items-center gap-1.5 border-b px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5 ${theme.header}`}
    >
      <button
        type="button"
        className="md:hidden shrink-0 rounded-full p-1.5 hover:bg-black/5"
        onClick={() => setMobileShowChat(false)}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-left sm:gap-3"
        onClick={() => setShowInfo(true)}
      >
        <Avatar
          src={conversationAvatar(active, myId)}
          name={conversationTitle(active, myId)}
          online={peerOnline}
          size="sm"
        />
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="truncate text-sm font-semibold leading-tight sm:text-[15px]">
            {conversationTitle(active, myId)}
          </p>
          <p className="truncate text-[11px] leading-tight text-zinc-500 sm:text-xs">
            {recordingLabel.length
              ? `${recordingLabel.join(", ")} recording…`
              : typingLabel.length
                ? `${typingLabel.join(", ")} typing…`
                : peer
                  ? peerOnline
                    ? "\u00A0"
                    : peerPresence?.lastSeen
                      ? `last seen ${formatChatTime(peerPresence.lastSeen)}`
                      : ""
                  : `${active.participants?.length || 0} members`}
          </p>
        </div>
      </button>
      <div className="flex shrink-0 items-center">
        {(peer || active.type === "group") && (
          <>
            <ChatTooltip
              label={active.type === "group" ? "Group voice call" : "Voice call"}
              side="bottom"
            >
              <button
                type="button"
                aria-label="Voice call"
                className="rounded-full p-1.5 hover:bg-black/5 sm:p-2"
                onClick={() =>
                  startOutgoing({
                    conversationId: activeId,
                    peerUserId: active.type === "group" ? undefined : peer?._id,
                    peer: active.type === "group" ? undefined : peer || null,
                    callType: "voice",
                    groupCall: active.type === "group",
                    groupName:
                      active.type === "group" ? conversationTitle(active, myId) : undefined,
                    groupImage:
                      active.type === "group" ? conversationAvatar(active, myId) : undefined,
                  })
                }
              >
                <PhoneCall className="h-[18px] w-[18px] text-zinc-600 sm:h-5 sm:w-5" />
              </button>
            </ChatTooltip>
            <ChatTooltip
              label={active.type === "group" ? "Group video call" : "Video call"}
              side="bottom"
            >
              <button
                type="button"
                aria-label="Video call"
                className="rounded-full p-1.5 hover:bg-black/5 sm:p-2"
                onClick={() =>
                  startOutgoing({
                    conversationId: activeId,
                    peerUserId: active.type === "group" ? undefined : peer?._id,
                    peer: active.type === "group" ? undefined : peer || null,
                    callType: "video",
                    groupCall: active.type === "group",
                    groupName:
                      active.type === "group" ? conversationTitle(active, myId) : undefined,
                    groupImage:
                      active.type === "group" ? conversationAvatar(active, myId) : undefined,
                  })
                }
              >
                <Video className="h-[18px] w-[18px] text-zinc-600 sm:h-5 sm:w-5" />
              </button>
            </ChatTooltip>
          </>
        )}
        <ChatTooltip label="Contact info" side="bottom">
          <button
            type="button"
            aria-label="Contact info"
            className="rounded-full p-1.5 hover:bg-black/5 sm:p-2"
            onClick={() => setShowInfo((v) => !v)}
          >
            <Info className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
          </button>
        </ChatTooltip>
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
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-zinc-50"
                onClick={() => {
                  updateConv({
                    id: activeId,
                    pinned: !active.myMeta?.pinned,
                  });
                  closeHeaderMenu();
                }}
              >
                <Pin className="h-4 w-4" />
                {active.myMeta?.pinned ? "Unpin chat" : "Pin chat"}
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-zinc-50"
                onClick={() => {
                  updateConv({
                    id: activeId,
                    archived: !active.myMeta?.archived,
                  });
                  closeHeaderMenu();
                }}
              >
                <Archive className="h-4 w-4" />
                {active.myMeta?.archived ? "Unarchive" : "Archive"}
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-zinc-50"
                onClick={() => {
                  closeHeaderMenu();
                  setConfirmDeleteChat(activeId);
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete chat
              </button>
              {peer && (meRole === "ADMIN" || meRole === "SUBADMIN") && (
                <>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-zinc-50"
                    onClick={async () => {
                      closeHeaderMenu();
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
                    className="flex w-full items-center gap-2 px-3 py-2 text-emerald-700 hover:bg-zinc-50"
                    onClick={async () => {
                      closeHeaderMenu();
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
              {active.type === "group" && iAmGroupAdmin && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-zinc-50"
                  onClick={() => {
                    closeHeaderMenu();
                    setShowAddMembers(true);
                  }}
                >
                  <UserPlus className="h-4 w-4" /> Add members
                </button>
              )}
              {active.type === "group" && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-zinc-50"
                  onClick={() => {
                    closeHeaderMenu();
                    setConfirmAction({
                      type: "leaveGroup",
                      conversationId: activeId,
                    });
                  }}
                >
                  <LogOut className="h-4 w-4" /> Leave group
                </button>
              )}
              {active.type === "group" && iAmGroupAdmin && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-red-600 hover:bg-zinc-50"
                  onClick={() => {
                    closeHeaderMenu();
                    setConfirmAction({
                      type: "deleteGroup",
                      conversationId: activeId,
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" /> Delete group
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default memo(ChatHeader);
