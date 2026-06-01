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
          <tr key={i} className="border-b border-zinc-100">
            {[1, 2, 3, 4, 5, 6].map((c) => (
              <td key={c} className="px-4 py-4">
                <div className="h-3 bg-zinc-100 rounded-full animate-pulse w-24" />
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
              className={`border-b border-zinc-100 transition-colors duration-100 ${
                isWeekend
                  ? "bg-indigo-50/30"
                  : isAbsent
                  ? "bg-rose-50/20"
                  : "hover:bg-zinc-50/80"
              }`}
            >
              {/* Employee */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={emp?.fullName} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-extrabold text-zinc-700 capitalize truncate">
                      {emp?.fullName || "Unknown"}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-medium capitalize">
                      {emp?.designation}
                    </span>
                  </div>
                </div>
              </td>

              {/* Shift Date */}
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-zinc-600">
                    {moment(record?.shiftDate || queryParams?.startDate).format(
                      "DD MMM, YYYY"
                    )}
                  </span>
                  <span
                    className={`text-[9px] font-semibold uppercase tracking-wider ${
                      isWeekend ? "text-indigo-400" : "text-zinc-400"
                    }`}
                  >
                    {moment(record?.shiftDate || queryParams?.startDate).format(
                      "ddd"
                    )}
                  </span>
                </div>
              </td>

              {/* In/Out */}
              <td className="px-4 py-3">
                {isWeekend ? (
                  <span className="text-zinc-300 font-bold text-[11px]">
                    -- : --
                  </span>
                ) : isAbsent ? (
                  <span className="text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg text-[10px] font-black">
                    ABSENT
                  </span>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold tabular-nums">
                      {formatTimeOnly(record?.timeIn)}
                    </span>
                    <span className="text-zinc-300 text-xs">→</span>
                    {record?.timeOut ? (
                      <span className="text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg text-[11px] font-bold tabular-nums">
                        {formatTimeOnly(record.timeOut)}
                      </span>
                    ) : isDiscrepancy ? (
                      <Tooltip text="Missing Time-Out — contact manager">
                        <span className="text-orange-500 font-bold flex items-center gap-1 text-[9px] border border-orange-200 bg-orange-50 px-2 py-1 rounded-lg cursor-help">
                          <AlertCircle size={10} /> DISCREPANCY
                        </span>
                      </Tooltip>
                    ) : isActive ? (
                      <span className="bg-zinc-800 text-white px-2.5 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 animate-pulse border border-zinc-700">
                        <Zap size={8} className="fill-white" /> LIVE
                      </span>
                    ) : (
                      <span className="text-zinc-300 text-[11px] font-bold">
                        --:--
                      </span>
                    )}
                  </div>
                )}
              </td>

              {/* Work Hours */}
              <td className="px-4 py-3">
                {isWeekend || isAbsent ? (
                  <span className="text-zinc-300 text-[10px] font-bold">
                    — : —
                  </span>
                ) : (
                  <div className="flex flex-col gap-0.5 min-w-[110px]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[9px] text-zinc-400 font-black uppercase tracking-tighter">
                        Total
                      </span>
                      <span className="text-[10px] font-bold text-zinc-600 tabular-nums">
                        {calculateDuration(record?.timeIn, record?.timeOut)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[9px] text-zinc-400 font-black uppercase tracking-tighter">
                        Working
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 tabular-nums">
                        {onlyWorkingHours(
                          record?.timeIn,
                          record?.timeOut,
                          record?.totalBreakMinutes
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[9px] text-zinc-400 font-black uppercase tracking-tighter flex items-center gap-0.5">
                        <Coffee size={8} /> Break
                      </span>
                      <span className="text-[10px] font-bold text-amber-500 tabular-nums">
                        {record?.totalBreakMinutes >= 0
                          ? formatBreakMinutes(record.totalBreakMinutes)
                          : "0m"}
                      </span>
                    </div>
                  </div>
                )}
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {isWeekend
                    ? "Off"
                    : cfg.label || record?.status || "absent"}
                </span>
              </td>

              {/* Action */}
              <td className="px-4 py-3">
                {isWeekend ? (
                  <span className="text-zinc-300 text-[10px] font-bold">—</span>
                ) : isAbsent ? (
                  <button
                    onClick={() =>
                      handleOpenModal(emp, record, queryParams?.startDate)
                    }
                    className="cursor-pointer text-[9px] font-black text-zinc-700 hover:text-white hover:bg-zinc-800 border border-zinc-200 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap"
                  >
                    MARK PRESENT
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleOpenModal(emp, record, record.shiftDate)
                    }
                    className="cursor-pointer p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-all"
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
              <div className="p-4 rounded-full bg-zinc-100">
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