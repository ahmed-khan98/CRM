// import React from "react";
// import { AlertCircle } from "lucide-react";
// import moment from "moment-timezone";
// import { formatDate } from "@/app/utilities/date";
// import {
//   calculateDuration,
//   formatTimeOnly,
//   getStatusClasses,
//   Tooltip,
// } from "@/app/utilities/attendence";

// const AttendanceRow = ({ row }) => {
//   const { record, isWeekend, isPastOrToday, date } = row;
//   console.log(row,'row')

// const now = moment().tz("Asia/Karachi");

//   // --- SHIFT LOGIC: 5 AM THRESHOLD ---
//   // Agar abhi raat ke 12 se subah 5 ke beech ka waqt hai,
//   // toh humein "Aaj" ki shift actually pichli calendar date ki lag rahi hai.
//   const effectiveTodayStr = now.hour() < 5
//     ? now.clone().subtract(1, "days").format("YYYY-MM-DD")
//     : now.format("YYYY-MM-DD");

//   const rowDateStr = moment(date).format("YYYY-MM-DD");

//   // Row ki date agar effectiveToday ke barabar hai toh ye ACTIVE ho sakti hai
//   const isShiftToday = rowDateStr === effectiveTodayStr;

//   // Row ki date agar effectiveToday se purani hai toh hi Discrepancy banegi
//   const isPastShift = moment(rowDateStr).isBefore(effectiveTodayStr, 'day');

//   // Time calculations
//   const timeInMoment = record?.timeIn ? moment(record.timeIn).tz("Asia/Karachi") : null;
//   const hoursSinceIn = timeInMoment ? now.diff(timeInMoment, "hours", true) : 0;

//   // 1. DISCREPANCY: TimeIn hai, Out nahi hai, AUR (Ya toh 20 ghante guzar gaye YAA pichli shift ka record hai)
//   const isDiscrepancy =
//     record?.timeIn &&
//     !record?.timeOut &&
//     (hoursSinceIn > 20 || isPastShift);

//   // 2. ACTIVE: TimeIn hai, Out nahi hai, aaj ki current shift hai, aur discrepancy nahi hai
//   const isActive =
//     record?.timeIn &&
//     !record?.timeOut &&
//     isShiftToday &&
//     !isDiscrepancy;

//   let currentStatus = "upcoming";

//   if (isWeekend) {
//     currentStatus = "weekend";
//   } else if (record) {
//     currentStatus = record.status;
//   } else if (isPastOrToday) {
//     currentStatus = "absent";
//   }

//   return (
//     <tr
//       className={`${isWeekend ? "bg-blue-50/20" : "hover:bg-gray-50"} transition-all border-b border-gray-50 group`}
//     >
//       <td className="px-6 py-4">
//         <div className="flex flex-col">
//           <span className="text-xs font-bold text-gray-600">
//             {formatDate(date, "dayDate")}
//           </span>
//           {isWeekend ? (
//             <span className="text-[9px] text-blue-400 font-black uppercase tracking-tighter">
//               Weekend
//             </span>
//           ) : (
//             <span className="text-[10px] text-gray-400">
//               {moment(date).format("dddd")}
//             </span>
//           )}
//         </div>
//       </td>

//       <td className="p-4">
//         <div className="flex items-center gap-2">
//           <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-[11px] font-bold">
//             {formatTimeOnly(record?.timeIn)}
//           </span>

//           <span className="text-gray-300">→</span>

//           {record?.timeOut ? (
//             <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px] font-bold">
//               {formatTimeOnly(record.timeOut)}
//             </span>
//           ) : isDiscrepancy ? ( // <-- Pehle isay check karein
//             <Tooltip text="Missing Time-Out! Contact Manager.">
//               <span className="text-red-400 font-bold flex items-center gap-1 cursor-help uppercase text-[9px] tracking-tight underline decoration-dotted">
//                 DISCREPANCY <AlertCircle size={12} />
//               </span>
//             </Tooltip>
//           ) : isActive ? (
//             <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[9px] font-black flex items-center gap-1.5 border border-purple-100 animate-pulse">
//               ACTIVE
//             </span>
//           ) : (
//             <span className="text-gray-300 text-[11px] font-bold">--:--</span>
//           )}
//         </div>
//       </td>

//       <td className="px-6 py-3 text-xs font-bold text-gray-700">
//         {calculateDuration(record?.timeIn, record?.timeOut)}
//       </td>

//       <td className="px-6 py-3 text-xs font-bold text-gray-700">
//         {record?.totalBreakMinutes >= 0
//           ? `${record?.totalBreakMinutes}min`
//           : "-"}
//       </td>

//       <td className="px-4 py-2">
//         {isWeekend ? (
//           <span className="text-[10px] font-bold text-gray-300 uppercase px-4">
//             Off
//           </span>
//         ) : (
//           <span
//             className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border tracking-tighter ${getStatusClasses(currentStatus)}`}
//           >
//             {currentStatus}
//           </span>
//         )}
//       </td>
//     </tr>
//   );
// };

// export default AttendanceRow;

import React from "react";
import { AlertCircle, Coffee, Zap } from "lucide-react";
import moment from "moment-timezone";

import { formatDate } from "@/app/utilities/date";
import {
  calculateDuration,
  formatTimeOnly,
  formatBreakMinutes,
  onlyWorkingHours,
  Tooltip,
  getStatusConfig,
} from "@/app/utilities/attendence";



function AttendanceRow({ row }) {
  const { record, isWeekend, isPastOrToday, date } = row;

  const now = moment().tz("Asia/Karachi");
  const currentHour = now.hour();
  const effectiveTodayStr =
    currentHour < 5
      ? now.clone().subtract(1, "days").format("YYYY-MM-DD")
      : now.format("YYYY-MM-DD");

  const rowDateStr = moment(date).format("YYYY-MM-DD");
  const isShiftToday = rowDateStr === effectiveTodayStr;
  const isPastShift = moment(rowDateStr).isBefore(effectiveTodayStr, "day");

  const timeInMoment = record?.timeIn
    ? moment(record.timeIn).tz("Asia/Karachi")
    : null;
  const hoursSinceIn = timeInMoment ? now.diff(timeInMoment, "hours", true) : 0;
  const hasTimeIn = !!record?.timeIn;
  const hasTimeOut = !!record?.timeOut;

  const isDiscrepancy =
    hasTimeIn && !hasTimeOut && (hoursSinceIn > 20 || isPastShift);
  const isActive = hasTimeIn && !hasTimeOut && isShiftToday && !isDiscrepancy;

  let currentStatus = "upcoming";
  if (isWeekend) currentStatus = "weekend";
  else if (isDiscrepancy) currentStatus = "discrepancy";
  else if (record) currentStatus = record.status;
  else if (isPastOrToday) currentStatus = "absent";

  const cfg = getStatusConfig(currentStatus);
  const isToday = rowDateStr === now.format("YYYY-MM-DD");

  const renderTimeOut = () => {
    if (hasTimeOut)
      return (
        <span className="text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg text-[11px] font-bold tabular-nums">
          {formatTimeOnly(record.timeOut)}
        </span>
      );
    if (isDiscrepancy)
      return (
        <Tooltip text="Missing Time-Out — contact your manager">
          <span className="text-orange-500 font-bold flex items-center gap-1 text-[9px] tracking-wide cursor-help border border-orange-200 bg-orange-50 px-2 py-1 rounded-lg">
            <AlertCircle size={10} /> DISCREPANCY
          </span>
        </Tooltip>
      );
    if (isActive)
      return (
        <span className="bg-zinc-800 text-white px-2.5 py-1 rounded-lg text-[9px] font-black flex items-center gap-1.5 border border-zinc-700 animate-pulse">
          <Zap size={9} className="fill-white" /> LIVE
        </span>
      );
    return (
      <span className="text-zinc-300 text-[11px] font-bold tabular-nums">
        --:--
      </span>
    );
  };

  return (
    <tr
      className={`group border-b border-zinc-100 transition-colors duration-100
${isToday ? "bg-zinc-50 border-l-2 border-l-zinc-400" : isWeekend ? "bg-sky-50/40" : "hover:bg-zinc-50/80"}`}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          {isToday && (
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
          )}{" "}
          <div className="flex flex-col">
            <span
              className={`text-xs font-extrabold ${isToday ? "text-zinc-800" : "text-zinc-700"}`}
            >
              {" "}
              {formatDate(date)}
            </span>
            <span
              className={`text-[9px] font-semibold uppercase tracking-wider ${isWeekend ? "text-sky-500" : "text-zinc-400"}`}
            >
              {moment(date).format("ddd")}
              {isToday && " · Today"}
            </span>
          </div>
        </div>
      </td>

      {/* In/Out */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold tabular-nums">
            {formatTimeOnly(record?.timeIn)}
          </span>
          <span className="text-zinc-300 text-xs">→</span>
          {renderTimeOut()}
        </div>
      </td>

      {/* Total Hours */}
      <td className="px-5 py-3.5 text-xs font-bold text-zinc-600 tabular-nums">
        {calculateDuration(record?.timeIn, record?.timeOut)}
      </td>

      {/* Working Hours */}
      <td className="px-5 py-3.5 text-xs font-bold text-zinc-600 tabular-nums">
        {onlyWorkingHours(
          record?.timeIn,
          record?.timeOut,
          record?.totalBreakMinutes,
        )}
      </td>

      {/* Break */}
      <td className="px-5 py-3.5">
        <span className="text-xs font-bold text-zinc-500 tabular-nums flex items-center gap-1">
          {record?.totalBreakMinutes >= 0 ? (
            <>
              <Coffee size={10} className="text-zinc-400" />
              {formatBreakMinutes(record.totalBreakMinutes)}
            </>
          ) : (
            "—"
          )}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5 w-25">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {isWeekend ? "Off" : cfg.label || currentStatus}
        </span>
      </td>
    </tr>
  );
}

export default AttendanceRow;
