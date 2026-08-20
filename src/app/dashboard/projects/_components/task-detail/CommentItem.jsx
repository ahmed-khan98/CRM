"use client";

import { memo, useCallback } from "react";
import { Trash2 } from "lucide-react";
import Avatar from "../ui/Avatar";
import RichTextContent from "../ui/RichTextContent";
import { formatDate } from "../utils";

function CommentItem({ comment, currentUserId, isAdminRole, onDelete }) {
  const isOwn = comment.author?._id?.toString() === currentUserId?.toString();
  const handleDelete = useCallback(() => onDelete(comment._id), [onDelete, comment._id]);

  return (
    <div className="group flex gap-2.5">
      <Avatar user={comment.author} size={7} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-medium text-zinc-200 capitalize">{comment.author?.fullName || "—"}</span>
          <span className="text-[10px] text-zinc-500">{formatDate(comment.createdAt)}</span>
        </div>
        <div className="rounded-lg rounded-tl-sm border border-white/[0.08] bg-[#161b22] px-2.5 py-1.5 text-zinc-300 [&_p]:text-zinc-300">
          <RichTextContent html={comment.text} />
        </div>
      </div>
      {(isOwn || isAdminRole) && (
        <button type="button" onClick={handleDelete}
          className="self-start mt-6 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition cursor-pointer">
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export default memo(CommentItem);
