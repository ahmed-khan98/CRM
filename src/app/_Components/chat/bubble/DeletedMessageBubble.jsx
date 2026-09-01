"use client";

import { memo } from "react";
import MessageMeta from "@/app/_Components/chat/bubble/MessageMeta";
import { sameId } from "@/app/_Components/chat/chatUtils";

function deletedPlaceholder(message, myId) {
  if (message.deletedForMe || sameId(message.deletedBy, myId)) {
    return "You deleted this message";
  }
  return "This message was deleted";
}

function DeletedMessageBubble({
  message,
  mine,
  myId,
  theme,
  showSenderName,
  senderName,
  status,
}) {
  return (
    <div className={`group flex mb-1 ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[85%] sm:max-w-[65%] px-2 pt-1.5 pb-1 shadow-sm ${
          mine
            ? `${theme.bubbleMe} rounded-2xl rounded-br-md`
            : `${theme.bubbleThem} rounded-2xl rounded-bl-md`
        }`}
      >
        {showSenderName && (
          <p className="text-[11px] font-semibold text-sky-600 mb-0.5 px-0.5">
            {senderName}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words text-[12px] leading-4 px-0.5 italic opacity-70">
          {deletedPlaceholder(message, myId)}
        </p>
        <MessageMeta
          message={message}
          myId={myId}
          mine={mine}
          status={status}
        />
      </div>
    </div>
  );
}

export default memo(DeletedMessageBubble);
