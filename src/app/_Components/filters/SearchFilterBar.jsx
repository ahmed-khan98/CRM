"use client";

import { Search, X } from "lucide-react";

/**
 * Reusable Gen-Z professional search + department filter bar.
 *
 * Props:
 *  searchTerm            string
 *  onSearchChange        (value: string) => void
 *  searchPlaceholder?    string
 *  debouncedSearchTerm?  string  — shows "typing…" indicator when different
 *
 *  tabItems              { label: string; value: string }[]
 *                        e.g. [{ label:"all", value:"" }, { label:"Design", value:"dept-id" }]
 *  activeTab             string  (current value)
 *  onTabChange           (value: string) => void
 */
export default function SearchFilterBar({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  debouncedSearchTerm,

  tabItems = [],
  activeTab = "",
  onTabChange,
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-zinc-100 bg-white p-2 shadow-sm">
      {/* ── Row: Tabs + Search ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Scrollable Department Tabs */}
        {tabItems.length > 0 && (
          <div
            className="flex shrink-0 gap-1 overflow-x-auto rounded-xl bg-zinc-50 p-1 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {tabItems.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={`shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-[11px] font-bold capitalize transition-all whitespace-nowrap ${
                  activeTab === tab.value
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-500 hover:bg-white hover:text-zinc-800 hover:shadow-sm"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Search Input */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-xl border border-zinc-100 bg-zinc-50 pl-8 pr-8 text-[12px] font-medium text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-zinc-100"
          />
          {/* typing indicator (debounced) */}
          {debouncedSearchTerm !== undefined &&
          searchTerm &&
          searchTerm !== debouncedSearchTerm ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
              typing…
            </span>
          ) : searchTerm ? (
            <button
              onClick={() => onSearchChange?.("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
