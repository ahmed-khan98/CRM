import React, { memo } from "react";
import Header from "./Header/page";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const page = ({icon,name,length,btnName,handleEdit}) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <Header
        icon={icon}
        length={length}
        name={name}
      />

      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => handleEdit()}
        className="flex items-center gap-1 cursor-pointer bg-zinc-900 text-white p-2 rounded-xl text-[12px] font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-400/20 border border-zinc-700"
      >
        <Plus className="h-4 w-4" />
        {btnName}
      </motion.button>
    </div>
  );
};

export default memo(page);
