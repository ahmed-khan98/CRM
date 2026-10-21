"use client";

import { memo, useCallback, useEffect, useLayoutEffect } from "react";
import MentionPicker from "@/app/_Components/chat/composer/MentionPicker";

const MIN_H = 44; // ~h-11
const MAX_H = 140; // WhatsApp-like cap (~6 lines)

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
  dark = false,
}) {
  const resize = useCallback(() => {
    const el = textAreaRef?.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(MAX_H, Math.max(MIN_H, el.scrollHeight));
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > MAX_H ? "auto" : "hidden";
  }, [textAreaRef]);

  useLayoutEffect(() => {
    resize();
  }, [text, resize]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  return (
    <div className="relative min-w-0 flex-1 self-end">
      <MentionPicker
        open={mentionOpen}
        anchorRef={textAreaRef}
        candidates={mentionCandidates}
        activeIndex={mentionIndex}
        onPick={insertMention}
        dark={dark}
        theme={theme}
      />
      <textarea
        ref={textAreaRef}
        rows={1}
        value={text}
        onChange={(e) => {
          onType(e.target.value, e.target.selectionStart);
        }}
        onClick={(e) => onType(e.target.value, e.target.selectionStart)}
        onKeyUp={(e) => onType(e.target.value, e.target.selectionStart)}
        onInput={resize}
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
                (i) =>
                  (i - 1 + mentionCandidates.length) % mentionCandidates.length
              );
              return;
            }
            if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              insertMention(
                mentionCandidates[mentionIndex] || mentionCandidates[0]
              );
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
        className={`block w-full resize-none rounded-[22px] px-4 py-2.5 text-[14px] leading-[22px] outline-none overflow-hidden ${theme.input}`}
        style={{ height: MIN_H, maxHeight: MAX_H }}
      />
    </div>
  );
}

export default memo(ComposerTextField);
