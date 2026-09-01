"use client";

import { memo } from "react";
import { Forward } from "lucide-react";
import { renderMentionBody } from "@/app/_Components/chat/MentionText";
import CallMessageBubble from "@/app/_Components/chat/CallMessageBubble";
import ChatImage from "@/app/_Components/chat/ChatImage";
import ChatFileCard from "@/app/_Components/chat/ChatFileCard";
import VoicePlayer from "@/app/_Components/chat/VoicePlayer";
import DaySeparator from "@/app/_Components/chat/bubble/DaySeparator";
import SystemMessageChip from "@/app/_Components/chat/bubble/SystemMessageChip";
import DeletedMessageBubble from "@/app/_Components/chat/bubble/DeletedMessageBubble";
import ReplyQuote from "@/app/_Components/chat/bubble/ReplyQuote";
import VideoBubble from "@/app/_Components/chat/bubble/VideoBubble";
import MessageReactions from "@/app/_Components/chat/bubble/MessageReactions";
import MessageMeta from "@/app/_Components/chat/bubble/MessageMeta";
import QuickReactBar from "@/app/_Components/chat/bubble/QuickReactBar";
import {
  getCurrentUser,
  formatMessageClock,
  sameDay,
  receiptStatus,
  isVoiceMessage,
  messageKey,
} from "@/app/_Components/chat/chatUtils";
import { isChatDocument } from "@/app/_utils/attachmentUrl";

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
      {showDay && <DaySeparator theme={theme} date={m.createdAt} />}
      {m.deletedForEveryone || m.deletedForMe ? (
        <DeletedMessageBubble
          message={m}
          mine={mine}
          myId={myId}
          theme={theme}
          showSenderName={!mine && active.type === "group"}
          senderName={m.senderId?.fullName}
          status={status}
        />
      ) : m.type === "system" ? (
        <SystemMessageChip theme={theme} message={m} />
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
            <ReplyQuote mine={mine} replyTo={m.replyTo} />
            {m.forwardedFrom && (
              <p className="mb-1 flex items-center gap-1 text-[10px] italic opacity-70 px-0.5">
                <Forward className="h-3 w-3" /> Forwarded
              </p>
            )}
            {isImage && m.attachments?.[0]?.url && (
              <ChatImage attachment={m.attachments[0]} />
            )}
            {isVideo && m.attachments?.[0]?.url && (
              <VideoBubble attachment={m.attachments[0]} />
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
            <MessageReactions reactions={m.reactions} mine={mine} />
            {!isCall && !isVoice && (
              <MessageMeta message={m} myId={myId} mine={mine} status={status} />
            )}
            <QuickReactBar messageId={m._id} onReact={onReact} />
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
