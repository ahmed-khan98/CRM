"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
import EmptyState from "./EmptyState";
import DataTableToolbar from "./DataTableToolbar";
import EntityCell from "./EntityCell";
import RowActionsMenu, { IconActionButton } from "./RowActionsMenu";

export { EntityCell, RowActionsMenu, IconActionButton, DataTableToolbar };

/** Legacy class tokens for pages not yet migrated to <DataTable />. */
export const tableWrap = "crm-table-wrap";
export const thClass = "table-head-cell text-left";
export const theadRow = "table-head-row";
export const trHover = "transition-colors hover:bg-zinc-800";

function defaultGetRowId(row, index) {
  return String(row?._id ?? row?.id ?? index);
}

function alignClass(align) {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

function isActionsColumn(column) {
  return (
    column.key === "action" ||
    column.key === "actions" ||
    column.type === "actions"
  );
}

function isIndexColumn(column) {
  return column.key === "sr" || column.key === "index";
}

function cellContent(column, row, index) {
  if (typeof column.render === "function") return column.render(row, index);
  const value = row?.[column.key];
  if (value == null || value === "") return "—";
  return value;
}

function SortIcon({ active, direction }) {
  if (!active) {
    return <ChevronsUpDown className="h-3 w-3 text-zinc-600" />;
  }
  return direction === "desc" ? (
    <ChevronDown className="h-3 w-3 text-zinc-400" />
  ) : (
    <ChevronUp className="h-3 w-3 text-zinc-400" />
  );
}

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyState,
  pagination,
  rowSelection,
  onRowClick,
  sortConfig,
  getRowId = defaultGetRowId,
  getRowClassName,
  minWidth,
  maxHeight = "calc(100vh - 220px)",
  className = "",
  skeletonRows = 8,
}) {
  const selectAllRef = useRef(null);
  const rows = Array.isArray(data) ? data : [];
  const selectedKeys = rowSelection?.selectedKeys || [];
  const selectedSet = useMemo(() => new Set(selectedKeys.map(String)), [selectedKeys]);

  const rowIds = useMemo(
    () => rows.map((row, index) => String(getRowId(row, index))),
    [rows, getRowId]
  );

  const allSelected =
    rowIds.length > 0 && rowIds.every((id) => selectedSet.has(id));
  const someSelected = rowIds.some((id) => selectedSet.has(id));

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  const visibleColumns = columns.filter(Boolean);
  const colSpan =
    visibleColumns.length + (rowSelection ? 1 : 0) || 1;

  const toggleRow = (id) => {
    if (!rowSelection?.onChange) return;
    const key = String(id);
    const next = selectedSet.has(key)
      ? selectedKeys.filter((item) => String(item) !== key)
      : [...selectedKeys, id];
    rowSelection.onChange(next);
  };

  const toggleAll = () => {
    if (!rowSelection?.onChange) return;
    rowSelection.onChange(allSelected ? [] : rowIds);
  };

  const handleSort = (column) => {
    if (!column.sortable || !sortConfig?.onSortChange) return;
    sortConfig.onSortChange(column.key);
  };

  const renderHeader = () => (
    <thead className="sticky top-0 z-20">
      <tr className="table-head-row">
        {rowSelection ? (
          <th className="w-10 px-3 py-3">
            <input
              ref={selectAllRef}
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              aria-label="Select all rows"
              className="h-3.5 w-3.5 cursor-pointer rounded border-zinc-600 bg-zinc-900"
            />
          </th>
        ) : null}
        {visibleColumns.map((column) => {
          const active = sortConfig?.sortBy === column.key;
          return (
            <th
              key={column.key}
              style={
                column.width
                  ? {
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width,
                    }
                  : undefined
              }
              className={`table-head-cell ${alignClass(
                column.align
              )} ${column.headerClassName || ""}`}
            >
              {column.sortable ? (
                <button
                  type="button"
                  onClick={() => handleSort(column)}
                  className="inline-flex items-center gap-1 hover:text-zinc-100"
                >
                  {column.label}
                  <SortIcon
                    active={active}
                    direction={sortConfig?.sortDirection}
                  />
                </button>
              ) : (
                column.label
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );

  const renderSkeleton = () =>
    Array.from({ length: skeletonRows }).map((_, rowIndex) => (
      <tr key={`sk-${rowIndex}`} className="border-b border-zinc-800">
        {rowSelection ? (
          <td className="px-3 py-4">
            <div className="h-3.5 w-3.5 animate-pulse rounded bg-zinc-700" />
          </td>
        ) : null}
        {visibleColumns.map((column, colIndex) => (
          <td key={column.key || colIndex} className="px-4 py-4">
            <div
              className="h-3 animate-pulse rounded-full bg-zinc-700"
              style={{ width: `${40 + ((rowIndex + colIndex) % 4) * 14}%` }}
            />
          </td>
        ))}
      </tr>
    ));

  const renderRows = () =>
    rows.map((row, index) => {
      const id = String(getRowId(row, index));
      const extraClass = getRowClassName?.(row, index) || "";
      return (
        <tr
          key={id}
          onClick={onRowClick ? () => onRowClick(row, index) : undefined}
          className={`border-b border-zinc-800 transition-colors hover:bg-zinc-800 ${
            selectedSet.has(id) ? "bg-zinc-800/60" : ""
          } ${onRowClick ? "cursor-pointer" : ""} ${extraClass}`}
        >
          {rowSelection ? (
            <td
              className="px-3 py-3"
              onClick={(event) => event.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={selectedSet.has(id)}
                onChange={() => toggleRow(id)}
                aria-label="Select row"
                className="h-3.5 w-3.5 cursor-pointer rounded border-zinc-600 bg-zinc-900"
              />
            </td>
          ) : null}
          {visibleColumns.map((column) => (
            <td
              key={column.key}
              onClick={
                isActionsColumn(column)
                  ? (event) => event.stopPropagation()
                  : undefined
              }
              style={
                column.width
                  ? {
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width,
                    }
                  : undefined
              }
              className={`px-3 py-3 text-[13px] text-zinc-100 ${
                column.wrap ? "whitespace-normal break-words" : "whitespace-nowrap"
              } ${alignClass(column.align)} ${column.className || ""}`}
            >
              {cellContent(column, row, index)}
            </td>
          ))}
        </tr>
      );
    });

  const primaryColumn =
    visibleColumns.find(
      (column) => !isActionsColumn(column) && !isIndexColumn(column)
    ) || visibleColumns[0];
  const actionsColumn = visibleColumns.find(isActionsColumn);
  const mobileMetaColumns = visibleColumns.filter(
    (column) =>
      column !== primaryColumn &&
      !isActionsColumn(column) &&
      !isIndexColumn(column) &&
      !column.mobileHidden
  );

  const renderMobileCards = () =>
    rows.map((row, index) => {
      const id = String(getRowId(row, index));
      return (
        <div
          key={id}
          onClick={onRowClick ? () => onRowClick(row, index) : undefined}
          className={`rounded-2xl border border-zinc-800 bg-zinc-900 p-3 shadow-none ${
            onRowClick ? "cursor-pointer" : ""
          }`}
        >
          <div className="mb-2.5 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {rowSelection ? (
                <div className="mb-2" onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedSet.has(id)}
                    onChange={() => toggleRow(id)}
                    className="h-3.5 w-3.5 cursor-pointer rounded border-zinc-600 bg-zinc-900"
                  />
                </div>
              ) : null}
              {primaryColumn ? cellContent(primaryColumn, row, index) : null}
            </div>
            {actionsColumn ? (
              <div onClick={(event) => event.stopPropagation()}>
                {cellContent(actionsColumn, row, index)}
              </div>
            ) : null}
          </div>
          {mobileMetaColumns.length > 0 ? (
            <div className="flex flex-col gap-2 border-t border-zinc-800 pt-2.5">
              {mobileMetaColumns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-start justify-between gap-3 text-xs"
                >
                  <span className="font-medium text-zinc-400">
                    {column.label}
                  </span>
                  <span className="text-right font-semibold text-zinc-100">
                    {cellContent(column, row, index)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    });

  const emptyInside =
    !loading &&
    rows.length === 0 &&
    emptyState &&
    (emptyState.icon || emptyState.title || emptyState.description);

  const footer = pagination ? (
    <div className="flex flex-col gap-3 border-t border-zinc-800 bg-[#121212] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-500">
        Showing{" "}
        <span className="font-semibold text-zinc-100">
          {pagination.totalRows
            ? Math.min(
                (pagination.page - 1) * pagination.pageSize + 1,
                pagination.totalRows
              )
            : 0}
          –
          {Math.min(
            pagination.page * pagination.pageSize,
            pagination.totalRows || 0
          )}
        </span>{" "}
        of {pagination.totalRows || 0}
      </p>
      <div className="flex items-center gap-2">
        {pagination.onPageSizeChange ? (
          <select
            value={pagination.pageSize}
            onChange={(event) =>
              pagination.onPageSizeChange(Number(event.target.value))
            }
            className="h-8 rounded-lg border border-zinc-700 bg-zinc-900 px-2 text-xs text-zinc-200"
          >
            {(pagination.pageSizeOptions || [10, 25, 50, 100]).map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        ) : null}
        <button
          type="button"
          disabled={pagination.page <= 1}
          onClick={() => pagination.onPageChange?.(pagination.page - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={
            pagination.page * pagination.pageSize >= (pagination.totalRows || 0)
          }
          onClick={() => pagination.onPageChange?.(pagination.page + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className={`space-y-3 ${className}`}>
      {rowSelection && selectedKeys.length > 0 ? (
        <DataTableToolbar
          selectedCount={selectedKeys.length}
          actions={rowSelection.actions || []}
        />
      ) : null}

      <div className="crm-table-wrap">
        <div className="md:hidden space-y-2.5 p-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl bg-zinc-800"
              />
            ))
          ) : emptyInside ? (
            <EmptyState
              icon={emptyState.icon}
              title={emptyState.title}
              description={emptyState.description}
              action={
                emptyState.actionLabel && emptyState.onAction ? (
                  <button
                    type="button"
                    onClick={emptyState.onAction}
                    className="mt-4 inline-flex h-9 items-center rounded-lg bg-ink px-3 text-sm font-medium text-white"
                  >
                    {emptyState.actionLabel}
                  </button>
                ) : (
                  emptyState.action
                )
              }
            />
          ) : (
            renderMobileCards()
          )}
        </div>

        <div
          className="hidden overflow-x-auto overflow-y-auto md:block"
          style={{
            maxHeight,
            scrollbarWidth: "thin",
            scrollbarColor: "#52525b transparent",
          }}
        >
          <table
            className="min-w-full border-collapse"
            style={minWidth ? { minWidth } : undefined}
          >
            {renderHeader()}
            <tbody>
              {loading ? (
                renderSkeleton()
              ) : emptyInside ? (
                <tr>
                  <td colSpan={colSpan} className="p-0">
                    <EmptyState
                      icon={emptyState.icon}
                      title={emptyState.title}
                      description={emptyState.description}
                      action={
                        emptyState.actionLabel && emptyState.onAction ? (
                          <button
                            type="button"
                            onClick={emptyState.onAction}
                            className="mt-4 inline-flex h-9 items-center rounded-lg bg-ink px-3 text-sm font-medium text-white"
                          >
                            {emptyState.actionLabel}
                          </button>
                        ) : (
                          emptyState.action
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                renderRows()
              )}
            </tbody>
          </table>
        </div>
        {footer}
      </div>
    </div>
  );
}
