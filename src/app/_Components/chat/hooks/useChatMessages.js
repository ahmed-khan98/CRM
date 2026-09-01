"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { sameId } from "@/app/_Components/chat/chatUtils";

export default function useChatMessages({
  activeId,
  myId,
  replyTo,
  emit,
  on,
  markRead,
  fetchMessages,
  refetchConvs,
  onConversationRemoved,
}) {
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [recordingUsers, setRecordingUsers] = useState({});
  const messagesRef = useRef(messages);
  const bottomRef = useRef(null);
  const listRef = useRef(null);
  const onRemovedRef = useRef(onConversationRemoved);
  onRemovedRef.current = onConversationRemoved;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const loadMessages = useCallback(
    async (conversationId, before) => {
      if (!conversationId) return;
      setLoadingMsgs(true);
      try {
        const res = await fetchMessages({
          conversationId,
          before,
          limit: 40,
        }).unwrap();
        const payload = res?.data?.items ? res.data : res?.data?.data || res?.data || res;
        const items = payload?.items || (Array.isArray(payload) ? payload : []);
        setHasMore(Boolean(payload?.hasMore));
        if (before) {
          setMessages((prev) => {
            const ids = new Set(prev.map((m) => m._id));
            const unique = items.filter((m) => !ids.has(m._id));
            return [...unique, ...prev];
          });
        } else {
          setMessages(items);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "auto" }), 50);
        }
      } catch (err) {
        console.error("[chat] loadMessages failed", err);
        toast.error(err?.data?.message || err?.error || "Failed to load messages");
      } finally {
        setLoadingMsgs(false);
      }
    },
    [fetchMessages]
  );

  useEffect(() => {
    setTypingUsers({});
    setRecordingUsers({});
    if (!activeId) {
      setMessages([]);
      return;
    }
    setMessages([]);
    loadMessages(activeId);
    emit("chat:join", { conversationId: activeId });
    markRead(activeId);
    emit("chat:seen", { conversationId: activeId });
    return () => emit("chat:leave", { conversationId: activeId });
  }, [activeId, emit, loadMessages, markRead]);

  useEffect(() => {
    const offs = [
      on("chat:message:new", (msg) => {
        const msgConvId =
          msg?.conversationId?._id || msg?.conversationId?.toString?.() || msg?.conversationId;
        if (String(msgConvId) !== String(activeId)) return;
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          if (msg.clientId && prev.some((m) => m.clientId === msg.clientId)) {
            return prev.map((m) => (m.clientId === msg.clientId ? msg : m));
          }
          return [...prev, msg];
        });
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 30);
        const senderId = msg.senderId?._id || msg.senderId;
        if (String(senderId) !== String(myId)) {
          emit("chat:delivered", {
            conversationId: activeId,
            messageIds: [msg._id],
          });
          markRead(activeId);
          emit("chat:seen", { conversationId: activeId });
        }
      }),
      on("chat:message:updated", (msg) => {
        if (!msg?._id) return;
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? msg : m)));
      }),
      on("chat:message:deleted", (payload) => {
        if (payload?.forEveryone) {
          const label =
            payload?.message?.body ||
            payload?.deletedByName ||
            "This message was deleted";
          setMessages((prev) =>
            prev.map((m) =>
              m._id === payload.messageId
                ? {
                    ...m,
                    deletedForEveryone: true,
                    body: label,
                    attachments: [],
                    type: "system",
                  }
                : m
            )
          );
        } else {
          setMessages((prev) => prev.filter((m) => m._id !== payload.messageId));
        }
        refetchConvs();
      }),
      on("chat:message:seen", (payload) => {
        refetchConvs();
        if (!sameId(payload?.conversationId, activeId)) return;
        setMessages((prev) =>
          prev.map((m) => {
            if (!sameId(m.senderId, myId)) return m;
            const receipts = m.receipts || [];
            let found = false;
            const next = receipts.map((r) => {
              if (!sameId(r.userId, payload.userId)) return r;
              found = true;
              return { ...r, seenAt: payload.seenAt, deliveredAt: payload.seenAt };
            });
            if (!found && payload.userId) {
              next.push({
                userId: payload.userId,
                seenAt: payload.seenAt,
                deliveredAt: payload.seenAt,
              });
            }
            return { ...m, receipts: next };
          })
        );
      }),
      on("chat:message:delivered", (payload) => {
        if (!sameId(payload?.conversationId, activeId)) return;
        const ids = new Set((payload.messageIds || []).map(String));
        setMessages((prev) =>
          prev.map((m) => {
            if (!ids.has(String(m._id))) return m;
            return {
              ...m,
              receipts: (m.receipts || []).map((r) =>
                sameId(r.userId, payload.userId)
                  ? { ...r, deliveredAt: payload.deliveredAt }
                  : r
              ),
            };
          })
        );
      }),
      on("chat:typing", (payload) => {
        if (payload.conversationId !== activeId) return;
        setTypingUsers((prev) => ({
          ...prev,
          [payload.userId]: payload.isTyping,
        }));
      }),
      on("chat:recording", (payload) => {
        if (payload.conversationId !== activeId) return;
        setRecordingUsers((prev) => ({
          ...prev,
          [payload.userId]: payload.isRecording,
        }));
      }),
      on("chat:conversation:removed", (payload) => {
        const cid = payload?.conversationId?.toString?.() || payload?.conversationId;
        if (cid && activeId && String(activeId) === String(cid)) {
          setMessages([]);
          onRemovedRef.current?.();
        }
        refetchConvs();
      }),
      on("chat:conversation:updated", () => {
        refetchConvs();
      }),
    ];
    return () => offs.forEach((o) => o?.());
  }, [activeId, emit, markRead, myId, on, refetchConvs]);

  const sendPayload = useCallback(
    (payload) => {
      const clientId = `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const optimistic = {
        _id: clientId,
        clientId,
        conversationId: activeId,
        senderId: { _id: myId, fullName: "You" },
        type: payload.type || "text",
        body: payload.body || "",
        attachments: payload.attachments || [],
        replyTo,
        createdAt: new Date().toISOString(),
        receipts: [],
        pending: true,
      };
      setMessages((prev) => [...prev, optimistic]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 20);

      emit(
        "chat:message:send",
        {
          conversationId: activeId,
          body: payload.body || "",
          type: payload.type || "text",
          replyTo: replyTo?._id || null,
          mentions: payload.mentions || [],
          attachments: payload.attachments || [],
          clientId,
        },
        (ack) => {
          if (!ack?.ok) {
            toast.error(ack?.error || "Failed to send");
            setMessages((prev) => prev.filter((m) => m.clientId !== clientId));
            return;
          }
          setMessages((prev) =>
            prev.map((m) => (m.clientId === clientId ? ack.message : m))
          );
          refetchConvs();
        }
      );
    },
    [activeId, myId, replyTo, emit, refetchConvs]
  );

  return {
    messages,
    setMessages,
    messagesRef,
    hasMore,
    loadingMsgs,
    loadMessages,
    sendPayload,
    bottomRef,
    listRef,
    typingUsers,
    recordingUsers,
  };
}
