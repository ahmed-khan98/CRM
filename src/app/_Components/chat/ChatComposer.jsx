"use client";

import { memo } from "react";
import {
  Paperclip,
  Smile,
  Send,
  Reply,
  X,
  Image as ImageIcon,
  FileText,
  Mic,
} from "lucide-react";
import Avatar from "@/app/_Components/chat/ChatAvatar";
import VoiceRecorder from "@/app/_Components/chat/VoiceRecorder";
import { QUICK_EMOJIS } from "@/app/_Components/chat/chatUtils";

const EXTRA_EMOJIS = [
  "😀",
  "😁",
  "😅",
  "😍",
  "🤔",
  "👏",
  "🎉",
  "💯",
  "😎",
  "🤝",
  "😴",
  "🙌",
];

function ChatComposer({
  theme,
  activeId,
  active,
  editing,
  text,
  setText,
  textAreaRef,
  fileRef,
  voiceMode,
  setVoiceMode,
  showEmoji,
  setShowEmoji,
  showAttach,
  setShowAttach,
  replyTo,
  setReplyTo,
  uploadPct,
  mentionOpen,
  setMentionOpen,
  mentionCandidates,
  mentionIndex,
  setMentionIndex,
  insertMention,
  onType,
  onSend,
  onUploadFiles,
  onVoiceSend,
}) {
  return (
    <>
      {replyTo && (
        <div className={`flex items-center gap-2 border-t px-3 py-2 ${theme.header}`}>
          <Reply className="h-4 w-4 text-zinc-500" />
          <div className="min-w-0 flex-1 text-xs">
            <p className="font-semibold">Replying</p>
            <p className="truncate text-zinc-500">{replyTo.body || replyTo.type}</p>
          </div>
          <button type="button" onClick={() => setReplyTo(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {uploadPct != null && (
        <div className="px-4 py-1">
          <div className="h-1 overflow-hidden rounded bg-zinc-200">
            <div
              className="h-full bg-zinc-900 transition-all"
              style={{ width: `${uploadPct}%` }}
            />
          </div>
        </div>
      )}

      <footer className={`shrink-0 px-2 py-2 sm:px-3 ${theme.composer}`}>
        {voiceMode ? (
          <VoiceRecorder
            conversationId={activeId}
            onCancel={() => setVoiceMode(false)}
            onSend={onVoiceSend}
          />
        ) : (
          <div className="flex w-full min-w-0 items-center gap-1">
            <div className="relative shrink-0 flex items-center">
              <button
                type="button"
                aria-label="Emoji"
                className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full hover:bg-black/5"
                onClick={() => setShowEmoji((v) => !v)}
              >
                <Smile className="h-5 w-5 text-zinc-500 sm:h-6 sm:w-6" />
              </button>
              {showEmoji && (
                <div className="absolute bottom-12 left-0 z-30 grid w-56 grid-cols-8 gap-1 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl">
                  {[...QUICK_EMOJIS, ...EXTRA_EMOJIS].map((em) => (
                    <button
                      key={em}
                      type="button"
                      className="text-lg hover:scale-110"
                      onClick={() => setText((t) => t + em)}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative shrink-0 flex items-center">
              <button
                type="button"
                aria-label="Attach"
                className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full hover:bg-black/5"
                onClick={() => setShowAttach((v) => !v)}
              >
                <Paperclip className="h-5 w-5 text-zinc-500" />
              </button>
              {showAttach && (
                <div className="absolute bottom-12 left-0 z-30 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-xl text-zinc-800">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-zinc-50"
                    onClick={() => {
                      fileRef.current.accept = "image/*,video/*";
                      fileRef.current.click();
                    }}
                  >
                    <ImageIcon className="h-4 w-4 text-purple-600" /> Photos & videos
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-zinc-50"
                    onClick={() => {
                      fileRef.current.accept = "*/*";
                      fileRef.current.click();
                    }}
                  >
                    <FileText className="h-4 w-4 text-sky-600" /> Document
                  </button>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => onUploadFiles(e.target.files)}
              />
            </div>
            <div className="relative min-w-0 flex-1">
              {mentionOpen && mentionCandidates.length > 0 && (
                <div className="absolute bottom-full left-0 right-0 z-40 mb-1 max-h-52 overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-xl">
                  {mentionCandidates.map((u, idx) => (
                    <button
                      key={u._id || idx}
                      type="button"
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-zinc-50 ${
                        idx === mentionIndex ? "bg-zinc-100" : ""
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        insertMention(u);
                      }}
                    >
                      <Avatar src={u.image} name={u.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {u.fullName}
                        </p>
                        {u.designation ? (
                          <p className="truncate text-[11px] text-zinc-500">
                            {u.designation}
                          </p>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <textarea
                ref={textAreaRef}
                rows={1}
                value={text}
                onChange={(e) => onType(e.target.value, e.target.selectionStart)}
                onClick={(e) => onType(e.target.value, e.target.selectionStart)}
                onKeyUp={(e) => onType(e.target.value, e.target.selectionStart)}
                onKeyDown={(e) => {
                  if (mentionOpen && mentionCandidates.length > 0) {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setMentionIndex((i) => (i + 1) % mentionCandidates.length);
                      return;
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setMentionIndex(
                        (i) => (i - 1 + mentionCandidates.length) % mentionCandidates.length
                      );
                      return;
                    }
                    if (e.key === "Enter" || e.key === "Tab") {
                      e.preventDefault();
                      insertMention(mentionCandidates[mentionIndex] || mentionCandidates[0]);
                      return;
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      setMentionOpen(false);
                      return;
                    }
                  }
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                placeholder={
                  editing
                    ? "Edit message"
                    : active?.type === "group"
                      ? "Type a message · @ to mention"
                      : "Type a message"
                }
                className={`max-h-28 min-h-[42px] w-full resize-none rounded-3xl px-3 py-2.5 text-[15px] outline-none shadow-sm sm:px-4 ${theme.input}`}
              />
            </div>
            {text.trim() ? (
              <button
                type="button"
                aria-label="Send"
                onClick={onSend}
                className={`inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full shadow-sm ${theme.accent}`}
              >
                <Send className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Voice message"
                onClick={() => setVoiceMode(true)}
                className={`inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full shadow-sm ${theme.accent}`}
              >
                <Mic className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </footer>
    </>
  );
}

export default memo(ChatComposer);
