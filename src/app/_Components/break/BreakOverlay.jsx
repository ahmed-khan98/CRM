'use client'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from "moment-timezone";

const BreakOverlay = ({ startTime, onBreakOut }) => {
  const [duration, setDuration] = useState('0m 0s');
  const breakTime = useSelector((state) => state.filter.lastBreakInTime);

useEffect(() => {
  const timer = setInterval(() => {
    if (!startTime) return;

    // 1. UTC string ko parse karein aur Karachi mein convert karein
    const start = moment.utc(startTime).tz("Asia/Karachi");
    
    // 2. Abhi ka waqt bhi Karachi mein lein
    const now = moment().tz("Asia/Karachi");

    // 3. Difference calculate karein (Ab seconds mein accurate diff aayega)
    const diffInSeconds = now.diff(start, 'seconds');

    // Agar diff negative hai (clock sync issue), toh 0 dikhao
    if (diffInSeconds < 0 || isNaN(diffInSeconds)) {
      setDuration('0m 0s');
    } else {
      const mins = Math.floor(diffInSeconds / 60);
      const secs = diffInSeconds % 60;
      setDuration(`${mins}m ${secs}s`);
    }
  }, 1000);

  return () => clearInterval(timer);
}, [startTime]);

  return (
    
     <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/100 backdrop-blur-lg">
      <div className="w-full max-w-sm mx-4  rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d0d0f] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">

        {/* Top accent line */}
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Header */}
        <div className="flex flex-col items-center gap-2 px-6 pt-6 pb-4 border-b border-white/[0.04]">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20 text-2xl">
            🚫
          </div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-400">
            System Idle (On Break)
          </p>
        </div>

        {/* Break info */}
        <div className="px-6 py-4 flex flex-col gap-3">

          {/* Break started at */}
          <div className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-600">
              Break Started At
            </span>
            <span className="text-xs font-mono font-bold text-zinc-300">
              {breakTime
                ? moment(breakTime).tz("Asia/Karachi").format("hh:mm:ss A")
                : "--:--"}
            </span>
          </div>

          {/* Duration */}
          <div className="flex flex-col items-center gap-1 rounded-xl px-4 py-4 bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600">
              Duration
            </span>
            <span className="text-3xl font-black font-mono text-zinc-100 tabular-nums">
              {duration}
            </span>
          </div>

          {/* Resume button */}
          <button
            onClick={() => onBreakOut()}
            className="cursor-pointer w-full py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            I am Back! (Resume Work)
          </button>
        </div>

        {/* Bottom accent line */}
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
};

export default BreakOverlay;
