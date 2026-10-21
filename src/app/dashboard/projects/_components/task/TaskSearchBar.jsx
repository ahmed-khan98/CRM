"use client";

import { memo, useMemo } from "react";
import Select from "react-select";
import { ArrowUpDown, Search, X } from "lucide-react";
import Tooltip from "@/app/_Components/ui/Tooltip";
import { crmPillSelectStyles } from "@/app/_Components/ui/CrmSelect";

const SORT_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

function TaskSearchBar({
  search,
  onSearchChange,
  visibleCount,
  totalCount,
  embedded = false,
  sortOrder,
  onSortChange,
}) {
  const isFiltered = search.trim().length > 0;
  const sortValue = useMemo(
    () => SORT_OPTIONS.find((o) => o.value === sortOrder) || SORT_OPTIONS[0],
    [sortOrder]
  );

  return (
    <div
      className={
        embedded
          ? "flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-700 bg-[#121212] px-3 py-2 sm:gap-3 sm:px-4 sm:py-2.5"
          : "flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-700 bg-[#121212] px-4 py-3 shadow-none"
      }
    >
      <Search className="h-4 w-4 shrink-0 text-zinc-500" />
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks by title, client, project, assignee or creator…"
        className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
      />
      {onSortChange && (
        <div className="flex w-[9.75rem] shrink-0 items-center gap-1.5">
          <ArrowUpDown
            className="hidden h-3.5 w-3.5 shrink-0 text-zinc-500 sm:block"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <Select
              options={SORT_OPTIONS}
              value={sortValue}
              onChange={(opt) => opt?.value && onSortChange(opt.value)}
              styles={crmPillSelectStyles}
              isSearchable={false}
              isClearable={false}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
              classNamePrefix="task-sort"
              aria-label="Sort tasks"
            />
          </div>
        </div>
      )}
      {isFiltered && (
        <>
          <span className="hidden sm:inline shrink-0 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[10px] font-semibold text-zinc-400">
            {visibleCount} of {totalCount}
          </span>
          <Tooltip label="Clear search" side="top">
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
              className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </>
      )}
    </div>
  );
}

export default memo(TaskSearchBar);
