"use client";

import { useCallback, useMemo, useState } from "react";
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
  useDebouncedValue,
  useSyncedViewingTask,
  useTaskDeleteFlow,
} from "@/app/dashboard/projects/_hooks/useTaskKanbanPage";

import {
  useGetAllTasksQuery,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "@/app/_Services/task/page";
import { useGetAssigneesQuery } from "@/app/_Services/employee/page";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";

const resolveTaskProjectId = (task) => task?.projectId?._id || task?.projectId;

export default function AllTasksPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [viewingTask, setViewingTask] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");

  const { data: loggedUserData } = useGetLoggedUserQuery();
  const currentUser = loggedUserData?.data;
  const { canMoveToDone, canMoveFromDone, canEditTask, canDeleteTask } = useTaskPermissions(currentUser);

  const { data: tasksData, isLoading } = useGetAllTasksQuery();
  const tasks = tasksData?.data || [];

  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const { data: employeesData } = useGetAssigneesQuery(undefined, { skip: !taskModalOpen });
  const employees = employeesData?.data || [];

  const serverColumns = useMemo(
    () => groupTasksIntoColumns(tasks, debouncedSearch),
    [tasks, debouncedSearch]
  );

  const onStatusUpdate = useCallback(
    ({ id, status, order, task }) =>
      updateTaskStatus({
        id,
        status,
        order,
        projectId: resolveTaskProjectId(task),
      }).unwrap(),
    [updateTaskStatus]
  );

  const { columns, handleDragEnd } = useKanbanBoard(serverColumns, {
    onStatusUpdate,
    canMoveToDone,
    canMoveFromDone,
  });

  useSyncedViewingTask(tasks, viewingTask, setViewingTask);

  const onTaskDeleted = useCallback(() => setDetailOpen(false), []);
  const {
    confirmDelete,
    setConfirmDelete,
    deleting,
    handleConfirmDelete,
  } = useTaskDeleteFlow({
    deleteTask,
    resolveProjectId: resolveTaskProjectId,
    onDeleted: onTaskDeleted,
  });

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

  const handleProjectNavigate = useCallback((projectId) => {
    if (projectId) router.push(`/dashboard/projects/${projectId}`);
  }, [router]);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setTaskModalOpen(true);
  }, []);

  const handleSaveTask = useCallback(async (form) => {
    const projectId = resolveTaskProjectId(editingTask);
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

  const totalTasks = tasks.length;
  const visibleTasks = useMemo(
    () => Object.values(columns).reduce((s, col) => s + col.length, 0),
    [columns]
  );

  const detailCanEdit = viewingTask ? canEditTask(viewingTask) : false;

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-3 p-2 min-w-0 max-w-full overflow-x-hidden">
      <PageHeader name="All Tasks" icon={ListTodo} length={totalTasks}>
        <TaskSearchBar
          embedded
          search={search}
          onSearchChange={setSearch}
          visibleCount={visibleTasks}
          totalCount={totalTasks}
        />
      </PageHeader>

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
          description={debouncedSearch ? "Try a different search term." : "You have no tasks assigned yet."}
        />
      )}

      <TaskDetailModal
        isOpen={detailOpen}
        onClose={handleCloseDetail}
        task={viewingTask}
        currentUser={currentUser}
        projectId={resolveTaskProjectId(viewingTask)}
        onEdit={handleEditTask}
        onDelete={setConfirmDelete}
        onProjectClick={handleProjectNavigate}
        canEdit={detailCanEdit}
        canDelete={viewingTask ? canDeleteTask(viewingTask) : false}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={handleCloseTaskModal}
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
