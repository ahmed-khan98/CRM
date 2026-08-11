"use client";

import { memo } from "react";
import { X, FileText, UserPlus, LogOut, UserMinus, Trash2 } from "lucide-react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import {
  conversationAvatar,
  conversationTitle,
  formatChatTime,
} from "@/app/_Components/chat/chatUtils";
import { getAttachmentProxyUrl } from "@/app/_utils/attachmentUrl";

const MEDIA_TABS = [
  { id: "media", label: "Media" },
  { id: "docs", label: "Docs" },
  { id: "links", label: "Links" },
];

function ChatInfoPanel({
  theme,
  active,
  activeId,
  myId,
  peer,
  iAmGroupAdmin,
  mediaTab,
  setMediaTab,
  mediaData,
  callsData,
  setShowInfo,
  setShowAddMembers,
  setConfirmAction,
  setConfirmDeleteChat,
}) {
  return (
    <aside
      className={`flex flex-col border-l ${theme.side} fixed inset-0 z-[60] w-full overflow-y-auto lg:static lg:inset-auto lg:z-auto lg:w-[320px] lg:shrink-0 lg:overflow-hidden`}
    >
      <div className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${theme.header}`}>
        <p className="font-semibold">
          {active.type === "group" ? "Group info" : "Contact info"}
        </p>
        <button type="button" aria-label="Close info" onClick={() => setShowInfo(false)}>
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-col items-center gap-2 px-4 py-6">
        <Avatar
          src={conversationAvatar(active, myId)}
          name={conversationTitle(active, myId)}
          size="lg"
        />
        <p className="max-w-full truncate px-2 text-center text-lg font-bold">
          {conversationTitle(active, myId)}
        </p>
        {peer && (
          <div className="text-center text-xs text-zinc-500 space-y-0.5">
            {peer.designation ? <p>{peer.designation}</p> : null}
          </div>
        )}
        {active.type === "group" && (
          <p className="text-center text-sm text-zinc-500">{active.description}</p>
        )}
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase text-zinc-500">Shared media</p>
          <div className="mb-2 flex gap-1.5 text-[11px]">
            {MEDIA_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMediaTab(t.id)}
                className={`rounded-full px-2.5 py-1 font-medium ${
                  mediaTab === t.id
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {mediaTab === "media" && (
            <div className="grid grid-cols-3 gap-1">
              {(mediaData?.data || []).length === 0 && (
                <p className="col-span-3 py-4 text-center text-xs text-zinc-400">
                  No photos or videos yet
                </p>
              )}
              {(mediaData?.data || []).map((m) => {
                const att = m.attachments?.[0];
                if (!att?.url) return null;
                if (m.type === "video") {
                  return (
                    <a
                      key={m._id}
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="relative aspect-square overflow-hidden rounded bg-zinc-900"
                    >
                      <video
                        src={att.url}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[9px] text-white">
                        Video
                      </span>
                    </a>
                  );
                }
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <a
                    key={m._id}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="aspect-square overflow-hidden rounded"
                  >
                    <img src={att.url} alt="" className="h-full w-full object-cover" />
                  </a>
                );
              })}
            </div>
          )}

          {mediaTab === "docs" && (
            <div className="space-y-1.5">
              {(mediaData?.data || []).length === 0 && (
                <p className="py-4 text-center text-xs text-zinc-400">No documents yet</p>
              )}
              {(mediaData?.data || []).map((m) => {
                const att = m.attachments?.[0];
                if (!att) return null;
                const name = att.fileName || "Document";
                const sizeKb = att.size
                  ? `${Math.max(1, Math.round(att.size / 1024))} KB`
                  : "";
                return (
                  <a
                    key={m._id}
                    href={getAttachmentProxyUrl(att.url, {
                      disposition: "inline",
                      filename: name,
                      publicId: att.publicId,
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 hover:bg-zinc-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-zinc-800">{name}</p>
                      <p className="text-[10px] text-zinc-400">
                        {[sizeKb, formatChatTime(m.createdAt)].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {mediaTab === "links" && (
            <div className="space-y-1.5">
              {(mediaData?.data || []).length === 0 && (
                <p className="py-4 text-center text-xs text-zinc-400">No links yet</p>
              )}
              {(mediaData?.data || []).map((m) => {
                const match = (m.body || "").match(/https?:\/\/[^\s]+/i);
                const url = match?.[0];
                if (!url) return null;
                return (
                  <a
                    key={m._id}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg border border-zinc-200 bg-white px-2.5 py-2 hover:bg-zinc-50"
                  >
                    <p className="truncate text-xs font-medium text-sky-700">{url}</p>
                    <p className="mt-0.5 text-[10px] text-zinc-400">
                      {m.senderId?.fullName || "Someone"} ·{" "}
                      {formatChatTime(m.createdAt)}
                    </p>
                  </a>
                );
              })}
            </div>
          )}
        </div>
        {active.type === "group" && (
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
                        <p className="truncate text-[10px] text-zinc-400">
                          {p.userId.designation}
                        </p>
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
                        {isMe ? (
                          <LogOut className="h-4 w-4" />
                        ) : (
                          <UserMinus className="h-4 w-4" />
                        )}
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
        )}
        {active.type === "direct" && peer && (
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            onClick={() => setConfirmDeleteChat(activeId)}
          >
            <Trash2 className="h-4 w-4" /> Delete chat
          </button>
        )}
        <p className="text-xs font-bold uppercase text-zinc-500 pt-2">Recent calls</p>
        {(callsData?.data || []).slice(0, 5).map((c) => (
          <div key={c._id} className="flex justify-between text-xs text-zinc-600">
            <span className="capitalize">
              {c.callType} · {c.status}
            </span>
            <span>{formatChatTime(c.createdAt)}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default memo(ChatInfoPanel);
