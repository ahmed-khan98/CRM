import Select from "react-select";
import { XCircle } from "lucide-react";

export const AttendanceFilters = ({ 
  viewType, setViewType, 
  selectedEmployee, setSelectedEmployee, 
  employeeOptions, customSelectStyles,
  customRange, setCustomRange,
  onClear 
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-2.5 flex flex-wrap items-end gap-2.5 shrink-0 shadow-sm">
      <div className="flex flex-col gap-1 grow min-w-[200px]">
        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">Employee</label>
        <Select
          options={employeeOptions}
          styles={customSelectStyles}
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
              className={`px-3 py-1.5 h-full text-[10px] font-black rounded-lg capitalize transition-all
                ${viewType === type ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {viewType === "custom" && (
        <div className="flex items-center gap-1.5 h-[38px]">
          <input type="date" value={customRange.start} onChange={(e) => setCustomRange({...customRange, start: e.target.value})} className="border rounded-xl px-2 h-full text-[11px]" />
          <input type="date" value={customRange.end} onChange={(e) => setCustomRange({...customRange, end: e.target.value})} className="border rounded-xl px-2 h-full text-[11px]" />
        </div>
      )}

      {(viewType !== "today" || selectedEmployee) && (
        <button onClick={onClear} className="h-[38px] px-3 flex items-center gap-1 text-rose-500 text-[10px] font-black border border-rose-100 rounded-xl hover:bg-rose-50">
          <XCircle size={14} /> CLEAR
        </button>
      )}
    </div>
  );
};