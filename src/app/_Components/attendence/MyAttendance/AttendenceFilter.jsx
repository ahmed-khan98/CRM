import Select from "react-select";

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
        <label className="type-label ml-1">Employee</label>
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
        <label className="type-label ml-1">Period</label>
        <div className="flex bg-zinc-50 p-1 rounded-xl h-[38px] items-center">
          {["today", "month", "custom"].map((type) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`px-3 py-1.5 h-full text-xs font-medium rounded-lg capitalize transition-all
                ${viewType === type ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-500"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {viewType === "custom" && (
        <div className="flex items-center gap-1.5 h-[38px]">
          <input type="date" value={customRange.start} onChange={(e) => setCustomRange({...customRange, start: e.target.value})} className="border rounded-xl px-2 h-full text-xs" />
          <input type="date" value={customRange.end} onChange={(e) => setCustomRange({...customRange, end: e.target.value})} className="border rounded-xl px-2 h-full text-xs" />
        </div>
      )}

      {(viewType !== "today" || selectedEmployee) && (
        <button
          type="button"
          onClick={onClear}
          className="flex h-[38px] cursor-pointer items-center justify-center rounded-xl border border-rose-800/70 bg-[#3a1518] px-3 text-xs font-medium tracking-wide text-rose-300 transition-all hover:border-rose-700 hover:bg-[#4a1c20] hover:text-rose-200"
        >
          CLEAR
        </button>
      )}
    </div>
  );
};