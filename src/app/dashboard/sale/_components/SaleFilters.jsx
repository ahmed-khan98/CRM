"use client";

import { memo, useMemo } from "react";
import { Filter, RotateCcw } from "lucide-react";
import CrmSelect from "@/app/_Components/ui/CrmSelect";

function FilterField({ label, children }) {
  return (
    <label className="space-y-1.5">
      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

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
  const monthOptions = useMemo(
    () => [
      { value: "all", label: "All Months" },
      ...months.map((month) => ({
        value: month?._id,
        label: `${month?.monthCode || month?.name}${
          month?.status === "OPEN" ? " (Open)" : ""
        }`,
      })),
    ],
    [months]
  );

  const departmentOptions = useMemo(
    () => [
      {
        value: "",
        label: canFilterDepartment ? "All Departments" : "Your Department",
      },
      ...departments.map((department) => ({
        value: department?._id,
        label: department?.name,
      })),
    ],
    [departments, canFilterDepartment]
  );

  const employeeOptions = useMemo(
    () => [
      {
        value: "",
        label: isEmployeeLoading
          ? "Loading employees..."
          : "All Sellers / Agents",
      },
      ...employees.map((employee) => ({
        value: employee?._id,
        label: employee?.fullName,
      })),
    ],
    [employees, isEmployeeLoading]
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Status" },
      { value: "paid", label: "Paid" },
      { value: "charge back", label: "Charge Back" },
    ],
    []
  );

  const typeOptions = useMemo(
    () => [
      { value: "", label: "All Sale Types" },
      { value: "FRESH", label: "Fresh" },
      { value: "UP SELL", label: "Up Sell" },
    ],
    []
  );

  return (
    <div className="rounded-3xl border border-zinc-800/70 bg-gradient-to-br from-zinc-900 to-zinc-950 p-3 shadow-2xl sm:p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
            <Filter className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
              Filters
            </p>
            <h3 className="text-sm font-black leading-tight text-zinc-100">
              Month wise sale overview
            </h3>
          </div>
        </div>

        {openMonth ? (
          <span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-400">
            Open Month: {openMonth.monthCode || openMonth.name}
          </span>
        ) : (
          <span className="w-fit rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold text-red-400">
            No open month
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <FilterField label="Month">
          <CrmSelect
            variant="dark"
            options={monthOptions}
            value={filters.monthId}
            onChange={(v) => onFilterChange("monthId", v)}
            isSearchable
          />
        </FilterField>

        <FilterField label="Department">
          <CrmSelect
            variant="dark"
            options={departmentOptions}
            value={filters.departmentId}
            onChange={(v) => onFilterChange("departmentId", v)}
            isDisabled={!canFilterDepartment}
            isSearchable
          />
        </FilterField>

        <FilterField label="Seller / Agent">
          <CrmSelect
            variant="dark"
            options={employeeOptions}
            value={filters.employeeId}
            onChange={(v) => onFilterChange("employeeId", v)}
            isDisabled={!canFilterEmployee}
            isSearchable
          />
        </FilterField>

        <FilterField label="Status">
          <CrmSelect
            variant="dark"
            options={statusOptions}
            value={filters.status}
            onChange={(v) => onFilterChange("status", v)}
          />
        </FilterField>

        <FilterField label="Sale Type">
          <CrmSelect
            variant="dark"
            options={typeOptions}
            value={filters.type}
            onChange={(v) => onFilterChange("type", v)}
          />
        </FilterField>

        <button
          type="button"
          onClick={onReset}
          className="flex h-11 cursor-pointer items-center justify-center gap-2 self-end rounded-xl border border-zinc-700 bg-zinc-800 px-3 text-xs font-black text-zinc-200 transition hover:bg-zinc-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

export default memo(SaleFilters);
