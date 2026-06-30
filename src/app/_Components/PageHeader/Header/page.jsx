import React, { memo } from "react";

const Header = ({ icon: Icon, length, name }) => {
  return (
    <div className="flex min-w-0 items-center gap-2.5 select-none sm:gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950 text-white shadow-lg shadow-zinc-900/10 sm:h-11 sm:w-11">
        {Icon && <Icon className="h-5 w-5" />}
      </div>

      <div className="min-w-0">
        <h1 className="truncate text-base font-black tracking-tight text-zinc-900 sm:text-lg">
          {name}
        </h1>

        <p className="mt-[0.5px] flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span className="truncate text-zinc-500">
            {length?.toLocaleString()} Records
          </span>
        </p>
      </div>
    </div>
  );
};

export default memo(Header);
