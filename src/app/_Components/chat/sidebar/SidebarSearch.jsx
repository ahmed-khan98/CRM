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
    <div className="px-3 py-2 space-y-2">
      <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${theme.input} border`}>
        <Search className="h-4 w-4 text-zinc-400" />
        <input
          value={filter}
          onChange={onFilterChange}
          placeholder="Search or start new chat"
          className={`w-full bg-transparent text-sm outline-none ${
            dark
              ? "text-zinc-100 placeholder:text-zinc-400"
              : "text-zinc-900 placeholder:text-zinc-500"
          }`}
        />
      </div>
      <div className="flex gap-2 text-xs">
        {[
          ["all", "All"],
          ["groups", "Groups"],
          ["archived", "Archived"],
        ].map(([id, label]) => (
          <IconButton
            key={id}
            label={label}
            onClick={() => setListFilter(id)}
            className={`rounded-full px-3 py-1 font-medium ${
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
