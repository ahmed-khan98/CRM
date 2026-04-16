import { AlertCircle, Delete, LogOut, Trash2 } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const WarningModal = ({
  isDeleting,
  setConfirmDelete,
  handleDelete,
  message,
}) => {


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <div className={`p-6 text-center`}>
          <div
            className={`h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-red-500 bg-red-200 text-red-500 }`}
          >
             <Trash2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-zinc-400 mb-2">
            Delete Confirmation
          </h3>
        
          <p className="text-gray-500 mb-6 text-sm leading-relaxed px-4">
            {`This action cannot be undone. Do you really want to remove this ${message} record?`}{" "}
          </p>
          <div className="flex justify-center space-x-6">
            {/* <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setConfirmDelete(null)}
              className="cursor-pointer flex-1 px-4 py-3 border border-zinc-800 rounded-2xl text-zinc-600 text-sm font-bold hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </motion.button> */}
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
              cancel
            </button>
            {/* <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDelete()}
              disabled={isDeleting}
              className={`cursor-pointer flex-1 px-4 py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all  bg-red-500 hover:bg-red-600 shadow-red-100}`}>
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                  Deleting...
                </>
              ) : (
                <>Yes, Delete</>
              )}
            </motion.button> */}
            <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleDelete()}
                          disabled={isDeleting}
                          className="cursor-pointer w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                          style={
                            isDeleting
                              ? { background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)", color: "#fb923c" }
                              : { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }
                          }
                        >
                          {isDeleting ? (
                            <div
                              className="h-4 w-4 rounded-full animate-spin border-2 border-transparent"
                              style={
                                isDeleting
                                  ? { borderTopColor: "#fb923c", borderRightColor: "#fb923c" }
                                  : { borderTopColor: "#f87171", borderRightColor: "#f87171" }
                              }
                            />
                          ) : ( 
                            <>
                              {/* <Clock size={14} /> */}
                              Yes, Delete
                            </>
                          )}
                        </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WarningModal;
