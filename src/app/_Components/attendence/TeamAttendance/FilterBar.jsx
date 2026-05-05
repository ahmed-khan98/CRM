import { XCircle } from "lucide-react";
import React, { memo } from "react";
import Select from "react-select";

  const customSelectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    menu: (base) => ({ ...base, zIndex: 9999, borderRadius: "12px", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }),
    control: (base, state) => ({
      ...base,
      background: "#f9fafb",
      borderColor: state.isFocused ? "#71717a" : "#e4e4e7",
      borderRadius: "0.75rem",
      padding: "1px",
      fontSize: "12px",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "none",
      "&:hover": { borderColor: "#71717a" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#27272a" : state.isFocused ? "#f4f4f5" : "white",
      color: state.isSelected ? "white" : "#374151",
      fontSize: "12px",
      padding: "8px 12px",
      cursor: "pointer",
    }),
  };

const FiltersBar = memo(({
  employeeOptions,
  selectedEmployee,
  setSelectedEmployee,
  viewType,
  setViewType,
  customRange,
  setCustomRange,
  showClearBtn,
  onClear,
}) => {
  return (
<div className="bg-white border border-zinc-200 rounded-2xl p-2.5 flex flex-wrap items-end gap-2.5 shrink-0 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
       <div className="flex flex-col gap-1 grow min-w-[200px]">
          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Employee</label>
          <Select
            options={employeeOptions}
            styles={customSelectStyles}
            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
            placeholder="All Employees..."
            value={employeeOptions.find((opt) => opt.value === selectedEmployee)}
            onChange={(selected) => setSelectedEmployee(selected?.value || "")}
            isSearchable
            isClearable
          />
        </div>


       <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Period</label>
          <div className="flex bg-zinc-100 p-1 rounded-xl h-[38px] items-center">
            {["today", "month", "custom"].map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`cursor-pointer px-3 py-1.5 h-full text-[10px] font-black rounded-lg capitalize transition-all
                  ${viewType === type ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

      {viewType === "custom" && (

        <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Date Range</label>
            <div className="flex items-center gap-1.5 h-[38px]">
              {["start", "end"].map((key) => (
                <input
                  key={key}
                  type="date"
                  value={customRange[key]}
                  onChange={(e) => setCustomRange({ ...customRange, [key]: e.target.value })}
                  className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-[11px] px-2.5 h-full rounded-xl outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-300 transition-all"
                />
              ))}
            </div>
          </div>
      )}

      {showClearBtn && <button
            onClick={onClear}
        className="cursor-pointer h-[38px] px-3 flex items-center gap-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-zinc-200 transition-all text-[10px] font-black">
            <XCircle size={14} /> CLEAR
          </button>}
    </div>
  );
});

export default FiltersBar;