"use client";

import React from "react";
import LeaveDateField from "@/app/_Components/leave/LeaveDateField";
import CrmSelect from "@/app/_Components/ui/CrmSelect";

const FilterBar = React.memo(({
  viewType,
  setViewType,
  customRange,
  setCustomRange,
  clearFilters,
  period,
  setPeriod,
  periodOptions = [],
  variant = "light",
}) => {
  const dark = variant === "dark";

  const showClearButton =
    viewType !== "current_month" ||
    customRange.start ||
    (period && periodOptions[0] && period !== periodOptions[0].value);

  return (
    <div
      className={`flex flex-wrap gap-2 items-center rounded-2xl p-1.5 border ${
        dark
          ? "bg-zinc-900 border-zinc-800 shadow-none"
          : "bg-white border-zinc-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div className={`flex rounded-xl p-1 ${dark ? "bg-zinc-800" : "bg-zinc-50"}`}>
        {["current_month", "custom_range"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setViewType(type)}
            className={`cursor-pointer px-3 py-1.5 text-xs rounded-lg transition-all font-medium capitalize
              ${
                viewType === type
                  ? dark
                    ? "zyro-accent-btn shadow-sm"
                    : "bg-zinc-800 text-white shadow-sm"
                  : dark
                    ? "text-zinc-400 hover:text-zinc-200"
                    : "text-zinc-400 hover:text-zinc-500"
              }`}
          >
            {type.replace("_", " ")}
          </button>
        ))}
      </div>

      {viewType === "current_month" && periodOptions.length > 0 && (
        <div className="min-w-[260px] max-w-md flex-1 sm:min-w-[320px]">
          <CrmSelect
            options={periodOptions}
            value={period}
            onChange={(v) => setPeriod?.(v)}
          />
        </div>
      )}

      {viewType === "custom_range" && (
        <div className="flex items-center gap-1.5">
          <div className="w-[148px]">
            <LeaveDateField
              compact
              placeholder="Start"
              value={customRange.start}
              onChange={(start) => setCustomRange({ ...customRange, start })}
            />
          </div>
          <div className="w-[148px]">
            <LeaveDateField
              compact
              placeholder="End"
              value={customRange.end}
              onChange={(end) => setCustomRange({ ...customRange, end })}
            />
          </div>
        </div>
      )}

      {showClearButton && (
        <button
          type="button"
          onClick={() => {
            clearFilters();
          }}
          className="flex h-[38px] cursor-pointer items-center justify-center rounded-xl border border-rose-800/70 bg-[#3a1518] px-3 text-xs font-medium tracking-wide text-rose-300 transition-all hover:border-rose-700 hover:bg-[#4a1c20] hover:text-rose-200"
        >
          CLEAR
        </button>
      )}
    </div>
  );
});

export default FilterBar;
