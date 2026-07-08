"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ListTodo } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "@/app/_Components/PageHeader/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import KanbanBoard from "@/app/dashboard/projects/_components/kanban/KanbanBoard";
import TaskDetailModal from "@/app/dashboard/projects/_components/task-detail/TaskDetailModal";
import TaskModal from "@/app/dashboard/projects/_components/TaskModal";
import TaskSearchBar from "@/app/dashboard/projects/_components/task/TaskSearchBar";
import EmptyState from "@/app/dashboard/projects/_components/ui/EmptyState";
import { groupTasksIntoColumns } from "@/app/dashboard/projects/_components/utils";

import { useKanbanBoard } from "@/app/dashboard/projects/_hooks/useKanbanBoard";
import { useTaskPermissions } from "@/app/dashboard/projects/_hooks/useTaskPermissions";

import {
  useGetAllTasksQuery,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "@/app/_Services/task/page";
import { useAllEmployeesQuery } from "@/app/_Services/employee/page";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";

export default function AllTasksPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [viewingTask, setViewingTask] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: loggedUserData } = useGetLoggedUserQuery();
  const currentUser = loggedUserData?.data;
  const { canMoveToDone } = useTaskPermissions(currentUser);

  const { data: tasksData, isLoading } = useGetAllTasksQuery();
  const tasks = tasksData?.data || [];

  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const { data: employeesData } = useAllEmployeesQuery(undefined, { skip: !taskModalOpen });
  const employees = employeesData?.data || [];

  const serverColumns = useMemo(
    () => groupTasksIntoColumns(tasks, search),
    [tasks, search]
  );

  const onStatusUpdate = useCallback(
    ({ id, status, order, task }) =>
      updateTaskStatus({
        id,
        status,
        order,
        projectId: task?.projectId?._id || task?.projectId,
      }).unwrap(),
    [updateTaskStatus]
  );

  const { columns, handleDragEnd } = useKanbanBoard(serverColumns, { onStatusUpdate, canMoveToDone });

  useEffect(() => {
    if (viewingTask) {
      const fresh = tasks.find((t) => t._id === viewingTask._id);
      if (fresh) setViewingTask(fresh);
    }
  }, [tasks, viewingTask?._id]);

  const handleOpenTask = useCallback((task) => {
    setViewingTask(task);
    setDetailOpen(true);
  }, []);

  const handleProjectNavigate = useCallback((projectId) => {
    if (projectId) router.push(`/dashboard/projects/${projectId}`);
  }, [router]);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setTaskModalOpen(true);
  }, []);

  const handleSaveTask = useCallback(async (form) => {
    const projectId = editingTask?.projectId?._id || editingTask?.projectId;
    try {
      await updateTask({
        id: form.id,
        projectId,
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        assignees: form.assignees,
        dueDate: form.dueDate || null,
        attachment: form.attachment,
      }).unwrap();
      toast.success("Task updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update task");
      throw err;
    }
  }, [updateTask, editingTask]);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteTask({
        id: confirmDelete._id,
        projectId: confirmDelete.projectId?._id || confirmDelete.projectId,
      }).unwrap();
      toast.success("Task deleted");
      setConfirmDelete(null);
      setDetailOpen(false);
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  }, [confirmDelete, deleteTask]);

  const totalTasks = tasks.length;
  const visibleTasks = useMemo(
    () => Object.values(columns).reduce((s, col) => s + col.length, 0),
    [columns]
  );

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-3 p-2">
      <PageHeader name="All Tasks" icon={ListTodo} length={totalTasks} />

      <TaskSearchBar
        search={search}
        onSearchChange={setSearch}
        visibleCount={visibleTasks}
        totalCount={totalTasks}
      />

      {visibleTasks > 0 ? (
        <KanbanBoard
          columns={columns}
          onDragEnd={handleDragEnd}
          onAddTask={null}
          onOpenTask={handleOpenTask}
          showProject
          onProjectClick={handleProjectNavigate}
        />
      ) : (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description={search ? "Try a different search term." : "You have no tasks assigned yet."}
        />
      )}

      <TaskDetailModal
        isOpen={detailOpen}
        onClose={() => { setDetailOpen(false); setViewingTask(null); }}
        task={viewingTask}
        currentUser={currentUser}
        projectId={viewingTask?.projectId?._id || viewingTask?.projectId}
        onEdit={handleEditTask}
        onDelete={setConfirmDelete}
        onProjectClick={handleProjectNavigate}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
        employees={employees}
        defaultStatus={defaultStatus}
        canMoveToDone={editingTask ? canMoveToDone(editingTask) : true}
      />

      {confirmDelete && (
        <WarningModal
          message="task"
          isDeleting={deleting}
          setConfirmDelete={setConfirmDelete}
          handleDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}
