"use client";

import { useState, useEffect } from "react";
import { useAllAnnouncementsQuery } from "@/app/_Services/announcement/page";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Calendar, Hash } from "lucide-react"; // Icons ke liye lucide-react use karein
import { formatDate } from "@/app/utilities/date";

const AnnouncementPopup = () => {
  const { data: allData, isLoading, isError } = useAllAnnouncementsQuery();
  const [activeAnnouncements, setActiveAnnouncements] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (allData?.success && allData?.data) {
      const activeItems = allData.data.filter((ann) => ann.isActive === true);
      if (activeItems.length > 0) {
        setActiveAnnouncements(activeItems);
        setIsOpen(true);
      }
    }
  }, [allData]);

  const handleClose = () => setIsOpen(false);

  if (isLoading || !isOpen || activeAnnouncements.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>

          {/* Header */}
          <div className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                <Bell className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-zinc-100 text-2xl font-bold tracking-tight">
                  Updates
                </h2>
                <p className="text-zinc-500 text-sm">Latest team announcements</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="cursor-pointer p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-zinc-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body (Custom Scrollbar) */}
          <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar scroll-smooth">
            <div className="space-y-10 relative">
              {/* Vertical Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-zinc-800"></div>

              {activeAnnouncements?.map((ann) => (
                <div key={ann._id} className="relative pl-10 group">
                  {/* Glowing Dot */}
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-zinc-950 border-2 border-zinc-800 flex items-center justify-center group-hover:border-blue-500 transition-colors z-10">
                    <div className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all"></div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-zinc-100 font-bold text-xl leading-tight capitalize group-hover:text-blue-400 transition-colors">
                      {ann?.title}
                    </h3>
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 hover:bg-zinc-900/50 transition-all">
                       <p className="text-zinc-300 text-[15px] leading-relaxed whitespace-pre-wrap italic">
                        "{ann?.message}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-medium bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                        <Calendar className="w-3 h-3" />
                       {formatDate(ann?.createdAt)}
                        {/* {new Date(ann.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric"
                        })} */}
                      </div>
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-zinc-950 border-t border-zinc-800/50 flex flex-col gap-3">
            <button
              onClick={handleClose}
              className="cursor-pointer w-full bg-zinc-100 hover:bg-white text-zinc-950 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-[0_10px_20px_rgba(255,255,255,0.05)]"
            >
              Understand & Continue
            </button>
            <p className="text-center text-zinc-600 text-[10px] uppercase tracking-tighter">
             Zytron World • Internal Broadcast
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementPopup;