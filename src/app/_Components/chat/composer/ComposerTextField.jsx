"use client";

import { memo } from "react";
import MentionPicker from "@/app/_Components/chat/composer/MentionPicker";

function ComposerTextField({
  theme,
  textAreaRef,
  text,
  onType,
  onPasteFile,
  mentionOpen,
  mentionCandidates,
  mentionIndex,
  setMentionIndex,
  insertMention,
  setMentionOpen,
  onEscape,
  onSend,
  placeholder,
}) {
  return (
    <div className="relative min-w-0 flex-1">
      {mentionOpen && (
        <MentionPicker
          candidates={mentionCandidates}
          activeIndex={mentionIndex}
          onPick={insertMention}
        />
      )}
      <textarea
        ref={textAreaRef}
        rows={1}
        value={text}
        onChange={(e) => onType(e.target.value, e.target.selectionStart)}
        onClick={(e) => onType(e.target.value, e.target.selectionStart)}
        onKeyUp={(e) => onType(e.target.value, e.target.selectionStart)}
        onPaste={onPasteFile}
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
          if (e.key === "Escape") {
            onEscape();
            return;
          }
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder={placeholder}
        className={`max-h-28 min-h-[42px] w-full resize-none rounded-3xl px-3 py-2.5 text-[15px] outline-none shadow-sm sm:px-4 ${theme.input}`}
      />
    </div>
  );
}

export default memo(ComposerTextField);
