import { AlertCircle, Clock } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import moment from "moment-timezone";

const TimeOutModal = ({
  isDeleting,
  setConfirmDelete,
  handleDelete,
  type = "timeout",
}) => {
  
  const isTimeOut = type === "timeout";

const now = moment().tz("Asia/Karachi");
const currentTime = now.format("hh:mm A");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100"
      >
        <div className="p-8 text-center">
          {/* Icon Container */}
          <div
            className={`h-20 w-20 rounded-3xl mx-auto mb-6 flex items-center justify-center transition-colors ${
              isTimeOut
                ? "bg-orange-50 text-orange-500"
                : "bg-red-50 text-red-500"
            }`}
          >
            {isTimeOut ? (
              <Clock size={40} className="animate-pulse" />
            ) : (
              <AlertCircle size={40} />
            )}
          </div>

          <h3 className="text-2xl font-black text-gray-800 mb-2">
            Finish for today?
          </h3>

           <p className="text-gray-500 mb-8 text-sm leading-relaxed px-4">
            You are about to record your Time Out at <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{currentTime}</span>.
          </p>
          

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDelete()}
              disabled={isDeleting}
              className={`cursor-pointer w-full py-4 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                isTimeOut
                  ? "bg-orange-500 hover:bg-orange-600 shadow-orange-100"
                  : "bg-red-500 hover:bg-red-600 shadow-red-100"
              }`}
            >
              {isDeleting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Yes, Time Out</>
              )}
            </motion.button>

            <button
              onClick={() => setConfirmDelete(null)}
              className="cursor-pointer w-full py-3 text-gray-400 text-xs font-bold hover:text-gray-600 transition-colors"
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
