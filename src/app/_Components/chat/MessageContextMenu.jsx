"use client";

import { memo } from "react";
import {
  Star,
  Reply,
  Forward,
  Copy,
  Trash2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

function MessageContextMenu({
  message,
  myId,
  onClose,
  onReply,
  onStar,
  onForward,
  onEdit,
  onDelete,
}) {
  if (!message) return null;

  const isMine =
    (message.senderId?._id || message.senderId)?.toString() ===
    myId?.toString();

  const items = [
    {
      icon: Reply,
      label: "Reply",
      fn: () => {
        onReply(message);
        onClose();
      },
    },
    {
      icon: Copy,
      label: "Copy",
      fn: () => {
        navigator.clipboard?.writeText(message.body || "");
        toast.success("Copied");
        onClose();
      },
    },
    {
      icon: Star,
      label: "Star",
      fn: async () => {
        await onStar(message._id);
        onClose();
      },
    },
    {
      icon: Forward,
      label: "Forward",
      fn: () => {
        onForward(message);
        onClose();
      },
    },
    ...(isMine
      ? [
          {
            icon: FileText,
            label: "Edit",
            fn: () => {
              onEdit(message);
              onClose();
            },
          },
        ]
      : []),
    {
      icon: Trash2,
      label: "Delete for me",
      fn: async () => {
        await onDelete({ messageId: message._id, forEveryone: false });
        onClose();
      },
    },
    {
      icon: Trash2,
      label: "Delete for everyone",
      fn: async () => {
        await onDelete({ messageId: message._id, forEveryone: true });
        onClose();
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white p-2 text-zinc-800 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-zinc-50"
            onClick={item.fn}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(MessageContextMenu);
