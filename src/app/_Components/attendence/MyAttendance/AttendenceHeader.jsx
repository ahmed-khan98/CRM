import React, { memo, useMemo } from 'react'
import moment from "moment-timezone";

const AttendenceHeader = ({ icon: Icon, length, name }) => {
  // 1. Memoize Month/Year: Ye tabhi update hoga jab "length" ya "name" badlega
  // Warna ye static hi rahega.
  const currentPeriod = useMemo(() => moment().format("MMMM YYYY"), []);

  return (
    <div className="flex items-center gap-2.5 shrink-0 select-none">
      {/* Icon Container with subtle animation */}
      <div className="p-2 rounded-xl bg-zinc-800 shadow-lg shadow-zinc-200 transition-transform hover:scale-105">
        {Icon && <Icon className="h-5 w-5 text-white" />}
      </div>

      <div>
        <h1 className="text-xl font-black tracking-tight text-zinc-800 leading-none">
          {name}
        </h1>
        
        <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase tracking-wider flex items-center gap-1.5">
          <span>{currentPeriod}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300" />
          <span className="text-zinc-500">{length?.toLocaleString()} Records</span>
        </p>
      </div>
    </div>
  )
}

// 2. memo() use karne se parent ki state change hone par ye component 
// re-render nahi hoga jab tak iske props change na hon.
export default memo(AttendenceHeader);