"use client";

import { memo } from "react";
import { Search } from "lucide-react";
import IconButton from "@/app/_Components/chat/ui/IconButton";

function SidebarSearch({
  theme,
  dark,
  filter,
  onFilterChange,
  listFilter,
  setListFilter,
}) {
  return (
    <div className="px-3 pb-3 pt-1 space-y-2.5">
      <div
        className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 ${theme.input}`}
      >
        <Search className="h-4 w-4 shrink-0 text-zinc-400" />
        <input
          value={filter}
          onChange={onFilterChange}
          placeholder="Search conversations"
          className={`w-full bg-transparent text-[13px] outline-none ${
            dark
              ? "text-zinc-100 placeholder:text-zinc-500"
              : "text-zinc-900 placeholder:text-zinc-400"
          }`}
        />
      </div>
      <div className="flex gap-1.5">
        {[
          ["all", "All"],
          ["groups", "Groups"],
          ["archived", "Archived"],
        ].map(([id, label]) => (
          <IconButton
            key={id}
            label={label}
            onClick={() => setListFilter(id)}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
              listFilter === id ? theme.chipOn : theme.chipOff
            }`}
          >
            {label}
          </IconButton>
        ))}
      </div>
    </div>
  );
}

export default memo(SidebarSearch);
