"use client";

import { memo } from "react";
import { Search, X } from "lucide-react";

function TaskSearchBar({ search, onSearchChange, visibleCount, totalCount }) {
  const isFiltered = search.trim().length > 0;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3 shadow-sm">
      <Search className="h-4 w-4 shrink-0 text-zinc-400" />
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks by title, client, project, assignee or creator…"
        className="flex-1 bg-transparent text-sm text-zinc-700 placeholder-zinc-400 outline-none"
      />
      {isFiltered && (
        <>
          <span className="hidden sm:inline shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold text-zinc-500">
            {visibleCount} of {totalCount}
          </span>
          <button
            type="button"
            title="Clear search"
            onClick={() => onSearchChange("")}
            className="shrink-0 flex h-6 w-6 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  );
}

export default memo(TaskSearchBar);
