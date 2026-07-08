"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import PageLoader from "@/app/_Components/Loaders/PageLoader";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import KanbanBoard from "../_components/kanban/KanbanBoard";
import TaskModal from "../_components/TaskModal";
import TaskDetailModal from "../_components/task-detail/TaskDetailModal";
import ProjectModal from "../_components/ProjectModal";
import ProjectKanbanHeader from "../_components/project/ProjectKanbanHeader";
import { EMPTY_KANBAN_COLUMNS } from "../_components/constants";

import { useKanbanBoard } from "../_hooks/useKanbanBoard";
import { useTaskPermissions } from "../_hooks/useTaskPermissions";

import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/app/_Services/project/page";
import {
  useGetTasksByProjectQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "@/app/_Services/task/page";
import { useAllEmployeesQuery } from "@/app/_Services/employee/page";
import { useAllClientsQuery } from "@/app/_Services/Client/page";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";

export default function ProjectKanbanPage() {
  const { id } = useParams();
  const router = useRouter();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);

  const { data: loggedUserData } = useGetLoggedUserQuery();
  const currentUser = loggedUserData?.data;
  const { isAdminRole, canMoveToDone } = useTaskPermissions(currentUser);

  const { data: projectData, isLoading: projectLoading } = useGetProjectByIdQuery(id, { skip: !id });
  const project = projectData?.data;

  const { data: tasksData, isLoading: tasksLoading } = useGetTasksByProjectQuery(id, { skip: !id });
  const { data: employeesData } = useAllEmployeesQuery();
  const employees = employeesData?.data || [];
  const { data: clientsData } = useAllClientsQuery();
  const clients = clientsData?.data || [];

  const [updateProject] = useUpdateProjectMutation();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const serverColumns = tasksData?.data?.columns || EMPTY_KANBAN_COLUMNS;

  const onStatusUpdate = useCallback(
    ({ id: taskId, status, order }) =>
      updateTaskStatus({ id: taskId, projectId: id, status, order }).unwrap(),
    [updateTaskStatus, id]
  );

  const { columns, handleDragEnd } = useKanbanBoard(serverColumns, { onStatusUpdate, canMoveToDone });

  useEffect(() => {
    if (viewingTask && tasksData?.data?.tasks) {
      const fresh = tasksData.data.tasks.find((t) => t._id === viewingTask._id);
      if (fresh) setViewingTask(fresh);
    }
  }, [tasksData, viewingTask?._id]);

  const { totalTasks, doneTasks, progress } = useMemo(() => {
    const total = tasksData?.data?.tasks?.length || 0;
    const done = columns?.done?.length || 0;
    return { totalTasks: total, doneTasks: done, progress: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [tasksData, columns?.done?.length]);

  const handleAddTask = useCallback((statusId) => {
    setEditingTask(null);
    setDefaultStatus(statusId);
    setTaskModalOpen(true);
  }, []);

  const handleOpenTask = useCallback((task) => {
    setViewingTask(task);
    setDetailModalOpen(true);
  }, []);

  const handleSaveTask = useCallback(async (form) => {
    try {
      if (form.id) {
        await updateTask({
          id: form.id, projectId: id, title: form.title, description: form.description,
          priority: form.priority, status: form.status, assignees: form.assignees,
          dueDate: form.dueDate || null, attachment: form.attachment,
        }).unwrap();
        toast.success("Task updated");
      } else {
        await createTask({
          projectId: id, title: form.title, description: form.description,
          priority: form.priority, status: form.status, assignees: form.assignees,
          dueDate: form.dueDate || null, attachment: form.attachment,
        }).unwrap();
        toast.success("Task created");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
      throw err;
    }
  }, [createTask, updateTask, id]);

  const handleConfirmDeleteTask = useCallback(async () => {
    if (!confirmDeleteTask) return;
    setDeletingTask(true);
    try {
      await deleteTask({ id: confirmDeleteTask._id, projectId: id }).unwrap();
      toast.success("Task deleted");
      setConfirmDeleteTask(null);
      setDetailModalOpen(false);
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeletingTask(false);
    }
  }, [confirmDeleteTask, deleteTask, id]);

  const handleSaveProject = useCallback(async (form) => {
    try {
      await updateProject({
        id, name: form.name, description: form.description, status: form.status,
        ...(form.clientId && { clientId: form.clientId }),
      }).unwrap();
      toast.success("Project updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update project");
      throw err;
    }
  }, [updateProject, id]);

  const handleProjectStatusChange = useCallback(async (status) => {
    if (!status || status === project?.status) return;
    try {
      await updateProject({ id, status }).unwrap();
      toast.success("Project status updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update project status");
    }
  }, [updateProject, id, project?.status]);

  if (projectLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-5 p-2">
      <ProjectKanbanHeader
        project={project}
        progress={progress}
        totalTasks={totalTasks}
        doneTasks={doneTasks}
        isAdminRole={isAdminRole}
        onBack={() => router.push("/dashboard/projects")}
        onEdit={() => setEditProjectOpen(true)}
        onAddTask={() => handleAddTask("todo")}
        onStatusChange={isAdminRole ? handleProjectStatusChange : undefined}
      />

      {tasksLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800" />
        </div>
      ) : (
        <KanbanBoard
          columns={columns}
          onDragEnd={handleDragEnd}
          onAddTask={handleAddTask}
          onOpenTask={handleOpenTask}
        />
      )}

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
        employees={employees}
        defaultStatus={defaultStatus}
        canMoveToDone={editingTask ? canMoveToDone(editingTask) : true}
      />

      <TaskDetailModal
        isOpen={detailModalOpen}
        onClose={() => { setDetailModalOpen(false); setViewingTask(null); }}
        task={viewingTask}
        currentUser={currentUser}
        projectId={id}
        project={project}
        onEdit={(task) => { setEditingTask(task); setDefaultStatus(task.status); setTaskModalOpen(true); }}
        onDelete={setConfirmDeleteTask}
      />

      <ProjectModal
        isOpen={editProjectOpen}
        onClose={() => setEditProjectOpen(false)}
        onSave={handleSaveProject}
        clients={clients}
        project={project}
      />

      {confirmDeleteTask && (
        <WarningModal
          message="task"
          isDeleting={deletingTask}
          setConfirmDelete={setConfirmDeleteTask}
          handleDelete={handleConfirmDeleteTask}
        />
      )}
    </div>
  );
}
