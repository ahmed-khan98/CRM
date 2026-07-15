"use client";

import ProjectCard from "./ProjectCard";

export default function ProjectSection({ title, description, projects, onDelete, onClick }) {
  if (!projects?.length) return null;

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        {description && <p className="text-sm text-zinc-500 mt-0.5">{description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onDelete={onDelete}
            onClick={onClick}
          />
        ))}
      </div>
    </section>
  );
}
