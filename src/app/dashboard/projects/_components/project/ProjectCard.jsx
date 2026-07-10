"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Trash2, User2 } from "lucide-react";
import { PROJECT_STATUS_CONFIG, PROJECT_STATUS_COUNTS } from "../constants";
import { getClientDisplayName } from "../utils";
import ProgressBar from "../ui/ProgressBar";

function ProjectCard({ project, onDelete, onClick }) {
  const counts = project.taskCounts || {};
  const statusCfg = PROJECT_STATUS_CONFIG[project.status] || PROJECT_STATUS_CONFIG.active;

  const { total, done, pct } = useMemo(() => {
    const t = counts.total || 0;
    const d = counts.done || 0;
    return { total: t, done: d, pct: t > 0 ? Math.round((d / t) * 100) : 0 };
  }, [counts.total, counts.done]);

  const clientName = getClientDisplayName(project.clientId);
  const deptName = project.clientId?.departmentId?.name;

  const handleCardClick = () => onClick?.(project._id);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={handleCardClick}
      className="group cursor-pointer rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusCfg.style}`}>
              {statusCfg.label}
            </span>
            {deptName && (
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-100 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                <Building2 className="h-2.5 w-2.5" />
                {deptName}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-zinc-900 leading-snug line-clamp-2 mb-1">
            {project.name}
          </h3>

          <p className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
            <User2 className="h-3 w-3 shrink-0" />
            <span className="truncate">{clientName}</span>
          </p>

          {/* {project.description ? (
            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{project.description}</p>
          ) : (
            <p className="text-xs italic text-zinc-400">No description</p>
          )} */}
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            type="button"
            title="Delete project"
            onClick={(e) => { e.stopPropagation(); onDelete(project); }}
            className="opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-50 pt-3 flex flex-col gap-3">
        {total > 0 ? (
          <>
            <div className="flex flex-wrap gap-1.5">
              {PROJECT_STATUS_COUNTS.map(({ key, label, color, bg }) =>
                counts[key] > 0 ? (
                  <span key={key} className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${bg} ${color}`}>
                    {counts[key]} {label}
                  </span>
                ) : null
              )}
            </div>
            <ProgressBar percent={pct} className="w-full" label={`${done}/${total} done`} />
          </>
        ) : (
          <p className="text-xs text-zinc-400">No tasks yet — open to add your first task</p>
        )}
      </div>
    </motion.div>
  );
}

export default memo(ProjectCard);
