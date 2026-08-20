"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useKanbanBoard } from "./useKanbanBoard";

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

/**
 * Shared orchestration for the two task-kanban pages (`tasks/page.jsx` and
 * `projects/[id]/page.jsx`) — modal open/close state, the currently
 * viewed/edited task, the kanban drag-and-drop board, and the delete-confirm
 * flow. Each page still owns its own data fetching and `onStatusUpdate` /
 * `resolveProjectId` (their shapes differ — project-scoped vs. global task
 * list), everything else was near-identical copy/paste between the two.
 */
export function useTaskBoardPage({
  taskList,
  serverColumns,
  onStatusUpdate,
  canMoveToDone,
  canMoveFromDone,
  deleteTask,
  resolveProjectId,
}) {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");

  useSyncedViewingTask(taskList, viewingTask, setViewingTask);

  const { columns, handleDragEnd } = useKanbanBoard(serverColumns, {
    onStatusUpdate,
    canMoveToDone,
    canMoveFromDone,
  });

  const onTaskDeleted = useCallback(() => setDetailOpen(false), []);
  const {
    confirmDelete,
    setConfirmDelete,
    deleting,
    handleConfirmDelete,
  } = useTaskDeleteFlow({ deleteTask, resolveProjectId, onDeleted: onTaskDeleted });

  const handleOpenTask = useCallback((task) => {
    setViewingTask(task);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailOpen(false);
    setViewingTask(null);
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    setTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setTaskModalOpen(true);
  }, []);

  const handleAddTask = useCallback((statusId) => {
    setEditingTask(null);
    setDefaultStatus(statusId || "todo");
    setTaskModalOpen(true);
  }, []);

  return {
    columns,
    handleDragEnd,
    taskModalOpen,
    setTaskModalOpen,
    detailOpen,
    setDetailOpen,
    editingTask,
    setEditingTask,
    viewingTask,
    setViewingTask,
    defaultStatus,
    setDefaultStatus,
    handleOpenTask,
    handleCloseDetail,
    handleCloseTaskModal,
    handleEditTask,
    handleAddTask,
    confirmDelete,
    setConfirmDelete,
    deleting,
    handleConfirmDelete,
  };
}
