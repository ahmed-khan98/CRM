import React, { useMemo } from "react";
import {
  formatDay,
  formatDuration,
  formatOnlyDate,
  toLocal,
} from "@/app/utilities/date";
import { getStatusConfig } from "@/app/utilities/attendence";
import moment from "moment-timezone";
import Tooltip from "@/app/_Components/ui/Tooltip";
const TZ = "Asia/Karachi";

const BreakRow = ({ item }) => {
  const typeCfg = useMemo(() => getStatusConfig(item.type), [item.type]);
  const statusCfg = useMemo(() => getStatusConfig(item.status), [item.status]);

  const isActive = item.status === "break-in";
  const localDate = item?.shiftDate ? moment(item?.shiftDate).tz(TZ) : null;
  const isToday = localDate ? localDate.isSame(moment().tz(TZ), "day") : false;

  return (
    <tr
      className={`group border-b border-zinc-100 transition-colors duration-100
          ${isToday ? "bg-zinc-50 md:border-l-2 md:border-l-zinc-400" : "hover:bg-zinc-50/80"}`}
    >
      {/* Date */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          {isToday && (
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
          )}
          <div className="flex flex-col">
            <span
              className={`text-xs font-extrabold ${isToday ? "text-zinc-800" : "text-zinc-700"}`}
            >
              {formatOnlyDate(item?.shiftDate)}
            </span>
            <span
              className={`text-[9px] font-semibold uppercase tracking-wider text-zinc-400`}
            >
              {formatDay(item?.shiftDate)}
              {isToday && " · Today"}
            </span>
          </div>
        </div>
      </td>

      {/* Employee */}
      <td className="px-5 py-3.5">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-700 capitalize">
            {item.userId?.fullName ?? "—"}
          </span>
          <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-wide">
            {item.userId?.designation ?? ""}
          </span>
        </div>
      </td>

      {/* Break In */}
      <td className="px-5 py-3.5">
        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold tabular-nums">
          {toLocal(item.breakIn)}
        </span>
      </td>

      {/* Break Out */}
      <td className="px-5 py-3.5">
        {item.breakOut ? (
          <span className="text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg text-[11px] font-bold tabular-nums">
            {toLocal(item.breakOut)}
          </span>
        ) : isActive ? (
          <span className="bg-zinc-800 text-white px-2.5 py-1 rounded-lg text-[9px] font-black flex items-center gap-1.5 border border-zinc-700 w-fit animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> LIVE
          </span>
        ) : (
          <span className="text-zinc-300 text-[11px] font-bold tabular-nums">
            --:--
          </span>
        )}
      </td>

      {/* Duration */}
      <td className="px-5 py-3.5 text-xs font-bold text-zinc-600 tabular-nums">
        {formatDuration(item.duration)}
      </td>

      {/* Type */}
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}
        >
          {/* <TypeIcon size={9} /> */}
          {typeCfg.label}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </span>
      </td>
      {/* Reason — only for OFFICIAL, show "—" otherwise */}
      <td className="px-5 py-3.5 max-w-[180px]">
        {item.type?.toUpperCase() === "OFFICIAL" ? (
          item.reason ? (
            <Tooltip label={item.reason} side="top" className="max-w-full" delay>
              <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg font-medium block truncate">
                {item.reason}
              </span>
            </Tooltip>
          ) : (
            <span className="text-zinc-300 text-xs font-bold">—</span>
          )
        ) : (
          <span className="text-zinc-300 text-xs font-bold">—</span>
        )}
      </td>
    </tr>
  );
};

export default BreakRow;
