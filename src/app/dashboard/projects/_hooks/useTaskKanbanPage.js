"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * Keeps viewingTask in sync when the server task list refreshes
 * (e.g. after comments/attachments/status updates).
 */
export function useSyncedViewingTask(taskList, viewingTask, setViewingTask) {
  useEffect(() => {
    if (!viewingTask?._id || !taskList?.length) return;
    const fresh = taskList.find((t) => t._id === viewingTask._id);
    if (fresh) setViewingTask(fresh);
    // Only re-sync when the list identity or viewed id changes — not on every viewingTask object swap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskList, viewingTask?._id]);
}

/**
 * Shared delete-confirm flow for task kanban pages.
 * @param {{ deleteTask: Function, resolveProjectId: (task) => string, onDeleted?: () => void }} opts
 */
export function useTaskDeleteFlow({ deleteTask, resolveProjectId, onDeleted }) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteTask({
        id: confirmDelete._id,
        projectId: resolveProjectId(confirmDelete),
      }).unwrap();
      toast.success("Task deleted");
      setConfirmDelete(null);
      onDeleted?.();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  }, [confirmDelete, deleteTask, resolveProjectId, onDeleted]);

  return { confirmDelete, setConfirmDelete, deleting, handleConfirmDelete };
}

/**
 * Debounce a primitive value (e.g. search string).
 */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
