"use client";

import { Search } from "lucide-react";
import { fleet } from "./fleetTheme";

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
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`${fleet.select} w-full lg:w-40 shrink-0`}
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      {onSortChange && (
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className={`${fleet.select} w-full lg:w-40 shrink-0`}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      )}
      {extra}
    </div>
  );
}
