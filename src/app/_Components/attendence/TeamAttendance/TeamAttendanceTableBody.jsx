"use client";

import React from "react";
import { AlertCircle, Edit3, Calendar, Zap, Coffee } from "lucide-react";
import moment from "moment-timezone";
import {
  calculateDuration,
  formatBreakMinutes,
  formatTimeOnly,
  onlyWorkingHours,
  Tooltip,
  getStatusConfig,
  isDiscrepancyRecord,
} from "@/app/utilities/attendence";
import { Avatar } from "@/app/_Components/attendence/TeamAttendance/Avatar";

const TeamAttendanceTableBody = ({
  isFetching,
  filteredRows,
  queryParams,
  handleOpenModal,
  activeFilter,
}) => {
  return (
    <tbody>
      {isFetching ? (
        Array.from({ length: 7 }).map((_, i) => (
          <tr key={i} className="border-b border-zinc-200">
            {[1, 2, 3, 4, 5, 6].map((c) => (
              <td key={c} className="px-4 py-4">
                <div className="h-3 bg-zinc-50 rounded-full animate-pulse w-24" />
              </td>
            ))}
          </tr>
        ))
      ) : filteredRows.length > 0 ? (
        filteredRows.map((item) => {
          const emp = item?.employeeId;
          const record = item?.record;
          const isAbsent = item?.isAbsent;
          const isWeekend = record?.status === "weekend" || item?.isWeekend;

          const now = moment().tz("Asia/Karachi");
          const shiftEffectiveDate =
            now.hour() < 5
              ? now.clone().subtract(1, "days").format("YYYY-MM-DD")
              : now.format("YYYY-MM-DD");
          const recordDateStr = moment(record?.shiftDate).format("YYYY-MM-DD");
          const isToday = recordDateStr === shiftEffectiveDate;

          const isDiscrepancy = isDiscrepancyRecord(record);
          const isActive =
            record?.timeIn &&
            !record?.timeOut &&
            isToday &&
            !isDiscrepancy;

          const uniqueRowKey =
            record?._id ||
            `${emp?._id}-${record?.shiftDate || queryParams?.startDate}`;
          const cfg = getStatusConfig(
            isWeekend
              ? "weekend"
              : record?.status || (isAbsent ? "absent" : "upcoming")
          );

          return (
            <tr
              key={uniqueRowKey}
              className={`border-b border-zinc-800 transition-colors duration-100 ${
                isWeekend
                  ? "bg-violet-500/10"
                  : isAbsent
                  ? "bg-rose-500/10"
                  : "hover:bg-zinc-800/50"
              }`}
            >
              {/* Employee */}
              <td className="px-3 py-0.2">
                <div className="flex items-center gap-2.5">
                  <Avatar name={emp?.fullName} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-zinc-100 capitalize truncate">
                      {emp?.fullName || "Unknown"}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium capitalize">
                      {emp?.designation}
                    </span>
                  </div>
                </div>
              </td>

              {/* Shift Date */}
              <td className="px-3 py-0.2">
                <div className="flex flex-col gap-0">
                  <span className="text-[11px] font-medium text-zinc-100">
                    {moment(record?.shiftDate || queryParams?.startDate).format(
                      "DD MMM, YYYY"
                    )}
                  </span>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wider ${
                      isWeekend ? "text-violet-300" : "text-zinc-400"
                    }`}
                  >
                    {moment(record?.shiftDate || queryParams?.startDate).format(
                      "ddd"
                    )}
                  </span>
                </div>
              </td>

              {/* In/Out */}
              <td className="px-3 py-0.2">
                {isWeekend ? (
                  <span className="text-zinc-300 font-medium text-[10px]">
                    -- : --
                  </span>
                ) : isAbsent ? (
                  <span className="text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md text-[10px] font-medium">
                    ABSENT
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5  rounded-md text-[10px] font-medium tabular-nums">
                      {formatTimeOnly(record?.timeIn)}
                    </span>
                    <span className="text-zinc-300 text-[10px]">→</span>
                    {record?.timeOut ? (
                      <span className="text-rose-600 bg-rose-50 border border-rose-200 px-1.5  rounded-md text-[10px] font-medium tabular-nums">
                        {formatTimeOnly(record.timeOut)}
                      </span>
                    ) : isDiscrepancy ? (
                      <Tooltip text="Missing Time-Out — contact manager">
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-medium uppercase tracking-wider text-amber-400 border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 rounded-full cursor-help">
                          <AlertCircle size={9} /> DISCREPANCY
                        </span>
                      </Tooltip>
                    ) : isActive ? (
                      <span className="bg-zinc-800 text-white px-2  rounded-md text-[9px] font-medium flex items-center gap-0.5 animate-pulse border border-zinc-700">
                        <Zap size={8} className="fill-white" /> LIVE
                      </span>
                    ) : (
                      <span className="text-zinc-300 text-[10px] font-medium">
                        --:--
                      </span>
                    )}
                  </div>
                )}
              </td>

              {/* Work Hours */}
              <td className="px-3 py-0.2">
                {isWeekend || isAbsent ? (
                  <span className="text-zinc-300 text-[10px] font-medium">
                    — : —
                  </span>
                ) : (
                  <div className="flex flex-col gap-0">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="text-[9px] text-zinc-400 font-medium uppercase tracking-tighter">
                        Total
                      </span>
                      <span className="text-[10px] font-medium text-zinc-500 tabular-nums">
                        {calculateDuration(record?.timeIn, record?.timeOut)}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5">
                      <span className="text-[9px] text-zinc-400 font-medium uppercase tracking-tighter">
                        Working
                      </span>
                      <span className="text-[10px] font-medium text-emerald-700 tabular-nums">
                        {onlyWorkingHours(
                          record?.timeIn,
                          record?.timeOut,
                          record?.totalBreakMinutes
                        )}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5">
                      <span className="text-[9px] text-zinc-400 font-medium uppercase tracking-tighter inline-flex items-center gap-0.5">
                        <Coffee size={8} /> Break
                      </span>
                      <span className="text-[10px] font-medium text-amber-700 tabular-nums">
                        {record?.totalBreakMinutes >= 0
                          ? formatBreakMinutes(record.totalBreakMinutes)
                          : "0m"}
                      </span>
                    </div>
                  </div>
                )}
              </td>

              {/* Status */}
              <td className="px-3 py-0.2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {isWeekend
                    ? "Off"
                    : cfg.label || record?.status || "absent"}
                </span>
              </td>

              {/* Action */}
              <td className="px-3 py-0.2">
                {isWeekend ? (
                  <span className="text-zinc-300 text-xs font-medium">—</span>
                ) : isAbsent ? (
                  <button
                    onClick={() =>
                      handleOpenModal(emp, record, queryParams?.startDate)
                    }
                    className="cursor-pointer text-xs font-medium text-zinc-900 hover:text-white hover:bg-zinc-800 border border-zinc-200 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap"
                  >
                    MARK PRESENT
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleOpenModal(emp, record, record.shiftDate)
                    }
                    className="cursor-pointer p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-all"
                  >
                    <Edit3 size={13} />
                  </button>
                )}
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan={6} className="py-24 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-zinc-50">
                <Calendar className="h-7 w-7 text-zinc-400" />
              </div>
              <p className="text-zinc-500 font-semibold text-sm">
                No records found
              </p>
              <p className="text-zinc-400 text-xs">
                {activeFilter
                  ? "No matching records for this filter"
                  : "Try changing the date or employee filter"}
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default React.memo(TeamAttendanceTableBody);