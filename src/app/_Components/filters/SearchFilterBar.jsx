"use client";

import { Search, X } from "lucide-react";

/**
 * Reusable search + department filter toolbar.
 * Mobile: tabs scroll horizontally full-width; search stacks full-width below.
 * Desktop: row layout; both children min-w-0 so they never blow out the card.
 */
export default function SearchFilterBar({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  debouncedSearchTerm,
  tabItems = [],
  activeTab = "",
  onTabChange,
  /** Optional controls rendered inside the toolbar (right of search). */
  endSlot = null,
}) {
  return (
    <div className="toolbar-surface min-w-0 w-full flex-col flex-nowrap items-stretch gap-2.5 overflow-visible sm:flex-row sm:items-center sm:justify-between">
      {tabItems.length > 0 ? (
        <div
          className="min-w-0 w-full overflow-x-auto overscroll-x-contain rounded-[10px] bg-zinc-50 p-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-1 sm:basis-0"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex w-max min-w-full gap-0.5">
            {tabItems.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange?.(tab.value)}
                className={`shrink-0 cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium capitalize transition whitespace-nowrap ${
                  activeTab === tab.value
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
                    : "text-zinc-500 hover:bg-white/80 hover:text-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="relative min-w-0 w-full sm:max-w-xs sm:flex-none lg:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 z-[1] h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="input-control h-10 w-full min-w-0 !pl-10 !pr-9"
        />
        {debouncedSearchTerm !== undefined &&
        searchTerm &&
        searchTerm !== debouncedSearchTerm ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400">
            typing…
          </span>
        ) : searchTerm ? (
          <button
            type="button"
            onClick={() => onSearchChange?.("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-zinc-400 transition hover:bg-zinc-50 hover:text-zinc-900"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        ) : null}
      </div>

      {endSlot ? (
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:ml-auto sm:shrink-0">
          {endSlot}
        </div>
      ) : null}
    </div>
  );
}
