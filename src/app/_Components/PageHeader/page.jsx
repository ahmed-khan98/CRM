import React, { memo } from "react";
import Header from "./Header/page";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const page = ({ icon, name, length, btnName, handleEdit, children }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 p-3 md:p-2 shadow-sm shadow-zinc-200/60 backdrop-blur sm:p-4">
      {/* <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-zinc-900/[0.04]" />
      <div className="pointer-events-none absolute -bottom-12 left-8 h-24 w-24 rounded-full bg-indigo-500/[0.06]" /> */}

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="shrink-0">
          <Header icon={icon} length={length} name={name} />
        </div>

        {children && (
          <div className="min-w-0 w-full flex-1">
            {children}
          </div>
        )}

        {btnName && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleEdit()}
            className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-950 px-2 text-[11px] font-black text-white shadow-lg shadow-zinc-900/15 transition-all hover:-translate-y-0.5 hover:bg-zinc-800 sm:h-11 sm:px-3 sm:text-xs"
          >
            <Plus className="h-4 w-4" />
            <span className="max-w-[7.5rem] truncate sm:max-w-none">
              {btnName}
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default memo(page);
