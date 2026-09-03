"use client";

import { memo } from "react";
import Header from "./Header/page";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const page = ({ icon, name, length, btnName, handleEdit, children }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-sm shadow-slate-200/60 sm:px-5 sm:py-4">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-900/[0.04]" />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="shrink-0">
          <Header icon={icon} length={length} name={name} />
        </div>

        {children && <div className="min-w-0 w-full flex-1">{children}</div>}

        {btnName && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => handleEdit()}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-md shadow-slate-900/15 transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            <span className="max-w-[9rem] truncate sm:max-w-none">{btnName}</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default memo(page);
