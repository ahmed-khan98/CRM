import React from "react";
const TABLE_HEADERS = [
  "Date",
  "In / Out",
  "Total Hours",
  "Working Hours",
  "Break",
  "Status",
];
import AttendanceRow from "./AttendanceRow";
import { Calendar } from "lucide-react";
const AttendanceTable = React.memo(
  ({ isFetching, tableData, activeFilter }) => {
    return (
      <div className="-mx-1 flex-1 overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)] md:mx-0 md:border md:border-zinc-200">
        <div
          className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-180px)]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#52525b transparent",
          }}
        >
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead className="sticky top-0 z-20">
              <tr className="bg-zinc-800 border-b border-zinc-700">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[10px] font-black text-zinc-300 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-100">
                    {TABLE_HEADERS.map((h) => (
                      <td key={h} className="px-5 py-4">
                        <div className="h-3 bg-zinc-100 rounded-full animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : tableData.length > 0 ? (
                tableData.map((row) => (
                  <AttendanceRow key={row.date} row={row} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={TABLE_HEADERS.length}
                    className="py-24 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-zinc-100">
                        <Calendar className="h-7 w-7 text-zinc-400" />
                      </div>
                      <p className="text-zinc-500 font-semibold text-sm">
                        No records found
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
      </div>
    );
  },
);

export default AttendanceTable;
