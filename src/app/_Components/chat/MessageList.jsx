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
      className={`relative min-h-0 flex-1 overflow-y-auto px-2 sm:px-4 py-3 space-y-0.5 ${
        dark ? "custom-scrollbar-dark" : "custom-scrollbar"
      }`}
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
        <div className="sticky top-0 z-10 mb-2 flex justify-center">
          <button
            type="button"
            className="rounded-full border border-zinc-200/70 bg-white/90 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-60"
            disabled={loadingMsgs}
            onClick={() => loadMessages(activeId, messages[0]?._id)}
          >
            {loadingMsgs ? "Loading…" : "↑ Load earlier messages"}
          </button>
        </div>
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
