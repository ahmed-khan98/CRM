"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import ConversationSidebar from "@/app/_Components/chat/ConversationSidebar";
import ChatHeader from "@/app/_Components/chat/ChatHeader";
import MessageList from "@/app/_Components/chat/MessageList";
import ChatComposer from "@/app/_Components/chat/ChatComposer";
import ChatInfoPanel from "@/app/_Components/chat/ChatInfoPanel";
import ChatEmptyState from "@/app/_Components/chat/ChatEmptyState";
import ChatOverlays from "@/app/_Components/chat/ChatOverlays";
import useClickAway from "@/app/_Components/chat/hooks/useClickAway";
import useChatPresence from "@/app/_Components/chat/hooks/useChatPresence";
import useChatMessages from "@/app/_Components/chat/hooks/useChatMessages";
import useChatConfirm from "@/app/_Components/chat/hooks/useChatConfirm";
import {
  getMyId,
  getCurrentUser,
  conversationPeer,
  getNextConsecutiveVoiceId,
  getChatTheme,
  activityNames,
  isConversationGroupAdmin,
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

  const [listFilter, setListFilter] = useState("all");
  const [activeId, setActiveId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newMode, setNewMode] = useState("direct");
  const [menuMsg, setMenuMsg] = useState(null);
  const [forwardMsg, setForwardMsg] = useState(null);
  const [dark, setDark] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [activeVoiceId, setActiveVoiceId] = useState(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [listMenuConv, setListMenuConv] = useState(null);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [mediaTab, setMediaTab] = useState("media");

  const headerMenuRef = useRef(null);
  const composerRef = useRef(null);

  const { data: convData, refetch: refetchConvs } = useGetConversationsQuery({
    archived: listFilter === "archived",
  });
  const conversations = useMemo(() => convData?.data || [], [convData]);

  const [fetchMessages] = useLazyGetMessagesQuery();
  const [searchUsers, { data: userSearch }] = useLazySearchChatUsersQuery();
  const [searchMsgs] = useLazySearchMessagesQuery();
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
  const canCreateGroup = Boolean(meRole);
  const active = useMemo(
    () => conversations.find((c) => c._id === activeId) || null,
    [conversations, activeId]
  );
  const peer = conversationPeer(active, myId);
  const peerId = peer?._id ? String(peer._id) : null;
  const iAmGroupAdmin = isConversationGroupAdmin(active, myId);

  const { data: mediaData } = useGetSharedMediaQuery(
    { conversationId: activeId, kind: mediaTab },
    { skip: !activeId || !showInfo }
  );
  const { data: callsData } = useGetCallLogsQuery({}, { skip: !showInfo });

  const closeChatView = useCallback(() => {
    setActiveId(null);
    setMobileShowChat(false);
    setShowInfo(false);
  }, []);

  const leaveActiveConversation = useCallback(() => {
    setActiveId(null);
    setShowInfo(false);
  }, []);

  const {
    messages,
    messagesRef,
    hasMore,
    loadingMsgs,
    loadMessages,
    sendPayload,
    bottomRef,
    listRef,
    typingUsers,
    recordingUsers,
  } = useChatMessages({
    activeId,
    myId,
    replyTo,
    emit,
    on,
    markRead,
    fetchMessages,
    refetchConvs,
    onConversationRemoved: closeChatView,
  });

  const { onlineOf, presenceOf, peerOnline, peerPresence } = useChatPresence({
    conversations,
    peerId,
    myId,
    connected,
    emit,
    fetchPresence,
    isUserOnline,
    getPresence,
  });

  const confirm = useChatConfirm({
    activeId,
    myId,
    removeMember,
    deleteGroup,
    deleteChatForMe,
    refetchConvs,
    onChatClosed: closeChatView,
    onLeftGroup: leaveActiveConversation,
  });

  const closeHeaderMenu = useCallback(() => setHeaderMenuOpen(false), []);
  useClickAway(headerMenuRef, closeHeaderMenu, headerMenuOpen);

  useEffect(() => {
    setHeaderMenuOpen(false);
  }, [activeId]);

  useEffect(() => {
    if (!listMenuConv) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setListMenuConv(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [listMenuConv]);

  const openChat = useCallback((id) => {
    setActiveVoiceId(null);
    setActiveId(id);
    setMobileShowChat(true);
    setShowInfo(false);
    setListMenuConv(null);
    setShowAddMembers(false);
  }, []);

  const closeListMenu = useCallback(() => setListMenuConv(null), []);
  const onAddMembersFromMenu = useCallback((conv) => {
    if (conv?._id) setActiveId(conv._id);
    setShowAddMembers(true);
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
  const handleVoiceRequestPlay = useCallback((id) => setActiveVoiceId(id), []);
  const handleVoiceStopChain = useCallback(() => setActiveVoiceId(null), []);
  const handleVoiceEnded = useCallback((id) => {
    setActiveVoiceId((prev) => {
      if (prev && prev !== String(id)) return prev;
      return getNextConsecutiveVoiceId(messagesRef.current, id);
    });
  }, [messagesRef]);
  const onClearEditing = useCallback(() => setEditing(null), []);

  const typingLabel = useMemo(
    () => activityNames(typingUsers, active?.participants, myId),
    [typingUsers, active, myId]
  );
  const recordingLabel = useMemo(
    () => activityNames(recordingUsers, active?.participants, myId),
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
        listFilter={listFilter}
        setListFilter={setListFilter}
        conversations={conversations}
        activeId={activeId}
        myId={myId}
        onlineOf={onlineOf}
        openChat={openChat}
        onToggleDark={onToggleDark}
        onNewChat={onNewChat}
        onSearchMessages={onSearchMessages}
        onOpenListMenu={setListMenuConv}
      />

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
          if (activeId) composerRef.current?.addFiles(e.dataTransfer.files);
        }}
      >
        {!active ? (
          <ChatEmptyState />
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
              onAddMembers={onAddMembersFromMenu}
              setConfirmAction={confirm.setConfirmAction}
              setConfirmDeleteChat={confirm.setConfirmDeleteChat}
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
              ref={composerRef}
              theme={theme}
              activeId={activeId}
              active={active}
              myId={myId}
              editing={editing}
              onClearEditing={onClearEditing}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              emit={emit}
              sendPayload={sendPayload}
              uploadFile={uploadFile}
              editMsg={editMsg}
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
          setConfirmAction={confirm.setConfirmAction}
          setConfirmDeleteChat={confirm.setConfirmDeleteChat}
        />
      )}

      <ChatOverlays
        myId={myId}
        meRole={meRole}
        active={active}
        activeId={activeId}
        conversations={conversations}
        menuMsg={menuMsg}
        setMenuMsg={setMenuMsg}
        setReplyTo={setReplyTo}
        setEditing={setEditing}
        starMsg={starMsg}
        setForwardMsg={setForwardMsg}
        delMsg={delMsg}
        forwardMsg={forwardMsg}
        fwdMsg={fwdMsg}
        listMenuConv={listMenuConv}
        closeListMenu={closeListMenu}
        updateConv={updateConv}
        setConfirmDeleteChat={confirm.setConfirmDeleteChat}
        setConfirmAction={confirm.setConfirmAction}
        onAddMembersFromMenu={onAddMembersFromMenu}
        adminDisable={adminDisable}
        adminEnable={adminEnable}
        showNew={showNew}
        setShowNew={setShowNew}
        newMode={newMode}
        setNewMode={setNewMode}
        searchUsers={searchUsers}
        userSearch={userSearch}
        canCreateGroup={canCreateGroup}
        createDirect={createDirect}
        createGroup={createGroup}
        openChat={openChat}
        showAddMembers={showAddMembers}
        setShowAddMembers={setShowAddMembers}
        addMembers={addMembers}
        refetchConvs={refetchConvs}
        confirmDeleteChat={confirm.confirmDeleteChat}
        isDeletingChat={confirm.isDeletingChat}
        handleDeleteChat={confirm.handleDeleteChat}
        confirmAction={confirm.confirmAction}
        confirmModalProps={confirm.confirmModalProps}
        confirmBusy={confirm.confirmBusy}
        handleConfirmAction={confirm.handleConfirmAction}
      />
    </div>
  );
}
