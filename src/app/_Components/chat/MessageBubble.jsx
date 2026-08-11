"use client";

import { memo } from "react";
import toast from "react-hot-toast";
import { Forward, Download, Star } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import Ticks from "@/app/_Components/chat/ChatTicks";
import { renderMentionBody } from "@/app/_Components/chat/MentionText";
import CallMessageBubble from "@/app/_Components/chat/CallMessageBubble";
import ChatImage from "@/app/_Components/chat/ChatImage";
import ChatFileCard from "@/app/_Components/chat/ChatFileCard";
import VoicePlayer from "@/app/_Components/chat/VoicePlayer";
import {
  getCurrentUser,
  formatDaySeparator,
  formatMessageClock,
  sameDay,
  receiptStatus,
  QUICK_EMOJIS,
  isVoiceMessage,
  messageKey,
} from "@/app/_Components/chat/chatUtils";
import {
  isChatDocument,
  fetchAttachmentBlob,
} from "@/app/_utils/attachmentUrl";

function MessageBubble({
  message: m,
  prevMessage,
  myId,
  theme,
  active,
  activeVoiceId,
  onContextMenu,
  onReact,
  onRequestPlay,
  onStopChain,
  onEnded,
}) {
  const showDay = !prevMessage || !sameDay(prevMessage.createdAt, m.createdAt);
  const mine = (m.senderId?._id || m.senderId)?.toString() === myId?.toString();
  const status = receiptStatus(m, myId);
  const isVoice =
    m.type === "voice" ||
    m.type === "audio" ||
    (m.type !== "call" &&
      m.type !== "text" &&
      m.type !== "image" &&
      m.type !== "video" &&
      m.attachments?.[0]?.mimeType?.startsWith("audio/"));
  // Only real call messages — empty callMeta {} exists on every Mongo doc
  const isCall = m.type === "call";
  const isImage =
    !isCall &&
    !isVoice &&
    (m.type === "image" || m.attachments?.[0]?.mimeType?.startsWith("image/"));
  const isVideo =
    !isCall &&
    !isVoice &&
    (m.type === "video" || m.attachments?.[0]?.mimeType?.startsWith("video/"));
  const isText = m.type === "text" || (!m.type && m.body);

  return (
    <div>
      {showDay && (
        <div className="my-3 flex justify-center sticky top-1 z-[1]">
          <span className={`rounded-lg px-3 py-1 text-[11px] font-medium ${theme.dayChip}`}>
            {formatDaySeparator(m.createdAt)}
          </span>
        </div>
      )}
      {m.type === "system" || m.deletedForEveryone ? (
        <div className="my-2 flex justify-center">
          <span className={`rounded-lg px-3 py-1 text-[11px] ${theme.dayChip}`}>
            {m.deletedForEveryone ? m.body || "This message was deleted" : m.body}
          </span>
        </div>
      ) : (
        <div
          className={`group flex mb-1 ${mine ? "justify-end" : "justify-start"}`}
          onContextMenu={(e) => {
            e.preventDefault();
            onContextMenu(m);
          }}
        >
          <div
            className={`relative max-w-[85%] sm:max-w-[65%] px-2 pt-1.5 pb-1 shadow-sm ${
              mine
                ? `${theme.bubbleMe} rounded-2xl rounded-br-md`
                : `${theme.bubbleThem} rounded-2xl rounded-bl-md`
            } ${isVoice ? "min-w-[240px]" : ""} ${isCall ? "min-w-[200px]" : ""}`}
          >
            {!mine && active.type === "group" && (
              <p className="text-[11px] font-semibold text-sky-600 mb-0.5 px-0.5">
                {m.senderId?.fullName}
              </p>
            )}
            {m.replyTo && (
              <div
                className={`mb-1 rounded-md border-l-4 px-2 py-1 text-xs ${
                  mine
                    ? "border-zinc-400 bg-black/20"
                    : "border-zinc-500 bg-black/[0.04]"
                }`}
              >
                <p className="font-semibold opacity-80 truncate">
                  {(m.replyTo.senderId?.fullName || "Reply").split(" ")[0]}
                </p>
                <p className="opacity-70 truncate">
                  {(m.replyTo.body || m.replyTo.type || "").slice(0, 80)}
                </p>
              </div>
            )}
            {m.forwardedFrom && (
              <p className="mb-1 flex items-center gap-1 text-[10px] italic opacity-70 px-0.5">
                <Forward className="h-3 w-3" /> Forwarded
              </p>
            )}
            {isImage && m.attachments?.[0]?.url && (
              <ChatImage attachment={m.attachments[0]} />
            )}
            {isVideo && m.attachments?.[0]?.url && (
              <div className="relative mb-1 -mx-0.5">
                <video
                  src={m.attachments[0].url}
                  controls
                  className="max-h-64 rounded-lg"
                />
                <ChatTooltip label="Download video" side="top">
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black/90"
                    onClick={async () => {
                      try {
                        const att = m.attachments[0];
                        const blob = await fetchAttachmentBlob(att.url, {
                          disposition: "attachment",
                          filename: att.fileName || "video.mp4",
                          publicId: att.publicId,
                        });
                        const href = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = href;
                        a.download = att.fileName || "video.mp4";
                        a.click();
                        URL.revokeObjectURL(href);
                      } catch {
                        toast.error("Video download failed");
                      }
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </ChatTooltip>
              </div>
            )}
            {isVoice && m.attachments?.[0]?.url && (
              <VoicePlayer
                messageId={messageKey(m)}
                url={m.attachments[0].url}
                duration={m.attachments[0].duration}
                mine={mine}
                avatarSrc={mine ? getCurrentUser()?.image : m.senderId?.image}
                avatarName={mine ? getCurrentUser()?.fullName : m.senderId?.fullName}
                timeLabel={formatMessageClock(m.createdAt)}
                receiptStatus={mine ? status : null}
                activeVoiceId={activeVoiceId}
                onRequestPlay={onRequestPlay}
                onStopChain={onStopChain}
                onEnded={onEnded}
              />
            )}
            {!isCall &&
              !isVoice &&
              m.attachments?.[0]?.url &&
              isChatDocument(
                m.attachments[0].url,
                m.attachments[0].fileName,
                m.attachments[0].mimeType
              ) &&
              m.type !== "image" &&
              m.type !== "video" && (
                <ChatFileCard attachment={m.attachments[0]} mine={mine} />
              )}
            {m.type === "file" &&
              m.attachments?.[0] &&
              !isChatDocument(
                m.attachments[0].url,
                m.attachments[0].fileName,
                m.attachments[0].mimeType
              ) && <ChatFileCard attachment={m.attachments[0]} mine={mine} />}
            {isCall && (
              <CallMessageBubble
                message={m}
                mine={mine}
                timeLabel={formatMessageClock(m.createdAt)}
                receiptStatus={mine ? status : null}
              />
            )}
            {isText && m.body && (
              <p className="whitespace-pre-wrap break-words text-[14.2px] leading-[19px] px-0.5">
                {active?.type === "group"
                  ? renderMentionBody(m.body, active.participants, mine)
                  : m.body}
              </p>
            )}
            {!!m.reactions?.length && (
              <div className="mt-0.5 flex flex-wrap gap-1">
                {m.reactions.map((r, i) => (
                  <span
                    key={`${r.emoji}-${i}`}
                    className={`rounded-full px-1.5 text-xs shadow-sm ${
                      mine ? "bg-black/25" : "bg-zinc-100"
                    }`}
                  >
                    {r.emoji}
                  </span>
                ))}
              </div>
            )}
            {!isCall && !isVoice && (
              <div
                className={`mt-0.5 flex items-center justify-end gap-1 text-[11px] leading-none select-none ${
                  mine ? "text-zinc-300" : "text-zinc-500"
                }`}
              >
                {m.editedAt && <span className="italic">edited</span>}
                {m.starredBy?.some(
                  (id) => id === myId || id?.toString() === myId
                ) && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                <span>{formatMessageClock(m.createdAt)}</span>
                {mine && <Ticks status={status} soft />}
              </div>
            )}
            <div className="absolute -top-3 right-2 hidden gap-0.5 rounded-full border border-zinc-200 bg-white px-1 py-0.5 shadow group-hover:flex">
              {QUICK_EMOJIS.slice(0, 5).map((em) => (
                <button
                  key={em}
                  type="button"
                  className="text-sm hover:scale-110"
                  onClick={() => onReact(m._id, em)}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  if (prevProps.message !== nextProps.message) return false;
  if (prevProps.theme !== nextProps.theme) return false;
  if (prevProps.myId !== nextProps.myId) return false;
  if (prevProps.active !== nextProps.active) return false;
  if (prevProps.onContextMenu !== nextProps.onContextMenu) return false;
  if (prevProps.onReact !== nextProps.onReact) return false;
  if (prevProps.onRequestPlay !== nextProps.onRequestPlay) return false;
  if (prevProps.onStopChain !== nextProps.onStopChain) return false;
  if (prevProps.onEnded !== nextProps.onEnded) return false;

  const prevShowDay =
    !prevProps.prevMessage ||
    !sameDay(prevProps.prevMessage.createdAt, prevProps.message.createdAt);
  const nextShowDay =
    !nextProps.prevMessage ||
    !sameDay(nextProps.prevMessage.createdAt, nextProps.message.createdAt);
  if (prevShowDay !== nextShowDay) return false;

  if (isVoiceMessage(nextProps.message) && prevProps.activeVoiceId !== nextProps.activeVoiceId) {
    return false;
  }

  return true;
}

export default memo(MessageBubble, areEqual);
