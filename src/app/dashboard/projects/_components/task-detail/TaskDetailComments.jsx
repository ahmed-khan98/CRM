"use client";

import { memo, useState } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import TaskRichTextEditor from "../ui/TaskRichTextEditor";
import SectionLabel from "../ui/SectionLabel";
import Avatar from "../ui/Avatar";
import RichTextContent from "../ui/RichTextContent";
import { formatDate, getPlainTextFromHtml } from "../utils";
import { useAddCommentMutation, useDeleteCommentMutation } from "@/app/_Services/task/page";

function CommentItem({ comment, currentUserId, isAdminRole, onDelete }) {
  const isOwn = comment.author?._id?.toString() === currentUserId?.toString();

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
        <button type="button" onClick={() => onDelete(comment._id)}
          className="self-start mt-6 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition cursor-pointer">
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
    if (!getPlainTextFromHtml(commentText)) return;
    setSubmitting(true);
    try {
      await addComment({ id: task._id, text: commentText, projectId }).unwrap();
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
          <p className="text-[11px] italic text-zinc-500 py-1">No comments yet. Be the first to review.</p>
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

      <div className="flex flex-col gap-2">
        <div className="rounded-xl border border-white/[0.1] bg-[#161b22] overflow-hidden [&_.ProseMirror]:text-zinc-200 [&_button]:text-zinc-400 [&_button:hover]:bg-white/10 [&_button:hover]:text-zinc-100 [&_button.bg-zinc-900]:bg-white/15 [&_button.bg-zinc-900]:text-white">
          <TaskRichTextEditor
            compact
            value={commentText}
            onChange={setCommentText}
            placeholder="Write a review or comment..."
            minHeight={90}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddComment}
            disabled={!getPlainTextFromHtml(commentText) || submitting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-950 transition hover:bg-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Posting..." : "Post comment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(TaskDetailComments);
