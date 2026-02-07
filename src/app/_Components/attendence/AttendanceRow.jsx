import React from "react";
import { AlertCircle } from "lucide-react";
import moment from "moment-timezone";
import { formatDate } from "@/app/utilities/date";
import {
  calculateDuration,
  formatTimeOnly,
  getStatusClasses,
  Tooltip,
} from "@/app/utilities/attendence";

const AttendanceRow = ({ row }) => {
  const { record, isWeekend, isPastOrToday, date } = row;
  console.log(row,'row')

const now = moment().tz("Asia/Karachi");

  // --- SHIFT LOGIC: 5 AM THRESHOLD ---
  // Agar abhi raat ke 12 se subah 5 ke beech ka waqt hai, 
  // toh humein "Aaj" ki shift actually pichli calendar date ki lag rahi hai.
  const effectiveTodayStr = now.hour() < 5 
    ? now.clone().subtract(1, "days").format("YYYY-MM-DD") 
    : now.format("YYYY-MM-DD");

  const rowDateStr = moment(date).format("YYYY-MM-DD");

  // Row ki date agar effectiveToday ke barabar hai toh ye ACTIVE ho sakti hai
  const isShiftToday = rowDateStr === effectiveTodayStr;
  
  // Row ki date agar effectiveToday se purani hai toh hi Discrepancy banegi
  const isPastShift = moment(rowDateStr).isBefore(effectiveTodayStr, 'day');

  // Time calculations
  const timeInMoment = record?.timeIn ? moment(record.timeIn).tz("Asia/Karachi") : null;
  const hoursSinceIn = timeInMoment ? now.diff(timeInMoment, "hours", true) : 0;

  // 1. DISCREPANCY: TimeIn hai, Out nahi hai, AUR (Ya toh 20 ghante guzar gaye YAA pichli shift ka record hai)
  const isDiscrepancy = 
    record?.timeIn && 
    !record?.timeOut && 
    (hoursSinceIn > 20 || isPastShift);

  // 2. ACTIVE: TimeIn hai, Out nahi hai, aaj ki current shift hai, aur discrepancy nahi hai
  const isActive = 
    record?.timeIn && 
    !record?.timeOut && 
    isShiftToday && 
    !isDiscrepancy;
    
  //   const now = moment();
  // const timeInMoment = record?.timeIn ? moment(record.timeIn) : null;
  // const hoursSinceIn = timeInMoment
  //   ? moment.duration(now.diff(timeInMoment)).asHours()
  //   : 0;

  // const isActive = record?.timeIn && !record?.timeOut && hoursSinceIn <= 20;
  // const isDiscrepancy = record?.timeIn && !record?.timeOut && hoursSinceIn > 20;

  let currentStatus = "upcoming";

  if (isWeekend) {
    currentStatus = "weekend";
  } else if (record) {
    currentStatus = record.status;
  } else if (isPastOrToday) {
    currentStatus = "absent";
  }

  return (
    <tr
      className={`${isWeekend ? "bg-blue-50/20" : "hover:bg-gray-50"} transition-all border-b border-gray-50 group`}
    >
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-600">
            {formatDate(date, "dayDate")}
          </span>
          {isWeekend ? (
            <span className="text-[9px] text-blue-400 font-black uppercase tracking-tighter">
              Weekend
            </span>
          ) : (
            <span className="text-[10px] text-gray-400">
              {moment(date).format("dddd")}
            </span>
          )}
        </div>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-[11px] font-bold">
            {formatTimeOnly(record?.timeIn)}
          </span>

          <span className="text-gray-300">→</span>

          {record?.timeOut ? (
            <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px] font-bold">
              {formatTimeOnly(record.timeOut)}
            </span>
          ) : isDiscrepancy ? ( // <-- Pehle isay check karein
            <Tooltip text="Missing Time-Out! Contact Manager.">
              <span className="text-red-400 font-bold flex items-center gap-1 cursor-help uppercase text-[9px] tracking-tight underline decoration-dotted">
                DISCREPANCY <AlertCircle size={12} />
              </span>
            </Tooltip>
          ) : isActive ? (
            <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-[9px] font-black flex items-center gap-1.5 border border-purple-100 animate-pulse">
              ACTIVE
            </span>
          ) : (
            <span className="text-gray-300 text-[11px] font-bold">--:--</span>
          )}
        </div>
      </td>

      <td className="px-6 py-3 text-xs font-bold text-gray-700">
        {calculateDuration(record?.timeIn, record?.timeOut)}
      </td>

      <td className="px-6 py-3 text-xs font-bold text-gray-700">
        {record?.totalBreakMinutes >= 0
          ? `${record?.totalBreakMinutes}min`
          : "-"}
      </td>

      <td className="px-4 py-2">
        {isWeekend ? (
          <span className="text-[10px] font-bold text-gray-300 uppercase px-4">
            Off
          </span>
        ) : (
          <span
            className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border tracking-tighter ${getStatusClasses(currentStatus)}`}
          >
            {currentStatus}
          </span>
        )}
      </td>
    </tr>
  );
};

export default AttendanceRow;
