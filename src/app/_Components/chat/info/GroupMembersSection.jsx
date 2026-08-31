"use client";

import { memo } from "react";
import { UserPlus, LogOut, UserMinus, Trash2 } from "lucide-react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";

function GroupMembersSection({
  active,
  activeId,
  myId,
  iAmGroupAdmin,
  setShowAddMembers,
  setConfirmAction,
}) {
  return (
    <>
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs font-bold uppercase text-zinc-500">
          Members ({active.participants?.length})
        </p>
        {iAmGroupAdmin && (
          <button
            type="button"
            onClick={() => setShowAddMembers(true)}
            className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-zinc-800"
          >
            <UserPlus className="h-3.5 w-3.5" /> Add
          </button>
        )}
      </div>
      {(active.participants || []).map((p) => {
        const uid = (p.userId?._id || p.userId)?.toString();
        const isMe = uid === myId?.toString();
        const canRemove = (iAmGroupAdmin && !isMe) || isMe;
        return (
          <div key={uid} className="flex items-center justify-between gap-2 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar src={p.userId?.image} name={p.userId?.fullName} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {p.userId?.fullName}
                  {isMe ? " (You)" : ""}
                </p>
                {p.userId?.designation ? (
                  <p className="truncate text-[10px] text-zinc-400">{p.userId.designation}</p>
                ) : null}
              </div>
            </div>
            {canRemove && (
              <ChatTooltip label={isMe ? "Leave group" : "Remove member"} side="left">
                <button
                  type="button"
                  className="shrink-0 rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (isMe) {
                      setConfirmAction({
                        type: "leaveGroup",
                        conversationId: activeId,
                      });
                    } else {
                      setConfirmAction({
                        type: "removeMember",
                        conversationId: activeId,
                        userId: uid,
                        name: p.userId?.fullName,
                      });
                    }
                  }}
                >
                  {isMe ? <LogOut className="h-4 w-4" /> : <UserMinus className="h-4 w-4" />}
                </button>
              </ChatTooltip>
            )}
          </div>
        );
      })}
      {iAmGroupAdmin && (
        <button
          type="button"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
          onClick={() =>
            setConfirmAction({
              type: "deleteGroup",
              conversationId: activeId,
            })
          }
        >
          <Trash2 className="h-4 w-4" /> Delete group
        </button>
      )}
    </>
  );
}

export default memo(GroupMembersSection);
