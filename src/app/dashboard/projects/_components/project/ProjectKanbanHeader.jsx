"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import Select from "react-select";
import { ArrowLeft, Building2, Pencil, Plus, User2 } from "lucide-react";
import { PROJECT_STATUS_CONFIG, PROJECT_STATUS_OPTIONS, selectStyles } from "../constants";
import { getClientDisplayName, getProjectDepartmentName, hasProjectClient } from "../utils";
import ProgressBar from "../ui/ProgressBar";

function ProjectKanbanHeader({
  project,
  progress,
  totalTasks,
  doneTasks = 0,
  canManageProject = false,
  onBack,
  onEdit,
  onAddTask,
  onStatusChange,
}) {
  const statusCfg = PROJECT_STATUS_CONFIG[project?.status] || PROJECT_STATUS_CONFIG.active;
  const hasClient = hasProjectClient(project);
  const clientName = getClientDisplayName(project?.clientId);
  const deptName = getProjectDepartmentName(project);
  const creatorName = project?.createdBy?.fullName;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
      </button>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {canManageProject && onStatusChange ? (
                <div className="w-[130px]">
                  <Select
                    options={PROJECT_STATUS_OPTIONS}
                    value={PROJECT_STATUS_OPTIONS.find((s) => s.value === (project?.status || "active"))}
                    onChange={(opt) => opt?.value && onStatusChange(opt.value)}
                    styles={{
                      ...selectStyles,
                      control: (base, state) => ({
                        ...selectStyles.control(base, state),
                        minHeight: "1.75rem",
                        borderRadius: "9999px",
                        fontSize: "10px",
                        fontWeight: 600,
                      }),
                      valueContainer: (base) => ({ ...base, padding: "0 8px" }),
                      indicatorsContainer: (base) => ({ ...base, height: "1.75rem" }),
                      dropdownIndicator: (base) => ({ ...base, padding: "0 6px" }),
                    }}
                    isSearchable={false}
                    classNamePrefix="project-status"
                  />
                </div>
              ) : (
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statusCfg.style}`}>
                  {statusCfg.label}
                </span>
              )}
              {deptName && (
                <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-zinc-50 px-2.5 py-0.5 text-[10px] font-medium text-zinc-500">
                  <Building2 className="h-2.5 w-2.5" />
                  {deptName}
                </span>
              )}
            </div>

            <h1 className="text-lg font-bold text-zinc-900 leading-snug mb-1">{project?.name}</h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 mb-2">
              {hasClient ? (
                <span className="flex items-center gap-1">
                  <User2 className="h-3 w-3" />
                  {clientName}
                </span>
              ) : deptName ? (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {deptName}
                </span>
              ) : creatorName ? (
                <span className="flex items-center gap-1">
                  <User2 className="h-3 w-3" />
                  {creatorName}
                </span>
              ) : null}
              {totalTasks > 0 && (
                <span className="text-zinc-400">
                  {totalTasks} task{totalTasks !== 1 ? "s" : ""} · {doneTasks} completed
                </span>
              )}
            </div>

            {project?.description ? (
              <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{project.description}</p>
            ) : (
              <p className="text-xs italic text-zinc-400">No project description</p>
            )}

            {totalTasks > 0 && (
              <div className="mt-3 sm:hidden">
                <ProgressBar percent={progress} className="w-full" label={`${doneTasks}/${totalTasks} done`} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 sm:flex-col sm:items-end">
            {totalTasks > 0 && (
              <div className="hidden sm:block min-w-[140px]">
                <ProgressBar percent={progress} className="w-full" label={`${doneTasks}/${totalTasks} done`} />
              </div>
            )}
            <div className="flex items-center gap-2">
              {canManageProject && (
                <button
                  type="button"
                  title="Edit project"
                  onClick={onEdit}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 transition cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onAddTask}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-zinc-900 px-4 text-xs font-semibold text-white hover:bg-zinc-800 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> New Task
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProjectKanbanHeader);
