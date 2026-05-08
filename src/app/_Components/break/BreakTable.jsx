import { ArrowUpDown, ChevronLeft, ChevronRight, Coffee } from 'lucide-react';
import React from 'react'
import BreakRow from './BreakRow';
import SkeletonRow from './SkeletonRow';
import Pagination from '../PaginationComponent/Pagination';
const MemoPagination = React.memo(Pagination);

const HEADERS = [
  "Date",
  "Employee",
  "Break In",
  "Break Out",
  "Duration",
  "Type",
  "Status",
  "Reason",
];

const BreakTable = ({isFetching,tableData,activeFilter,meta,onPageChange}) => {
  return (
      <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
        <div
          className="overflow-x-auto"
            // style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead className="sticky top-0 z-20">
              <tr className="bg-zinc-800 border-b border-zinc-700">
                {HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[10px] font-black text-zinc-300 uppercase tracking-widest whitespace-nowrap"
                  >
                    <span className="flex items-center gap-1">
                      {h}
                      {["Break In", "Break Out", "Duration"].includes(h) && (
                        <ArrowUpDown size={9} className="text-zinc-500" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonRow key={i} cols={HEADERS.length} />
                ))
              ) : tableData.length > 0 ? (
                tableData.map((item) => <BreakRow key={item._id} item={item} />)
              ) : (
                <tr>
                  <td colSpan={HEADERS.length} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-zinc-100">
                        <Coffee className="h-7 w-7 text-zinc-400" />
                      </div>
                      <p className="text-zinc-500 font-semibold text-sm">
                        No break records found
                      </p>
                      <p className="text-zinc-400 text-xs">
                        {activeFilter
                          ? "No matching records for this filter"
                          : "Try adjusting your date range"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isFetching && (
          <MemoPagination meta={meta} onPageChange={onPageChange} />
          // <Pagination meta={meta} page={page} setPage={setPage} />
        )}
      </div>
  )
}

export default BreakTable
