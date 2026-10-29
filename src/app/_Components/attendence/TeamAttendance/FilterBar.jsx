"use client";

import React, { memo } from "react";
import Select from "react-select";
import LeaveDateField from "@/app/_Components/leave/LeaveDateField";
import CrmSelect from "@/app/_Components/ui/CrmSelect";

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
      fontWeight: "500",
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

const darkSelectStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({ ...base, zIndex: 9999, borderRadius: "12px", overflow: "hidden", background: "#18181b", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)", border: "1px solid #27272a" }),
  control: (base, state) => ({
    ...base,
    background: "#18181b",
    borderColor: state.isFocused ? "#a3a3a3" : "#27272a",
    borderRadius: "0.75rem",
    padding: "1px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    boxShadow: "none",
    color: "#f4f4f5",
    "&:hover": { borderColor: "#3f3f46" },
  }),
  singleValue: (base) => ({ ...base, color: "#f4f4f5" }),
  input: (base) => ({ ...base, color: "#f4f4f5" }),
  placeholder: (base) => ({ ...base, color: "#71717a" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#e5e7eb" : state.isFocused ? "#27272a" : "#18181b",
    color: state.isSelected ? "#0a0a0a" : "#e4e4e7",
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
  leaveTypeOptions,
  leaveTypeId,
  setLeaveTypeId,
  period,
  setPeriod,
  periodOptions = [],
  variant = "dark",
}) => {
  const dark = variant !== "light";
  const selectStyles = dark ? darkSelectStyles : customSelectStyles;
  return (
    <div
      className={`flex w-full min-w-0 shrink-0 flex-nowrap items-end gap-2 overflow-x-auto rounded-2xl border p-2.5 ${
        dark
          ? "border-zinc-800 bg-zinc-900 shadow-none"
          : "border-zinc-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
      }`}
    >
      <div className="flex min-w-[140px] flex-1 basis-0 flex-col gap-1">
        <label className="type-label ml-1">Employee</label>
        <Select
          options={employeeOptions}
          styles={selectStyles}
          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
          placeholder="All Employees..."
          value={employeeOptions.find((opt) => opt.value === selectedEmployee)}
          onChange={(selected) => setSelectedEmployee(selected?.value || "")}
          isSearchable
          isClearable
        />
      </div>

      {leaveTypeOptions ? (
        <div className="flex min-w-[130px] flex-1 basis-0 flex-col gap-1">
          <label className="type-label ml-1">Leave Type</label>
          <Select
            options={leaveTypeOptions}
            styles={selectStyles}
            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
            placeholder="All leave types"
            value={
              leaveTypeOptions.find((opt) => opt.value === leaveTypeId) ||
              leaveTypeOptions[0]
            }
            onChange={(selected) => setLeaveTypeId?.(selected?.value || "")}
            isSearchable
            isClearable
          />
        </div>
      ) : null}

      <div className="flex shrink-0 flex-col gap-1">
        <label className="type-label ml-1">Period</label>
        <div
          className={`flex h-[38px] items-center rounded-xl p-1 ${
            dark ? "bg-zinc-800" : "bg-zinc-50"
          }`}
        >
          {["today", "month", "custom"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setViewType(type)}
              className={`h-full cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize transition-all
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
              {type}
            </button>
          ))}
        </div>
      </div>

      {viewType === "month" && periodOptions.length > 0 && (
        <div className="flex min-w-[200px] flex-[1.3] basis-0 flex-col gap-1">
          <label className="type-label ml-1">Pay Cycle</label>
          <CrmSelect
            options={periodOptions}
            value={period}
            onChange={(v) => setPeriod?.(v)}
          />
        </div>
      )}

      {viewType === "custom" && (
        <div className="flex shrink-0 flex-col gap-1">
          <label className="type-label ml-1">Date Range</label>
          <div className="flex items-center gap-1.5">
            <div className="w-[132px]">
              <LeaveDateField
                compact
                placeholder="Start"
                value={customRange.start}
                onChange={(start) => setCustomRange({ ...customRange, start })}
              />
            </div>
            <div className="w-[132px]">
              <LeaveDateField
                compact
                placeholder="End"
                value={customRange.end}
                onChange={(end) => setCustomRange({ ...customRange, end })}
              />
            </div>
          </div>
        </div>
      )}

      {showClearBtn && (
        <button
          type="button"
          onClick={onClear}
          className="mb-0 flex h-[38px] shrink-0 cursor-pointer items-center justify-center self-end rounded-xl border border-rose-800/70 bg-[#3a1518] px-3 text-xs font-medium tracking-wide text-rose-300 transition-all hover:border-rose-700 hover:bg-[#4a1c20] hover:text-rose-200"
        >
          CLEAR
        </button>
      )}
    </div>
  );
});

export default FiltersBar;