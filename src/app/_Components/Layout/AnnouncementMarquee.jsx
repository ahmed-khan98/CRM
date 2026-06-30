"use client";
import React from "react";
import { useAllAnnouncementsQuery } from "@/app/_Services/announcement/page";
import { Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const AnnouncementMarquee = () => {
  const { data: allData } = useAllAnnouncementsQuery();
  const activeAnnouncements =
    allData?.data?.filter((ann) => ann.isActive) || [];

  if (activeAnnouncements.length === 0) return null;

  const fullText = activeAnnouncements
    .map((ann) => `${ann.title}: ${ann.message}`)
    .join(" • ");

  return (
    <div className="bg-zinc-900 border-b border-zinc-800 py-1.5 sm:py-2 overflow-hidden flex items-center relative z-40 rounded-lg mx-1 sm:mx-2">
      {/* Fixed Label */}
      <div className="bg-zinc-900 px-2 sm:px-3 flex shrink-0 items-center gap-1.5 sm:gap-2 z-20 border-r border-zinc-800 shadow-xl">
        <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 animate-pulse" />
        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.14em] sm:tracking-[0.2em] text-zinc-400 whitespace-nowrap">
          Updates
        </span>
      </div>

      {/* Framer Motion Marquee */}
      <div className="flex min-w-0 flex-1 overflow-hidden relative">
        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            ease: "linear",
            duration: 400, // Speed control (zyada seconds = slow)
            repeat: Infinity,
          }}
          className="flex whitespace-nowrap items-center gap-6 pl-3"
        >
          <span className="text-[11px] sm:text-sm text-zinc-300 font-semibold sm:font-medium tracking-wide">
            {fullText} ——— {fullText} ——— {fullText}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default AnnouncementMarquee;
