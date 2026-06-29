"use client";

import { memo } from "react";
import { Filter, RotateCcw } from "lucide-react";

const selectClass =
  "h-10 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-xs font-semibold text-zinc-200 outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60";

function SaleFilters({
  filters,
  months = [],
  departments = [],
  employees = [],
  openMonth,
  canFilterDepartment,
  canFilterEmployee,
  isEmployeeLoading,
  onFilterChange,
  onReset,
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900 p-4 shadow-2xl">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
            <Filter className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">
              Filters
            </p>
            <h3 className="text-sm font-black text-zinc-100">
              Month wise sale overview
            </h3>
          </div>
        </div>

        {openMonth ? (
          <span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
            Open Month: {openMonth.monthCode || openMonth.name}
          </span>
        ) : (
          <span className="w-fit rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold text-red-400">
            No open month
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        <select
          value={filters.monthId}
          onChange={(event) => onFilterChange("monthId", event.target.value)}
          className={selectClass}
        >
          <option value="all">All Months</option>
          {months.map((month) => (
            <option key={month?._id} value={month?._id}>
              {month?.monthCode || month?.name}
              {month?.status === "OPEN" ? " (Open)" : ""}
            </option>
          ))}
        </select>

        <select
          value={filters.departmentId}
          disabled={!canFilterDepartment}
          onChange={(event) =>
            onFilterChange("departmentId", event.target.value)
          }
          className={selectClass}
        >
          <option value="">
            {canFilterDepartment ? "All Departments" : "Your Department"}
          </option>
          {departments.map((department) => (
            <option key={department?._id} value={department?._id}>
              {department?.name}
            </option>
          ))}
        </select>

        <select
          value={filters.employeeId}
          disabled={!canFilterEmployee}
          onChange={(event) => onFilterChange("employeeId", event.target.value)}
          className={selectClass}
        >
          <option value="">
            {isEmployeeLoading ? "Loading employees..." : "All Sellers / Agents"}
          </option>
          {employees.map((employee) => (
            <option key={employee?._id} value={employee?._id}>
              {employee?.fullName}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(event) => onFilterChange("status", event.target.value)}
          className={selectClass}
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="charge back">Charge Back</option>
        </select>

        <select
          value={filters.type}
          onChange={(event) => onFilterChange("type", event.target.value)}
          className={selectClass}
        >
          <option value="">All Sale Types</option>
          <option value="FRESH">Fresh</option>
          <option value="UP SELL">Up Sell</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-3 text-xs font-black text-zinc-200 transition hover:bg-zinc-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

export default memo(SaleFilters);
