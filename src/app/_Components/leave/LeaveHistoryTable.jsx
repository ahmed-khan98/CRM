"use client";

import { Check, Eye, X } from "lucide-react";
import { Avatar } from "@/app/_Components/attendence/TeamAttendance/Avatar";
import Tooltip from "@/app/_Components/ui/Tooltip";
import LeaveStatusBadge from "./LeaveStatusBadge";
import { formatLeaveDay, formatLeaveName } from "./leaveUi";

export default function LeaveHistoryTable({
  rows = [],
  loading,
  showEmployee = false,
  canAct = false,
  onView,
  onApprove,
  onReject,
}) {
  return (
    <div className="crm-table-wrap -mx-1 h-full min-h-[280px] md:mx-0">
      <div
        className="h-full overflow-auto scrollbar-thin scrollbar-thumb-zinc-200"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#52525b transparent" }}
      >
        <table className="crm-table w-full text-left border-collapse min-w-[760px]">
          <thead className="sticky top-0 z-20">
            <tr className="table-head-row">
                {["Employee", "Leave Type", "Date", "Days", "Reason", "Status", "Action"].map((h) => (
                  <th
                    key={h}
                    className="table-head-cell"
                  >
                    {h}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-zinc-800">
                  {Array.from({ length: 7 }).map((__, c) => (
                    <td key={c} className="px-4 py-4">
                      <div className="h-3 w-24 animate-pulse rounded-full bg-zinc-700" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-zinc-400"
                >
                  No leave requests found
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const emp = row.employeeId;
                const pending = row.status === "pending";
                return (
                  <tr
                    key={row._id}
                    className="border-b border-zinc-800 cursor-pointer"
                    onClick={() => onView?.(row)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={emp?.fullName} />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-semibold capitalize text-zinc-900">
                            {formatLeaveName(emp?.fullName)}
                          </span>
                          <span className="text-xs font-medium capitalize text-zinc-400">
                            {emp?.designation}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900">
                      {row.leaveTypeId?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-zinc-500">
                      {formatLeaveDay(row)}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-zinc-900">
                      {row.days}
                    </td>
                    <td className="px-4 py-3 max-w-[180px] truncate text-xs text-zinc-500">
                      {row.reason || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <LeaveStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        {canAct && pending ? (
                          <>
                            <Tooltip label="Approve">
                              <button
                                type="button"
                                onClick={() => onApprove?.(row)}
                                className="rounded-xl border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-50"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            </Tooltip>
                            <Tooltip label="Reject">
                              <button
                                type="button"
                                onClick={() => onReject?.(row)}
                                className="rounded-xl border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-50"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip label="View">
                            <button
                              type="button"
                              onClick={() => onView?.(row)}
                              className="rounded-xl border border-zinc-200 bg-white p-1.5 text-zinc-500 hover:bg-zinc-700"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
