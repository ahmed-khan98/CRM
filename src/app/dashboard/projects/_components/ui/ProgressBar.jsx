"use client";

import { memo } from "react";
import { motion } from "framer-motion";

function ProgressBar({ percent, className = "w-24", label }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-zinc-400">{label}</span>
          <span className="text-[10px] font-semibold text-zinc-600">{percent}%</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`h-full rounded-full ${percent === 100 ? "bg-emerald-500" : "bg-zinc-800"}`}
          />
        </div>
        {!label && (
          <span className="text-[11px] font-semibold text-zinc-500 shrink-0">{percent}%</span>
        )}
      </div>
    </div>
  );
}

export default memo(ProgressBar);
