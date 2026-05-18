import React, { memo, useMemo } from 'react'
import moment from "moment-timezone";

const Header = ({ icon: Icon, length, name }) => {

  return (
    <div className="flex items-center gap-2.5 shrink-0 select-none">
      <div className="p-2.5 rounded-xl bg-zinc-800 shadow-lg shadow-zinc-200 transition-transform hover:scale-105">
        {Icon && <Icon className="h-5 w-5 text-white" />}
      </div>

      <div>
        <h1 className="text-lg font-black tracking-tight text-zinc-800 leading-none">
          {name}
        </h1>
        
        <p className="text-[9px] text-zinc-400 font-bold mt-1 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-zinc-300" />
          <span className="text-zinc-500">{length?.toLocaleString()} Records</span>
        </p>
      </div>
    </div>
  )
}


export default memo(Header);