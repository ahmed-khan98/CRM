"use client";

import { memo, useState } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import SectionLabel from "../ui/SectionLabel";
import Avatar from "../ui/Avatar";
import { formatDate } from "../utils";
import { useAddCommentMutation, useDeleteCommentMutation } from "@/app/_Services/task/page";

function CommentItem({ comment, currentUserId, isAdminRole, onDelete }) {
  const isOwn = comment.author?._id?.toString() === currentUserId?.toString();

  return (
    <div className="group flex gap-2.5">
      <Avatar user={comment.author} size={7} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-medium text-zinc-800 capitalize">{comment.author?.fullName || "—"}</span>
          <span className="text-[10px] text-zinc-400">{formatDate(comment.createdAt)}</span>
        </div>
        <div className="rounded-lg rounded-tl-sm border border-zinc-100 bg-zinc-50 px-2.5 py-1.5 text-xs leading-relaxed font-normal text-zinc-700">
          {comment.text}
        </div>
      </div>
      {(isOwn || isAdminRole) && (
        <button type="button" onClick={() => onDelete(comment._id)}
          className="self-start mt-6 text-zinc-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition cursor-pointer">
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function TaskDetailComments({ task, projectId, currentUserId, isAdminRole }) {
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await addComment({ id: task._id, text: commentText.trim(), projectId }).unwrap();
      setCommentText("");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment({ taskId: task._id, commentId, projectId }).unwrap();
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div>
      <SectionLabel icon={MessageSquare} text={`Comments · ${task.comments?.length || 0}`} />

      <div className="flex flex-col gap-3 mb-3">
        {!task.comments?.length && (
          <p className="text-[11px] italic text-zinc-400 py-1">No comments yet. Be the first to review.</p>
        )}
        {task.comments?.map((c) => (
          <CommentItem
            key={c._id}
            comment={c}
            currentUserId={currentUserId}
            isAdminRole={isAdminRole}
            onDelete={handleDeleteComment}
          />
        ))}
      </div>

      <div className="flex items-end gap-2">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
          placeholder="Write a review or comment…"
          rows={2}
          className="flex-1 resize-none rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-normal text-zinc-700 placeholder-zinc-400 outline-none transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200"
        />
        <button type="button" onClick={handleAddComment} disabled={!commentText.trim() || submitting}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-white transition hover:bg-zinc-800 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default memo(TaskDetailComments);
