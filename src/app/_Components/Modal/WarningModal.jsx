import { LogOut, Trash2, UserMinus } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const ICONS = {
  delete: Trash2,
  leave: LogOut,
  remove: UserMinus,
};

const WarningModal = ({
  isDeleting,
  setConfirmDelete,
  handleDelete,
  message,
  title,
  description,
  confirmLabel,
  icon = "delete",
}) => {
  const Icon = ICONS[icon] || Trash2;
  const heading = title || "Delete Confirmation";
  const body =
    description ||
    `This action cannot be undone. Do you really want to remove this ${message || "item"} record?`;
  const actionLabel = confirmLabel || "Yes, Delete";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/40 bg-red-500/15 text-red-400">
            <Icon size={26} />
          </div>
          <h3 className="mb-2 text-lg font-bold text-white">{heading}</h3>

          <p className="mb-6 px-2 text-sm leading-relaxed text-zinc-400">{body}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setConfirmDelete(null)}
              className="cursor-pointer w-full py-2.5 text-xs font-semibold rounded-xl transition-all duration-150"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#52525b",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "#a1a1aa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                e.currentTarget.style.color = "#52525b";
              }}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleDelete()}
              disabled={isDeleting}
              className="cursor-pointer w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              style={
                isDeleting
                  ? {
                      background: "rgba(251,146,60,0.15)",
                      border: "1px solid rgba(251,146,60,0.3)",
                      color: "#fb923c",
                    }
                  : {
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#f87171",
                    }
              }
            >
              {isDeleting ? (
                <div
                  className="h-4 w-4 rounded-full animate-spin border-2 border-transparent"
                  style={
                    isDeleting
                      ? {
                          borderTopColor: "#fb923c",
                          borderRightColor: "#fb923c",
                        }
                      : {
                          borderTopColor: "#f87171",
                          borderRightColor: "#f87171",
                        }
                  }
                />
              ) : (
                <>{actionLabel}</>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WarningModal;
