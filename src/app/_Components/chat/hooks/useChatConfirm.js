"use client";

import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function useChatConfirm({
  activeId,
  myId,
  removeMember,
  deleteGroup,
  deleteChatForMe,
  refetchConvs,
  onChatClosed,
  onLeftGroup,
}) {
  const [confirmDeleteChat, setConfirmDeleteChat] = useState(null);
  const [isDeletingChat, setIsDeletingChat] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const handleDeleteChat = useCallback(async () => {
    if (!confirmDeleteChat) return;
    setIsDeletingChat(true);
    try {
      await deleteChatForMe(confirmDeleteChat).unwrap();
      setConfirmDeleteChat(null);
      onChatClosed?.();
      toast.success("Chat deleted");
      refetchConvs();
    } catch (e) {
      toast.error(e?.data?.message || "Could not delete chat");
    } finally {
      setIsDeletingChat(false);
    }
  }, [confirmDeleteChat, deleteChatForMe, refetchConvs, onChatClosed]);

  const handleConfirmAction = useCallback(async () => {
    if (!confirmAction) return;
    setConfirmBusy(true);
    try {
      if (confirmAction.type === "leaveGroup") {
        await removeMember({
          id: confirmAction.conversationId || activeId,
          userId: myId,
        }).unwrap();
        onLeftGroup?.();
        toast.success("Left group");
        refetchConvs();
      } else if (confirmAction.type === "deleteGroup") {
        const id = confirmAction.conversationId || activeId;
        await deleteGroup(id).unwrap();
        onLeftGroup?.();
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
    onChatClosed,
    onLeftGroup,
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

  return {
    confirmDeleteChat,
    setConfirmDeleteChat,
    isDeletingChat,
    handleDeleteChat,
    confirmAction,
    setConfirmAction,
    confirmBusy,
    handleConfirmAction,
    confirmModalProps,
  };
}
