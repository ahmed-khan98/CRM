"use client";

import { memo } from "react";
import { motion } from "framer-motion";

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 py-20 text-center"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <Icon className="h-5 w-5 text-zinc-400" />
      </div>
      <p className="text-sm font-black text-zinc-600">{title}</p>
      {description && <p className="mt-1 text-xs text-zinc-400">{description}</p>}
      {action}
    </motion.div>
  );
}

export default memo(EmptyState);
