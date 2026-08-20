"use client";

import { memo, useCallback, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import toast from "react-hot-toast";
import TaskRichTextEditor from "../ui/TaskRichTextEditor";
import SectionLabel from "../ui/SectionLabel";
import { getPlainTextFromHtml } from "../utils";
import { useAddCommentMutation, useDeleteCommentMutation } from "@/app/_Services/task/page";
import CommentItem from "./CommentItem";

function TaskDetailComments({ task, projectId, currentUserId, isAdminRole }) {
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleAddComment = useCallback(async () => {
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
  }, [commentText, addComment, task._id, projectId]);

  const handleDeleteComment = useCallback(
    async (commentId) => {
      try {
        await deleteComment({ taskId: task._id, commentId, projectId }).unwrap();
      } catch {
        toast.error("Failed to delete comment");
      }
    },
    [deleteComment, task._id, projectId]
  );

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
