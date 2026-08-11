"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import {
  useGetConversationsQuery,
  useLazyGetMessagesQuery,
  useCreateDirectChatMutation,
  useCreateGroupChatMutation,
  useUpdateConversationMutation,
  useMarkConversationReadMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useReactMessageMutation,
  useStarMessageMutation,
  useForwardMessageMutation,
  useLazySearchChatUsersQuery,
  useUploadChatFileMutation,
  useGetSharedMediaQuery,
  useDeleteGroupMutation,
  useDeleteChatForMeMutation,
  useRemoveGroupMemberMutation,
  useAddGroupMembersMutation,
  useGetCallLogsQuery,
  useLazySearchMessagesQuery,
  useAdminDisableChatMutation,
  useAdminEnableChatMutation,
  useLazyGetChatPresenceQuery,
} from "@/app/_Services/chat/chatApi";
import { useSocket } from "@/app/_Components/Socket/SocketProvider";
import { useCall } from "@/app/_Components/chat/CallContext";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import AddMembersModal from "@/app/_Components/chat/AddMembersModal";
import NewChatModal from "@/app/_Components/chat/NewChatModal";
import ConversationSidebar from "@/app/_Components/chat/ConversationSidebar";
import ChatHeader from "@/app/_Components/chat/ChatHeader";
import MessageList from "@/app/_Components/chat/MessageList";
import ChatComposer from "@/app/_Components/chat/ChatComposer";
import ChatInfoPanel from "@/app/_Components/chat/ChatInfoPanel";
import MessageContextMenu from "@/app/_Components/chat/MessageContextMenu";
import ForwardModal from "@/app/_Components/chat/ForwardModal";
import {
  getMyId,
  getCurrentUser,
  conversationTitle,
  conversationPeer,
  getNextConsecutiveVoiceId,
  getChatTheme,
} from "@/app/_Components/chat/chatUtils";

export default function ChatApp() {
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  const myId = getMyId();
  const { emit, on, connected, isUserOnline, getPresence } = useSocket();
  const { startOutgoing } = useCall();

  const [listFilter, setListFilter] = useState("all"); // all | groups | archived
  const [filter, setFilter] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newMode, setNewMode] = useState("direct"); // direct | group
  const [typingUsers, setTypingUsers] = useState({});
  const [recordingUsers, setRecordingUsers] = useState({});
  const [voiceMode, setVoiceMode] = useState(false);
  const [menuMsg, setMenuMsg] = useState(null);
  const [forwardMsg, setForwardMsg] = useState(null);
  const [dark, setDark] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [uploadPct, setUploadPct] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [presenceOverlay, setPresenceOverlay] = useState({});
  const [activeVoiceId, setActiveVoiceId] = useState(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [confirmDeleteChat, setConfirmDeleteChat] = useState(null);
  const [isDeletingChat, setIsDeletingChat] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [mediaTab, setMediaTab] = useState("media"); // media | docs | links
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(-1);
  const [mentionIndex, setMentionIndex] = useState(0);

  const bottomRef = useRef(null);
  const listRef = useRef(null);
  const fileRef = useRef(null);
  const typingTimer = useRef(null);
  const headerMenuRef = useRef(null);
  const textAreaRef = useRef(null);

  const { data: convData, refetch: refetchConvs } = useGetConversationsQuery({
    archived: listFilter === "archived",
  });
  const conversations = convData?.data || [];

  const [fetchMessages] = useLazyGetMessagesQuery();
  const [searchUsers, { data: userSearch }] = useLazySearchChatUsersQuery();
  const [searchMsgs, { data: msgSearch }] = useLazySearchMessagesQuery();
  const [createDirect] = useCreateDirectChatMutation();
  const [createGroup] = useCreateGroupChatMutation();
  const [updateConv] = useUpdateConversationMutation();
  const [markRead] = useMarkConversationReadMutation();
  const [editMsg] = useEditMessageMutation();
  const [delMsg] = useDeleteMessageMutation();
  const [reactMsg] = useReactMessageMutation();
  const [starMsg] = useStarMessageMutation();
  const [fwdMsg] = useForwardMessageMutation();
  const [uploadFile] = useUploadChatFileMutation();
  const [deleteGroup] = useDeleteGroupMutation();
  const [deleteChatForMe] = useDeleteChatForMeMutation();
  const [removeMember] = useRemoveGroupMemberMutation();
  const [addMembers] = useAddGroupMembersMutation();
  const [adminDisable] = useAdminDisableChatMutation();
  const [adminEnable] = useAdminEnableChatMutation();
  const [fetchPresence] = useLazyGetChatPresenceQuery();
  const meRole = getCurrentUser()?.role;
  // Group create: open to every chat user (USER / SUBADMIN / DEP_ADMIN / HR / Finance / ADMIN)
  const canCreateGroup = Boolean(meRole);

  const active = useMemo(
    () => conversations.find((c) => c._id === activeId) || null,
    [conversations, activeId]
  );

  const { data: mediaData } = useGetSharedMediaQuery(
    { conversationId: activeId, kind: mediaTab },
    { skip: !activeId || !showInfo }
  );
  const { data: callsData } = useGetCallLogsQuery({}, { skip: !showInfo });

  const peer = conversationPeer(active, myId);
  const peerId = peer?._id ? String(peer._id) : null;
  const iAmGroupAdmin =
    active?.type === "group" &&
    (active?.myMeta?.role === "admin" ||
      active?.participants?.some(
        (p) =>
          (p.userId?._id || p.userId)?.toString() === myId?.toString() &&
          p.role === "admin"
      ));

  const onlineOf = useCallback(
    (userId) => {
      if (!userId) return false;
      const id = String(userId);
      if (isUserOnline(id)) return true;
      const o = presenceOverlay[id];
      return Boolean(o?.isOnline || o?.status === "online");
    },
    [isUserOnline, presenceOverlay]
  );

  const presenceOf = useCallback(
    (userId) => {
      if (!userId) return null;
      const id = String(userId);
      return getPresence(id) || presenceOverlay[id] || null;
    },
    [getPresence, presenceOverlay]
  );

  const peerOnline = peerId ? onlineOf(peerId) : false;
  const peerPresence = peerId ? presenceOf(peerId) : null;

  const closeHeaderMenu = useCallback(() => setHeaderMenuOpen(false), []);

  const handleDeleteChat = useCallback(async () => {
    if (!confirmDeleteChat) return;
    setIsDeletingChat(true);
    try {
      await deleteChatForMe(confirmDeleteChat).unwrap();
      setConfirmDeleteChat(null);
      setActiveId(null);
      setMessages([]);
      setMobileShowChat(false);
      setShowInfo(false);
      toast.success("Chat deleted");
      refetchConvs();
    } catch (e) {
      toast.error(e?.data?.message || "Could not delete chat");
    } finally {
      setIsDeletingChat(false);
    }
  }, [confirmDeleteChat, deleteChatForMe, refetchConvs]);

  const handleConfirmAction = useCallback(async () => {
    if (!confirmAction) return;
    setConfirmBusy(true);
    try {
      if (confirmAction.type === "leaveGroup") {
        await removeMember({
          id: confirmAction.conversationId || activeId,
          userId: myId,
        }).unwrap();
        setActiveId(null);
        setMessages([]);
        setShowInfo(false);
        toast.success("Left group");
        refetchConvs();
      } else if (confirmAction.type === "deleteGroup") {
        const id = confirmAction.conversationId || activeId;
        await deleteGroup(id).unwrap();
        setActiveId(null);
        setMessages([]);
        setShowInfo(false);
        toast.success("Group deleted");
        refetchConvs();
      } else if (confirmAction.type === "removeMember") {
        await removeMember({
          id: confirmAction.conversationId || activeId,
          userId: confirmAction.userId,
        }).unwrap();
        toast.success("Member removed");
        refetchConvs();
      }
      setConfirmAction(null);
    } catch (e) {
      toast.error(e?.data?.message || "Action failed");
    } finally {
      setConfirmBusy(false);
    }
  }, [
    confirmAction,
    activeId,
    myId,
    removeMember,
    deleteGroup,
    refetchConvs,
  ]);

  const confirmModalProps = useMemo(() => {
    if (!confirmAction) return null;
    if (confirmAction.type === "leaveGroup") {
      return {
        title: "Leave Group",
        description:
          "Do you really want to leave this group? You will stop receiving messages until someone adds you again.",
        confirmLabel: "Yes, Leave",
        icon: "leave",
      };
    }
    if (confirmAction.type === "deleteGroup") {
      return {
        title: "Delete Group",
        description:
          "This action cannot be undone. Do you really want to delete this group for everyone?",
        confirmLabel: "Yes, Delete",
        icon: "delete",
        message: "group",
      };
    }
    if (confirmAction.type === "removeMember") {
      return {
        title: "Remove Member",
        description: `Do you really want to remove ${
          confirmAction.name || "this member"
        } from the group?`,
        confirmLabel: "Yes, Remove",
        icon: "remove",
      };
    }
    return null;
  }, [confirmAction]);

  useEffect(() => {
    setHeaderMenuOpen(false);
    setShowAddMembers(false);
  }, [activeId]);

  useEffect(() => {
    if (!headerMenuOpen) return;
    const onPointerDown = (e) => {
      if (!headerMenuRef.current?.contains(e.target)) {
        setHeaderMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setHeaderMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [headerMenuOpen]);

  // Hydrate presence for all chat peers (API + socket snapshot)
  useEffect(() => {
    if (!connected) return;
    emit("chat:presence:request");
  }, [connected, emit]);

  useEffect(() => {
    const ids = new Set();
    conversations.forEach((c) => {
      (c.participants || []).forEach((p) => {
        const id = p.userId?._id || p.userId;
        if (id && String(id) !== String(myId)) ids.add(String(id));
      });
    });
    if (peerId) ids.add(peerId);
    if (!ids.size) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetchPresence([...ids]).unwrap();
        const list = res?.data || [];
        if (!cancelled) {
          setPresenceOverlay((prev) => {
            const next = { ...prev };
            list.forEach((u) => {
              const id = String(u.userId);
              next[id] = {
                userId: id,
                status: u.status,
                lastSeen: u.lastSeen,
                isOnline: Boolean(u.isOnline),
              };
            });
            return next;
          });
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversations, peerId, myId, fetchPresence]);

  const filteredConvs = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let list = conversations;
    if (listFilter === "groups") {
      list = list.filter((c) => c.type === "group");
    }
    if (!q) return list;
    return list.filter((c) =>
      conversationTitle(c, myId).toLowerCase().includes(q)
    );
  }, [conversations, filter, listFilter, myId]);

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
        // Support both { data: { items } } and nested shapes
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
    if (!activeId) return;
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
      }),
      on("chat:message:seen", (payload) => {
        if (payload?.conversationId !== activeId) return;
        setMessages((prev) =>
          prev.map((m) => {
            if (m.senderId?._id !== myId && m.senderId !== myId) return m;
            return {
              ...m,
              receipts: (m.receipts || []).map((r) =>
                r.userId === payload.userId ||
                r.userId?.toString() === payload.userId
                  ? { ...r, seenAt: payload.seenAt, deliveredAt: payload.seenAt }
                  : r
              ),
            };
          })
        );
      }),
      on("chat:message:delivered", (payload) => {
        if (payload?.conversationId !== activeId) return;
        setMessages((prev) =>
          prev.map((m) => {
            if (!(payload.messageIds || []).includes(m._id)) return m;
            return {
              ...m,
              receipts: (m.receipts || []).map((r) =>
                r.userId === payload.userId ||
                r.userId?.toString() === payload.userId
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
          setActiveId(null);
          setMessages([]);
          setMobileShowChat(false);
          setShowInfo(false);
        }
        refetchConvs();
      }),
      on("chat:conversation:updated", () => {
        refetchConvs();
      }),
    ];
    return () => offs.forEach((o) => o?.());
  }, [activeId, emit, markRead, myId, on, refetchConvs]);

  const sendPayload = (payload) => {
    const clientId = `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const optimistic = {
      _id: clientId,
      clientId,
      conversationId: activeId,
      senderId: { _id: myId, fullName: "You" },
      type: payload.type || "text",
      body: payload.body || "",
      attachments: payload.attachments || [],
      replyTo: replyTo,
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
    setText("");
    setReplyTo(null);
    setShowEmoji(false);
  };

  const handleSend = async () => {
    if (editing) {
      try {
        await editMsg({ messageId: editing._id, body: text }).unwrap();
        setEditing(null);
        setText("");
      } catch (e) {
        toast.error(e?.data?.message || "Edit failed");
      }
      return;
    }
    if (!text.trim()) return;
    const mentions = [];
    if (active?.type === "group") {
      (active.participants || []).forEach((p) => {
        const u = p.userId;
        const id = u?._id || u;
        const full = u?.fullName;
        if (!id || !full) return;
        const first = full.split(" ")[0];
        if (
          text.includes(`@${full}`) ||
          text.includes(`@${first}`)
        ) {
          mentions.push(id);
        }
      });
    }
    setMentionOpen(false);
    sendPayload({ body: text.trim(), type: "text", mentions });
  };

  const mentionCandidates = useMemo(() => {
    if (!mentionOpen || active?.type !== "group") return [];
    const q = mentionQuery.trim().toLowerCase();
    return (active.participants || [])
      .map((p) => p.userId)
      .filter(Boolean)
      .filter((u) => String(u._id || u) !== String(myId))
      .filter((u) => {
        if (!q) return true;
        const name = (u.fullName || "").toLowerCase();
        const des = (u.designation || "").toLowerCase();
        return name.includes(q) || des.includes(q);
      })
      .slice(0, 8);
  }, [mentionOpen, mentionQuery, active, myId]);

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
        const pos = start + name.length + 2; // @Name + space
        textAreaRef.current.focus();
        textAreaRef.current.setSelectionRange(pos, pos);
      });
    },
    [mentionStart, text]
  );

  const onType = (val, caret) => {
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
  };

  const uploadAndSend = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    setShowAttach(false);
    for (const file of list) {
      const fd = new FormData();
      fd.append("file", file);
      setUploadPct(0);
      try {
        // RTK doesn't expose progress easily — simulate steps
        setUploadPct(40);
        const res = await uploadFile(fd).unwrap();
        setUploadPct(100);
        const { type, attachment } = res.data;
        sendPayload({
          type: type === "audio" ? "audio" : type,
          body: "",
          attachments: [attachment],
        });
      } catch {
        toast.error("Upload failed");
      } finally {
        setTimeout(() => setUploadPct(null), 400);
      }
    }
  };

  const openChat = useCallback((id) => {
    setActiveVoiceId(null);
    setActiveId(id);
    setMobileShowChat(true);
    setShowInfo(false);
  }, []);

  const onToggleDark = useCallback(() => setDark((d) => !d), []);

  const onNewChat = useCallback(() => {
    setShowNew(true);
    setNewMode("direct");
    searchUsers({ q: "" });
  }, [searchUsers]);

  const onSearchMessages = useCallback(
    (q) => {
      searchMsgs({ q, limit: 10 });
    },
    [searchMsgs]
  );

  const onReact = useCallback(
    (messageId, emoji) => {
      reactMsg({ messageId, emoji });
    },
    [reactMsg]
  );

  const onVoiceSend = useCallback(
    (payload) => {
      setVoiceMode(false);
      sendPayload(payload);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeId, replyTo]
  );

  const handleVoiceRequestPlay = useCallback((id) => {
    setActiveVoiceId(id);
  }, []);

  const handleVoiceStopChain = useCallback(() => {
    setActiveVoiceId(null);
  }, []);

  const handleVoiceEnded = useCallback(
    (id) => {
      setActiveVoiceId((prev) => {
        if (prev && prev !== String(id)) return prev;
        return getNextConsecutiveVoiceId(messages, id);
      });
    },
    [messages]
  );

  const typingLabel = useMemo(
    () =>
      Object.entries(typingUsers)
        .filter(([uid, v]) => v && uid !== myId)
        .map(([uid]) => {
          const p = active?.participants?.find(
            (x) => (x.userId?._id || x.userId)?.toString() === uid
          );
          return p?.userId?.fullName?.split(" ")[0] || "Someone";
        }),
    [typingUsers, active, myId]
  );
  const recordingLabel = useMemo(
    () =>
      Object.entries(recordingUsers)
        .filter(([uid, v]) => v && uid !== myId)
        .map(([uid]) => {
          const p = active?.participants?.find(
            (x) => (x.userId?._id || x.userId)?.toString() === uid
          );
          return p?.userId?.fullName?.split(" ")[0] || "Someone";
        }),
    [recordingUsers, active, myId]
  );

  const theme = useMemo(() => getChatTheme(dark), [dark]);

  return (
    <div
      className={`flex h-full min-h-0 overflow-hidden rounded-xl border border-zinc-200 shadow-sm ${theme.shell}`}
    >
      <ConversationSidebar
        theme={theme}
        dark={dark}
        connected={connected}
        mobileShowChat={mobileShowChat}
        filter={filter}
        setFilter={setFilter}
        listFilter={listFilter}
        setListFilter={setListFilter}
        filteredConvs={filteredConvs}
        activeId={activeId}
        myId={myId}
        onlineOf={onlineOf}
        openChat={openChat}
        onToggleDark={onToggleDark}
        onNewChat={onNewChat}
        onSearchMessages={onSearchMessages}
      />

      {/* Main */}
      <section
        className={`${
          mobileShowChat ? "flex" : "hidden md:flex"
        } min-w-0 flex-1 flex-col overflow-hidden ${theme.main}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (activeId) uploadAndSend(e.dataTransfer.files);
        }}
      >
        {!active ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-zinc-500 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200/80">
              <Users className="h-10 w-10 opacity-50" />
            </div>
            <p className="text-xl font-light text-zinc-700">CRM Chat</p>
            <p className="text-sm">Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            <ChatHeader
              theme={theme}
              active={active}
              activeId={activeId}
              myId={myId}
              peer={peer}
              peerOnline={peerOnline}
              peerPresence={peerPresence}
              typingLabel={typingLabel}
              recordingLabel={recordingLabel}
              headerMenuOpen={headerMenuOpen}
              setHeaderMenuOpen={setHeaderMenuOpen}
              headerMenuRef={headerMenuRef}
              closeHeaderMenu={closeHeaderMenu}
              setMobileShowChat={setMobileShowChat}
              setShowInfo={setShowInfo}
              startOutgoing={startOutgoing}
              updateConv={updateConv}
              meRole={meRole}
              iAmGroupAdmin={iAmGroupAdmin}
              setShowAddMembers={setShowAddMembers}
              setConfirmAction={setConfirmAction}
              setConfirmDeleteChat={setConfirmDeleteChat}
              adminDisable={adminDisable}
              adminEnable={adminEnable}
            />

            <MessageList
              listRef={listRef}
              bottomRef={bottomRef}
              dark={dark}
              theme={theme}
              messages={messages}
              hasMore={hasMore}
              loadingMsgs={loadingMsgs}
              dragOver={dragOver}
              activeId={activeId}
              myId={myId}
              active={active}
              activeVoiceId={activeVoiceId}
              loadMessages={loadMessages}
              onContextMenu={setMenuMsg}
              onReact={onReact}
              onRequestPlay={handleVoiceRequestPlay}
              onStopChain={handleVoiceStopChain}
              onEnded={handleVoiceEnded}
            />

            <ChatComposer
              theme={theme}
              activeId={activeId}
              active={active}
              editing={editing}
              text={text}
              setText={setText}
              textAreaRef={textAreaRef}
              fileRef={fileRef}
              voiceMode={voiceMode}
              setVoiceMode={setVoiceMode}
              showEmoji={showEmoji}
              setShowEmoji={setShowEmoji}
              showAttach={showAttach}
              setShowAttach={setShowAttach}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              uploadPct={uploadPct}
              mentionOpen={mentionOpen}
              setMentionOpen={setMentionOpen}
              mentionCandidates={mentionCandidates}
              mentionIndex={mentionIndex}
              setMentionIndex={setMentionIndex}
              insertMention={insertMention}
              onType={onType}
              onSend={handleSend}
              onUploadFiles={uploadAndSend}
              onVoiceSend={onVoiceSend}
            />
          </>
        )}
      </section>

      {active && showInfo && (
        <ChatInfoPanel
          theme={theme}
          active={active}
          activeId={activeId}
          myId={myId}
          peer={peer}
          iAmGroupAdmin={iAmGroupAdmin}
          mediaTab={mediaTab}
          setMediaTab={setMediaTab}
          mediaData={mediaData}
          callsData={callsData}
          setShowInfo={setShowInfo}
          setShowAddMembers={setShowAddMembers}
          setConfirmAction={setConfirmAction}
          setConfirmDeleteChat={setConfirmDeleteChat}
        />
      )}

      {menuMsg && (
        <MessageContextMenu
          message={menuMsg}
          myId={myId}
          onClose={() => setMenuMsg(null)}
          onReply={setReplyTo}
          onStar={starMsg}
          onForward={setForwardMsg}
          onEdit={(msg) => {
            setEditing(msg);
            setText(msg.body || "");
          }}
          onDelete={delMsg}
        />
      )}

      {forwardMsg && (
        <ForwardModal
          message={forwardMsg}
          conversations={conversations}
          activeId={activeId}
          myId={myId}
          onClose={() => setForwardMsg(null)}
          onForward={fwdMsg}
        />
      )}

      {showNew && (
        <NewChatModal
          mode={newMode}
          setMode={setNewMode}
          onClose={() => setShowNew(false)}
          searchUsers={searchUsers}
          users={userSearch?.data || []}
          canCreateGroup={canCreateGroup}
          onPickDirect={async (userId) => {
            const res = await createDirect({ userId }).unwrap();
            setShowNew(false);
            openChat(res.data._id);
          }}
          onCreateGroup={async ({ name, memberIds }) => {
            try {
              const res = await createGroup({ name, memberIds }).unwrap();
              setShowNew(false);
              openChat(res.data._id);
              toast.success("Group created");
            } catch (err) {
              toast.error(
                err?.data?.message || err?.message || "Could not create group"
              );
            }
          }}
        />
      )}

      {showAddMembers && active?.type === "group" && (
        <AddMembersModal
          existingIds={(active.participants || []).map((p) =>
            String(p.userId?._id || p.userId)
          )}
          searchUsers={searchUsers}
          users={userSearch?.data || []}
          onClose={() => setShowAddMembers(false)}
          onAdd={async (memberIds) => {
            try {
              await addMembers({ id: activeId, memberIds }).unwrap();
              toast.success(
                memberIds.length === 1
                  ? "Member added"
                  : `${memberIds.length} members added`
              );
              setShowAddMembers(false);
              refetchConvs();
            } catch (e) {
              toast.error(e?.data?.message || "Could not add members");
            }
          }}
        />
      )}

      {confirmDeleteChat && (
        <WarningModal
          message="chat"
          setConfirmDelete={setConfirmDeleteChat}
          isDeleting={isDeletingChat}
          handleDelete={handleDeleteChat}
        />
      )}

      {confirmAction && confirmModalProps && (
        <WarningModal
          title={confirmModalProps.title}
          description={confirmModalProps.description}
          confirmLabel={confirmModalProps.confirmLabel}
          icon={confirmModalProps.icon}
          message={confirmModalProps.message}
          setConfirmDelete={setConfirmAction}
          isDeleting={confirmBusy}
          handleDelete={handleConfirmAction}
        />
      )}
    </div>
  );
}
