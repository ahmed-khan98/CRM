"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { useProjectPermissions } from "../_hooks/useProjectPermissions";
import {
  useSyncedViewingTask,
  useTaskDeleteFlow,
} from "../_hooks/useTaskKanbanPage";

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
import { useGetAssigneesQuery } from "@/app/_Services/employee/page";
import { useAllClientsQuery } from "@/app/_Services/Client/page";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";

export default function ProjectKanbanPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskFromQuery = searchParams.get("task");

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");

  const { data: loggedUserData } = useGetLoggedUserQuery();
  const currentUser = loggedUserData?.data;
  const { canMoveToDone, canMoveFromDone, canEditTask, canDeleteTask } = useTaskPermissions(currentUser);
  const { canManageProject } = useProjectPermissions(currentUser);

  const { data: projectData, isLoading: projectLoading } = useGetProjectByIdQuery(id, { skip: !id });
  const project = projectData?.data;

  const { data: tasksData, isLoading: tasksLoading } = useGetTasksByProjectQuery(id, { skip: !id });
  const { data: employeesData } = useGetAssigneesQuery(undefined, { skip: !taskModalOpen });
  const employees = employeesData?.data || [];
  const { data: clientsData } = useAllClientsQuery(undefined, { skip: !editProjectOpen });
  const clients = clientsData?.data || [];

  const [updateProject] = useUpdateProjectMutation();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const serverColumns = tasksData?.data?.columns || EMPTY_KANBAN_COLUMNS;
  const taskList = tasksData?.data?.tasks;

  const onStatusUpdate = useCallback(
    ({ id: taskId, status, order }) =>
      updateTaskStatus({ id: taskId, projectId: id, status, order }).unwrap(),
    [updateTaskStatus, id]
  );

  const { columns, handleDragEnd } = useKanbanBoard(serverColumns, {
    onStatusUpdate,
    canMoveToDone,
    canMoveFromDone,
  });

  useSyncedViewingTask(taskList, viewingTask, setViewingTask);

  // Open specific task when landing from a notification (?task=id)
  useEffect(() => {
    if (!taskFromQuery || tasksLoading || !taskList?.length) return;

    const match = taskList.find(
      (t) => String(t._id) === String(taskFromQuery)
    );
    if (!match) return;

    setViewingTask(match);
    setDetailModalOpen(true);
    router.replace(`/dashboard/projects/${id}`, { scroll: false });
  }, [taskFromQuery, taskList, tasksLoading, id, router]);

  const resolveProjectId = useCallback(() => id, [id]);
  const onTaskDeleted = useCallback(() => setDetailModalOpen(false), []);
  const {
    confirmDelete: confirmDeleteTask,
    setConfirmDelete: setConfirmDeleteTask,
    deleting: deletingTask,
    handleConfirmDelete: handleConfirmDeleteTask,
  } = useTaskDeleteFlow({
    deleteTask,
    resolveProjectId,
    onDeleted: onTaskDeleted,
  });

  const { totalTasks, doneTasks, progress } = useMemo(() => {
    const total = taskList?.length || 0;
    const done = columns?.done?.length || 0;
    return { totalTasks: total, doneTasks: done, progress: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [taskList?.length, columns?.done?.length]);

  const handleAddTask = useCallback((statusId) => {
    setEditingTask(null);
    setDefaultStatus(statusId);
    setTaskModalOpen(true);
  }, []);

  const handleOpenTask = useCallback((task) => {
    setViewingTask(task);
    setDetailModalOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailModalOpen(false);
    setViewingTask(null);
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    setTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleEditFromDetail = useCallback((task) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setTaskModalOpen(true);
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

  const handleBack = useCallback(() => router.push("/dashboard/projects"), [router]);
  const handleOpenEditProject = useCallback(() => setEditProjectOpen(true), []);
  const handleCloseEditProject = useCallback(() => setEditProjectOpen(false), []);
  const handleHeaderAddTask = useCallback(() => handleAddTask("todo"), [handleAddTask]);

  const detailCanEdit = viewingTask ? canEditTask(viewingTask) : false;
  const canManageThisProject = canManageProject(project);

  if (projectLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-5 p-2 min-w-0 max-w-full overflow-x-hidden">
      <ProjectKanbanHeader
        project={project}
        progress={progress}
        totalTasks={totalTasks}
        doneTasks={doneTasks}
        canManageProject={canManageThisProject}
        onBack={handleBack}
        onEdit={handleOpenEditProject}
        onAddTask={handleHeaderAddTask}
        onStatusChange={canManageThisProject ? handleProjectStatusChange : undefined}
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
        onClose={handleCloseTaskModal}
        onSave={handleSaveTask}
        task={editingTask}
        employees={employees}
        defaultStatus={defaultStatus}
        canMoveToDone={editingTask ? canMoveToDone(editingTask) : true}
      />

      <TaskDetailModal
        isOpen={detailModalOpen}
        onClose={handleCloseDetail}
        task={viewingTask}
        currentUser={currentUser}
        projectId={id}
        project={project}
        onEdit={handleEditFromDetail}
        onDelete={setConfirmDeleteTask}
        canEdit={detailCanEdit}
        canDelete={viewingTask ? canDeleteTask(viewingTask) : false}
      />

      <ProjectModal
        isOpen={editProjectOpen}
        onClose={handleCloseEditProject}
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
