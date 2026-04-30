// components/MonthCard.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MonthCard = React.memo(({ month, index, formatDate, closeMonth, isUpdatingStatus, originalArgs}) => {
  const isClosing = isUpdatingStatus && originalArgs?.id === month?._id;
  const [confirmClose, setConfirmClose] = useState(false);
useEffect(() => {
  if (!isClosing) {
    setConfirmClose(false); // ✅ resets only after loading is done
  }
}, [isClosing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, ease: "easeOut" }}
      className="group relative rounded-2xl border border-white/[0.07] bg-[#0f0f13] p-5 hover:border-white/[0.14] hover:bg-[#13131a] shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.7)] transition-all duration-300 overflow-hidden">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-violet-600/10 transition-all duration-500" />

      {/* Top Row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-black text-white tracking-tight">
            {month?.monthCode}
          </h3>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            {month?.name}
          </p>
        </div>
        <span
          className={`text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wide border ${
            month?.status === "OPEN"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {month?.status === "OPEN" ? "● OPEN" : "● CLOSED"}
        </span>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4 bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.05]">
        <span>{formatDate(month?.startDate)}</span>
        <div className="flex-1 h-px bg-white/10" />
        <span>{formatDate(month?.endDate)}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">
            Sales
          </p>
          <p className="text-lg font-black text-white leading-none">
            {month?.totalSales}
          </p>
        </div>
        <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/[0.12] p-3">
          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">
            Amount
          </p>
          <p className="text-lg font-black text-emerald-400 leading-none">
            ${month?.totalAmount}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="text-[10px] text-zinc-600 space-y-1 mb-1 border-t border-white/[0.05] pt-3">
        <p>
          Created by{" "}
          <span className="text-zinc-400 font-semibold capitalize">
            {month?.createdBy?.fullName || "—"}
          </span>
        </p>
        <p>
          Updated by{" "}
          <span className="text-zinc-400 font-semibold capitalize">
            {month?.updatedBy?.fullName || "—"}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">

        {/* Confirm Close UI */}
        <AnimatePresence mode="wait">
          {confirmClose ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col gap-1.5 rounded-xl bg-amber-500/[0.07] border border-amber-500/20 px-3 py-2.5"
            >
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider text-center">
                Close this month?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmClose(false)}
                  className="flex-1 text-[11px] font-bold py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isClosing}
                  onClick={() => {
                    closeMonth(month?._id);
                    // setConfirmClose(false);
                  }}
                  className="flex-1 text-[11px] font-bold py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isClosing ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="animate-spin h-3 w-3 shrink-0" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Wait...
                    </span>
                  ) : "Confirm"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex gap-2 flex-1"
            >
              {month?.status === "OPEN" && (
                <button
                  onClick={() => setConfirmClose(true)}
                  className="cursor-pointer flex-1 text-[11px] font-semibold py-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  Close Month
                </button>
              )}
              {/* <button
                onClick={() => handleEdit(month)}
                className="cursor-pointer flex-1 text-[11px] font-semibold py-2 rounded-lg bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(month._id)}
                className="cursor-pointer flex-1 text-[11px] font-semibold py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                Delete
              </button> */}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
});

MonthCard.displayName = "MonthCard";

export default MonthCard;
