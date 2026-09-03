"use client";

import { Search } from "lucide-react";
import { fleet } from "./fleetTheme";
import CrmSelect from "@/app/_Components/ui/CrmSelect";

const SORT_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

export default function FleetFilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  status,
  onStatusChange,
  statusOptions,
  sortOrder,
  onSortChange,
  extra,
}) {
  return (
    <div className={fleet.filterBar}>
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={`${fleet.input} pl-9`}
        />
      </div>
      {statusOptions && (
        <CrmSelect
          className="w-full lg:w-44 shrink-0"
          variant="pill"
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
          placeholder="Status"
        />
      )}
      {onSortChange && (
        <CrmSelect
          className="w-full lg:w-44 shrink-0"
          variant="pill"
          options={SORT_OPTIONS}
          value={sortOrder}
          onChange={onSortChange}
          placeholder="Sort"
        />
      )}
      {extra}
    </div>
  );
}
