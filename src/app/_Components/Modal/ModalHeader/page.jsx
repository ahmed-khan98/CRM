import React, { memo } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const page = ({ icon: Icon, name, closeModal, isEdit }) => {
  return (
    <>
      <div className="h-[1.5px] w-full flex-shrink-0 bg-gradient-to-r from-transparent via-white/25 to-white/[0.06]" />
      <div className="flex items-center justify-between px-6 py-3 flex-shrink-0 border-b border-white/[0.07]  bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.07] border border-white/10 flex-shrink-0">
            <Icon className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-zinc-600">
              {isEdit ? `Edit Record` : `New Record`}
            </p>
            <h2 className="text-base font-black text-zinc-100">
              {isEdit ? `Edit ${name}` : `Add New ${name}`}
            </h2>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={closeModal}
          className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/[0.08] text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-all duration-150"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </>
  );
};

export default memo(page, (prevProps, nextProps) => {
  return (
    prevProps.closeModal === nextProps.closeModal
  );
});
