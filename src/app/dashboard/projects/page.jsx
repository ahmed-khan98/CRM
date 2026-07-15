"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "@/app/_Components/PageHeader/page";
import PageLoader from "@/app/_Components/Loaders/PageLoader";
import WarningModal from "@/app/_Components/Modal/WarningModal";
import ProjectModal from "./_components/ProjectModal";
import ProjectSection from "./_components/project/ProjectSection";
import ProjectCard from "./_components/project/ProjectCard";
import ProjectsEmptyState from "./_components/project/ProjectsEmptyState";

import {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} from "@/app/_Services/project/page";
import { useAllClientsQuery } from "@/app/_Services/Client/page";
import { useGetLoggedUserQuery } from "@/app/_Services/authentication/page";

export default function ProjectsPage() {
  const router = useRouter();
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data: projectsData, isLoading } = useGetAllProjectsQuery();
  const { data: loggedUserData } = useGetLoggedUserQuery();
  const currentUser = loggedUserData?.data;

  const isGrouped = projectsData?.data?.grouped === true;
  const departmentProjects = isGrouped ? projectsData.data.departmentProjects || [] : [];
  const assignedProjects = isGrouped ? projectsData.data.assignedProjects || [] : [];
  const projects = isGrouped ? [] : projectsData?.data || [];

  const deptName =
    currentUser?.departmentId?.name ||
    (typeof currentUser?.departmentId === "object" ? currentUser?.departmentId?.name : null) ||
    "Department";

  const totalCount = useMemo(
    () =>
      isGrouped
        ? departmentProjects.length + assignedProjects.length
        : projects.length,
    [isGrouped, departmentProjects.length, assignedProjects.length, projects.length],
  );

  const { data: clientsData } = useAllClientsQuery(undefined, { skip: !projectModalOpen });
  const clients = clientsData?.data || [];

  const [createProject] = useCreateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const handleSaveProject = useCallback(
    async (form) => {
      try {
        await createProject({
          name: form.name,
          description: form.description,
          status: form.status,
          ...(form.clientId && { clientId: form.clientId }),
        }).unwrap();
        toast.success("Project created");
      } catch (err) {
        const msg = err?.data?.message || "Failed to create project";
        toast.error(msg);
        throw new Error(msg);
      }
    },
    [createProject],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDelete) return;
    try {
      await deleteProject(confirmDelete._id).unwrap();
      toast.success("Project deleted");
      setConfirmDelete(null);
    } catch (err) {
      const msg = err?.data?.message || "Failed to delete project";
      toast.error(msg);
      throw new Error(msg);
    }
  }, [confirmDelete, deleteProject]);

  const handleNavigate = useCallback(
    (projectId) => router.push(`/dashboard/projects/${projectId}`),
    [router],
  );

  if (isLoading) return <PageLoader />;

  const hasProjects = isGrouped
    ? departmentProjects.length > 0 || assignedProjects.length > 0
    : projects.length > 0;

  return (
    <div className="flex flex-col gap-5 p-2">
      <PageHeader
        name="Projects"
        icon={FolderKanban}
        length={totalCount}
        btnName="New Project"
        handleEdit={() => setProjectModalOpen(true)}
      />

      {hasProjects ? (
        isGrouped ? (
          <div className="flex flex-col gap-8">
            <ProjectSection
              title={`${deptName} Projects`}
              description="Projects created by your department team. You can create tasks on these."
              projects={departmentProjects}
              onDelete={setConfirmDelete}
              onClick={handleNavigate}
            />
            <ProjectSection
              title="Other Department Projects"
              description="Projects from other departments where you have assigned tasks."
              projects={assignedProjects}
              onDelete={setConfirmDelete}
              onClick={handleNavigate}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={setConfirmDelete}
                onClick={handleNavigate}
              />
            ))}
          </div>
        )
      ) : (
        <ProjectsEmptyState onCreate={() => setProjectModalOpen(true)} />
      )}

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSave={handleSaveProject}
        clients={clients}
      />

      {confirmDelete && (
        <WarningModal
          message="project"
          isDeleting={isDeleting}
          setConfirmDelete={setConfirmDelete}
          handleDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}
