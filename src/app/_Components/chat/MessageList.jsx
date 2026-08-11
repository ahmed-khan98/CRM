"use client";

import { memo } from "react";
import MessageBubble from "@/app/_Components/chat/MessageBubble";
import { chatWallpaper } from "@/app/_Components/chat/chatUtils";

function MessageList({
  listRef,
  bottomRef,
  dark,
  theme,
  messages,
  hasMore,
  loadingMsgs,
  dragOver,
  activeId,
  myId,
  active,
  activeVoiceId,
  loadMessages,
  onContextMenu,
  onReact,
  onRequestPlay,
  onStopChain,
  onEnded,
}) {
  return (
    <div
      ref={listRef}
      className="relative min-h-0 flex-1 overflow-y-auto px-2 sm:px-4 py-3 space-y-0.5"
      style={chatWallpaper(dark)}
      onScroll={(e) => {
        if (e.currentTarget.scrollTop < 40 && hasMore && !loadingMsgs) {
          const first = messages[0];
          if (first?._id) loadMessages(activeId, first._id);
        }
      }}
    >
      {dragOver && (
        <div className="pointer-events-none absolute inset-4 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-zinc-500 bg-zinc-900/20 text-zinc-800 font-semibold backdrop-blur-[1px]">
          Drop files to upload
        </div>
      )}
      {hasMore && (
        <button
          type="button"
          className="mx-auto mb-2 block text-xs text-zinc-600 font-medium"
          onClick={() => loadMessages(activeId, messages[0]?._id)}
        >
          Load earlier messages
        </button>
      )}
      {messages.map((m, idx) => (
        <MessageBubble
          key={m._id || m.clientId}
          message={m}
          prevMessage={messages[idx - 1]}
          myId={myId}
          theme={theme}
          active={active}
          activeVoiceId={activeVoiceId}
          onContextMenu={onContextMenu}
          onReact={onReact}
          onRequestPlay={onRequestPlay}
          onStopChain={onStopChain}
          onEnded={onEnded}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default memo(MessageList);
