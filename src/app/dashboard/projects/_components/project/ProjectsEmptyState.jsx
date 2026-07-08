"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Plus } from "lucide-react";
import EmptyState from "../ui/EmptyState";

function ProjectsEmptyState({ onCreate }) {
  return (
    <EmptyState
      icon={FolderKanban}
      title="No projects yet"
      description="Create one manually or add a client."
      action={
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onCreate}
          className="mt-5 inline-flex items-center gap-1.5 rounded-2xl bg-zinc-900 px-4 py-2.5 text-xs font-black text-white hover:bg-zinc-800 transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" /> Create Project
        </motion.button>
      }
    />
  );
}

export default memo(ProjectsEmptyState);
