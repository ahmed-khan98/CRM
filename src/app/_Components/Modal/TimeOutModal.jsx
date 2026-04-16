import { AlertCircle, Clock } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import moment from "moment-timezone";

const TimeOutModal = ({ isDeleting, setConfirmDelete, handleDelete, type = "timeout" }) => {
  const isTimeOut = type === "timeout";
  const currentTime = moment().tz("Asia/Karachi").format("hh:mm A");

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-sm overflow-hidden rounded-[20px] bg-zinc-950 border border-white/[0.08] shadow-2xl"
      >
        {/* Top accent */}
        <div className={`h-[1.5px] w-full ${isTimeOut ? "bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" : "bg-gradient-to-r from-transparent via-red-400/60 to-transparent"}`} />

        <div className="p-6 text-center">
          {/* Icon */}
          <div className={`h-16 w-16 rounded-2xl mx-auto mb-5 flex items-center justify-center border
            ${isTimeOut ? "bg-orange-500/10 border-orange-500/20" : "bg-red-500/10 border-red-500/20"}`}
          >
            {isTimeOut
              ? <Clock size={28} className="text-orange-400 animate-pulse" />
              : <AlertCircle size={28} className="text-red-400" />
            }
          </div>

          <h3 className="text-xl font-black mb-2 tracking-tight text-zinc-100">
            Finish for today?
          </h3>

          <p className="text-sm leading-relaxed px-1 mb-7 text-zinc-500">
            You are about to record your Time Out at{" "}
            <span className={`font-bold px-2 py-[3px] rounded-lg text-xs border
              ${isTimeOut ? "bg-orange-500/12 text-orange-400 border-orange-500/20" : "bg-red-500/12 text-red-400 border-red-500/20"}`}
            >
              {currentTime}
            </span>
          </p>

          <div className="flex flex-col gap-2 px-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleDelete()}
              disabled={isDeleting}
              className={`cursor-pointer w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed
                ${isTimeOut
                  ? "bg-orange-500/15 border-orange-500/30 text-orange-400 hover:bg-orange-500/25"
                  : "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25"
                }`}
            >
              {isDeleting ? (
                <div className={`h-4 w-4 rounded-full animate-spin border-2 border-transparent ${isTimeOut ? "border-t-orange-400 border-r-orange-400" : "border-t-red-400 border-r-red-400"}`} />
              ) : (
                <><Clock size={14} /> Yes, Time Out</>
              )}
            </motion.button>

            <button
              onClick={() => setConfirmDelete(null)}
              className="cursor-pointer w-full py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 bg-white/[0.03] border border-white/[0.06] text-zinc-600 hover:bg-white/[0.06] hover:text-zinc-400"
            >
              Wait, Not Yet
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeOutModal;