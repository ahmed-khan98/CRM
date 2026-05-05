import { XCircle } from "lucide-react";
import React from "react";

const FilterBar = React.memo(({
  viewType,
  setViewType,
  customRange,
  setCustomRange,
  clearFilters
}) => {

  const showClearButton = viewType !== "current_month" || customRange.start;

  return (

        <div className="flex flex-wrap gap-2 items-center bg-white border border-zinc-200 rounded-2xl p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex bg-zinc-100 rounded-xl p-1">
            {["current_month", "custom_range"].map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`cursor-pointer px-3 py-1.5 text-[11px] rounded-lg transition-all font-bold capitalize
                  ${viewType === type ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                {type.replace("_", " ")}
              </button>
            ))}
          </div>

          {viewType === "custom_range" && (
            <div className="flex items-center gap-1.5">
              {["start", "end"].map((key) => (
                <input
                  key={key}
                  type="date"
                  value={customRange[key]}
                  onChange={(e) => setCustomRange({ ...customRange, [key]: e.target.value })}
                  className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-[11px] px-2.5 py-1.5 rounded-xl outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-300 transition-all w-32"
                />
              ))}
            </div>
          )}

          {showClearButton && (
            <button
              onClick={() => { clearFilters()}}
              className="cursor-pointer p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
  );
});

export default FilterBar;