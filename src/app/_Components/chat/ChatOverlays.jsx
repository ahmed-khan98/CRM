"use client";

import { memo } from "react";
import toast from "react-hot-toast";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import AddMembersModal from "@/app/_Components/chat/AddMembersModal";
import NewChatModal from "@/app/_Components/chat/NewChatModal";
import MessageContextMenu from "@/app/_Components/chat/MessageContextMenu";
import ForwardModal from "@/app/_Components/chat/ForwardModal";
import MobileChatOptionsSheet from "@/app/_Components/chat/overlays/MobileChatOptionsSheet";

function ChatOverlays({
  myId,
  meRole,
  active,
  activeId,
  conversations,
  menuMsg,
  setMenuMsg,
  setReplyTo,
  setEditing,
  starMsg,
  setForwardMsg,
  delMsg,
  forwardMsg,
  fwdMsg,
  listMenuConv,
  closeListMenu,
  updateConv,
  setConfirmDeleteChat,
  setConfirmAction,
  onAddMembersFromMenu,
  adminDisable,
  adminEnable,
  showNew,
  setShowNew,
  newMode,
  setNewMode,
  searchUsers,
  userSearch,
  canCreateGroup,
  createDirect,
  createGroup,
  openChat,
  showAddMembers,
  setShowAddMembers,
  addMembers,
  refetchConvs,
  confirmDeleteChat,
  isDeletingChat,
  handleDeleteChat,
  confirmAction,
  confirmModalProps,
  confirmBusy,
  handleConfirmAction,
}) {
  return (
    <>
      {menuMsg && (
        <MessageContextMenu
          message={menuMsg}
          myId={myId}
          onClose={() => setMenuMsg(null)}
          onReply={setReplyTo}
          onStar={starMsg}
          onForward={setForwardMsg}
          onEdit={(msg) => setEditing(msg)}
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

      <MobileChatOptionsSheet
        conv={listMenuConv}
        myId={myId}
        meRole={meRole}
        onClose={closeListMenu}
        updateConv={updateConv}
        setConfirmDeleteChat={setConfirmDeleteChat}
        setConfirmAction={setConfirmAction}
        onAddMembers={onAddMembersFromMenu}
        adminDisable={adminDisable}
        adminEnable={adminEnable}
      />

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
    </>
  );
}

export default memo(ChatOverlays);
