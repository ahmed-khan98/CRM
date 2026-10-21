"use client";

import { forwardRef, memo, useCallback, useImperativeHandle } from "react";
import { Paperclip, Smile, Send, Mic } from "lucide-react";
import VoiceRecorder from "@/app/_Components/chat/VoiceRecorder";
import ClickAway from "@/app/_Components/chat/ui/ClickAway";
import IconButton from "@/app/_Components/chat/ui/IconButton";
import EmojiPicker from "@/app/_Components/chat/composer/EmojiPicker";
import AttachMenu from "@/app/_Components/chat/composer/AttachMenu";
import PendingFilesStrip from "@/app/_Components/chat/composer/PendingFilesStrip";
import ReplyBar from "@/app/_Components/chat/composer/ReplyBar";
import UploadProgress from "@/app/_Components/chat/composer/UploadProgress";
import ComposerTextField from "@/app/_Components/chat/composer/ComposerTextField";
import useComposerDraft from "@/app/_Components/chat/hooks/useComposerDraft";

const ChatComposer = forwardRef(function ChatComposer(
  {
    theme,
    activeId,
    active,
    myId,
    editing,
    onClearEditing,
    replyTo,
    setReplyTo,
    emit,
    sendPayload,
    uploadFile,
    editMsg,
    dark = false,
  },
  ref
) {
  const draft = useComposerDraft({
    activeId,
    active,
    myId,
    editing,
    onClearEditing,
    replyTo,
    setReplyTo,
    emit,
    sendPayload,
    uploadFile,
    editMsg,
  });

  useImperativeHandle(
    ref,
    () => ({
      addFiles: draft.addPendingFiles,
    }),
    [draft.addPendingFiles]
  );

  const closePopovers = useCallback(() => {
    draft.setShowEmoji(false);
    draft.setShowAttach(false);
  }, [draft.setShowEmoji, draft.setShowAttach]);

  const hasPendingFiles = draft.pendingFiles.length > 0;
  const showSend =
    Boolean(draft.text.trim()) ||
    hasPendingFiles ||
    draft.sendingAttachments ||
    draft.uploadPct != null;

  return (
    <>
      <ReplyBar theme={theme} replyTo={replyTo} onCancel={() => setReplyTo(null)} />

      <UploadProgress uploadPct={draft.uploadPct} />

      <footer className={`shrink-0 px-2.5 py-2.5 sm:px-4 sm:py-3 ${theme.composer}`}>
        {draft.voiceMode ? (
          <VoiceRecorder
            conversationId={activeId}
            onCancel={() => draft.setVoiceMode(false)}
            onSend={draft.onVoiceSend}
          />
        ) : (
          <>
            <PendingFilesStrip
              files={draft.pendingFiles}
              onRemove={draft.removePendingFile}
            />
            <div className="flex w-full min-w-0 items-end gap-2">
              <ClickAway
                enabled={draft.showEmoji}
                onAway={() => draft.setShowEmoji(false)}
                className="relative flex h-11 w-11 shrink-0 items-center justify-center"
              >
                <IconButton
                  label="Emoji"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${theme.iconBtn}`}
                  onClick={() => {
                    draft.setShowEmoji((v) => !v);
                    draft.setShowAttach(false);
                  }}
                >
                  <Smile className="h-5 w-5 text-zinc-500" />
                </IconButton>
                {draft.showEmoji && (
                  <EmojiPicker
                    dark={dark}
                    theme={theme}
                    onPick={(em) => draft.setText((t) => t + em)}
                  />
                )}
              </ClickAway>

              <ClickAway
                enabled={draft.showAttach}
                onAway={() => draft.setShowAttach(false)}
                className="relative flex h-11 w-11 shrink-0 items-center justify-center"
              >
                <IconButton
                  label="Attach"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${theme.iconBtn}`}
                  onClick={() => {
                    draft.setShowAttach((v) => !v);
                    draft.setShowEmoji(false);
                  }}
                >
                  <Paperclip className="h-5 w-5 text-zinc-500" />
                </IconButton>
                {draft.showAttach && (
                  <AttachMenu
                    onPhotos={draft.pickPhotos}
                    onDocument={draft.pickDocument}
                    dark={dark}
                    theme={theme}
                  />
                )}
                <input
                  ref={draft.fileRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={draft.onFileInputChange}
                />
              </ClickAway>

              <ComposerTextField
                theme={theme}
                dark={dark}
                textAreaRef={draft.textAreaRef}
                text={draft.text}
                onType={draft.onType}
                onPasteFile={draft.onPasteFile}
                mentionOpen={draft.mentionOpen}
                mentionCandidates={draft.mentionCandidates}
                mentionIndex={draft.mentionIndex}
                setMentionIndex={draft.setMentionIndex}
                insertMention={draft.insertMention}
                setMentionOpen={draft.setMentionOpen}
                onEscape={closePopovers}
                onSend={draft.handleSend}
                placeholder={
                  editing
                    ? "Edit message"
                    : hasPendingFiles || draft.sendingAttachments
                      ? "Add a caption..."
                      : active?.type === "group"
                        ? "Type a message · @ to mention"
                        : "Type a message"
                }
              />

              {showSend ? (
                <IconButton
                  label="Send"
                  onClick={draft.handleSend}
                  disabled={draft.sendingAttachments}
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm transition ${theme.accent} disabled:opacity-60`}
                >
                  <Send className="h-5 w-5" />
                </IconButton>
              ) : (
                <IconButton
                  label="Voice message"
                  onClick={draft.startVoiceMode}
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm transition ${theme.accent}`}
                >
                  <Mic className="h-5 w-5" />
                </IconButton>
              )}
            </div>
          </>
        )}
      </footer>
    </>
  );
});

ChatComposer.displayName = "ChatComposer";

export default memo(ChatComposer);
