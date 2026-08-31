"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { extractFilesFromClipboard } from "@/app/_utils/clipboardFiles";
import {
  checkUploadSize,
  collectMentions,
  createPendingFile,
  filterMentionCandidates,
  revokePendingFiles,
} from "@/app/_Components/chat/chatUtils";

export default function useComposerDraft({
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
}) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [uploadPct, setUploadPct] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(-1);
  const [mentionIndex, setMentionIndex] = useState(0);

  const fileRef = useRef(null);
  const textAreaRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    setPendingFiles((prev) => {
      revokePendingFiles(prev);
      return [];
    });
  }, [activeId]);

  useEffect(() => {
    if (editing) setText(editing.body || "");
  }, [editing]);

  const mentionCandidates = useMemo(
    () =>
      mentionOpen && active?.type === "group"
        ? filterMentionCandidates(active.participants, mentionQuery, myId)
        : [],
    [mentionOpen, mentionQuery, active, myId]
  );

  const addPendingFiles = useCallback((files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    setShowAttach(false);
    const next = [];
    for (const file of list) {
      const sizeError = checkUploadSize(file);
      if (sizeError) {
        toast.error(sizeError);
        continue;
      }
      next.push(createPendingFile(file));
    }
    if (next.length) setPendingFiles((prev) => [...prev, ...next]);
  }, []);

  const removePendingFile = useCallback((id) => {
    setPendingFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const onPasteFile = useCallback(
    (e) => {
      const files = extractFilesFromClipboard(e);
      if (!files.length) return;
      e.preventDefault();
      addPendingFiles(files);
    },
    [addPendingFiles]
  );

  const insertMention = useCallback(
    (user) => {
      const name = user?.fullName || "Someone";
      const el = textAreaRef.current;
      const caret = el?.selectionStart ?? text.length;
      const start = mentionStart >= 0 ? mentionStart : caret;
      const next = `${text.slice(0, start)}@${name} ${text.slice(caret)}`;
      setText(next);
      setMentionOpen(false);
      setMentionQuery("");
      setMentionStart(-1);
      requestAnimationFrame(() => {
        if (!textAreaRef.current) return;
        const pos = start + name.length + 2;
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(pos, pos);
      });
    },
    [mentionStart, text]
  );

  const onType = useCallback(
    (val, caret) => {
      setText(val);
      if (active?.type === "group") {
        const pos = caret ?? val.length;
        const before = val.slice(0, pos);
        const match = before.match(/(^|[\s\n])@([^\s@]*)$/);
        if (match) {
          setMentionOpen(true);
          setMentionQuery(match[2] || "");
          setMentionStart(before.length - (match[2]?.length || 0) - 1);
          setMentionIndex(0);
        } else {
          setMentionOpen(false);
          setMentionQuery("");
          setMentionStart(-1);
        }
      } else {
        setMentionOpen(false);
      }
      emit("chat:typing", { conversationId: activeId, isTyping: true });
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        emit("chat:typing", { conversationId: activeId, isTyping: false });
      }, 1200);
    },
    [active, emit, activeId]
  );

  const sendPendingAttachments = useCallback(async () => {
    if (!pendingFiles.length) return;
    const filesToSend = pendingFiles;
    setPendingFiles([]);
    const caption = text.trim();
    setText("");
    setReplyTo?.(null);
    setShowEmoji(false);
    for (let i = 0; i < filesToSend.length; i++) {
      const { file, previewUrl } = filesToSend[i];
      const isLast = i === filesToSend.length - 1;
      const fd = new FormData();
      fd.append("file", file);
      setUploadPct(0);
      try {
        setUploadPct(40);
        const res = await uploadFile(fd).unwrap();
        setUploadPct(100);
        const { type, attachment } = res.data;
        sendPayload({
          type: type === "audio" ? "audio" : type,
          body: isLast ? caption : "",
          attachments: [attachment],
        });
      } catch (err) {
        toast.error(err?.data?.message || "Upload failed");
      } finally {
        setTimeout(() => setUploadPct(null), 400);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      }
    }
  }, [pendingFiles, text, uploadFile, sendPayload, setReplyTo]);

  const handleSend = useCallback(async () => {
    if (editing) {
      try {
        await editMsg({ messageId: editing._id, body: text }).unwrap();
        onClearEditing?.();
        setText("");
      } catch (e) {
        toast.error(e?.data?.message || "Edit failed");
      }
      return;
    }
    if (pendingFiles.length > 0) {
      await sendPendingAttachments();
      return;
    }
    if (!text.trim()) return;
    const mentions =
      active?.type === "group" ? collectMentions(text, active.participants) : [];
    setMentionOpen(false);
    sendPayload({ body: text.trim(), type: "text", mentions });
    setText("");
    setReplyTo?.(null);
    setShowEmoji(false);
  }, [
    editing,
    editMsg,
    text,
    active,
    myId,
    sendPayload,
    pendingFiles,
    sendPendingAttachments,
    onClearEditing,
    setReplyTo,
  ]);

  const onVoiceSend = useCallback(
    (payload) => {
      setVoiceMode(false);
      sendPayload(payload);
      setText("");
      setReplyTo?.(null);
      setShowEmoji(false);
    },
    [sendPayload, setReplyTo]
  );

  const pickPhotos = useCallback(() => {
    if (!fileRef.current) return;
    fileRef.current.accept = "image/*,video/*";
    fileRef.current.click();
    setShowAttach(false);
  }, []);

  const pickDocument = useCallback(() => {
    if (!fileRef.current) return;
    fileRef.current.accept = "*/*";
    fileRef.current.click();
    setShowAttach(false);
  }, []);

  return {
    text,
    setText,
    showEmoji,
    setShowEmoji,
    showAttach,
    setShowAttach,
    voiceMode,
    setVoiceMode,
    uploadPct,
    pendingFiles,
    mentionOpen,
    setMentionOpen,
    mentionCandidates,
    mentionIndex,
    setMentionIndex,
    fileRef,
    textAreaRef,
    addPendingFiles,
    removePendingFile,
    onPasteFile,
    insertMention,
    onType,
    handleSend,
    onVoiceSend,
    pickPhotos,
    pickDocument,
  };
}
