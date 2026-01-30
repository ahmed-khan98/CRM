import React from 'react'
import { formatDate } from "@/app/utilities/date";
import { AlertCircle } from 'lucide-react';
import moment from "moment-timezone";

const Tooltip = ({ text, children }) => (
  <div className="group relative inline-flex items-center">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl z-[999] text-center leading-tight">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

const calculateDuration = (inTime, outTime) => {
  if (!inTime || !outTime) return "-";
  const start = moment(inTime);
  const end = moment(outTime);
  const diff = moment.duration(end.diff(start));
  const hours = Math.floor(diff.asHours());
  const minutes = diff.minutes();
  return hours > 0 || minutes > 0 ? `${hours}h ${minutes}m` : "-";
};

// Updated Status Classes to handle new logic
const getStatusClasses = (status) => {
  switch (status) {
    case "present": return "bg-green-100 text-green-700 border-green-200";
    case "full-day": return "bg-blue-100 text-blue-700 border-blue-200";
    case "late":
    case "half-day": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "absent": return "bg-red-100 text-red-700 border-red-200";
    case "active": return "bg-purple-100 text-purple-700 border-purple-200";
    default: return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

const AttendanceRow = ({ row }) => {
  const { record, isWeekend, isPastOrToday, isToday, date } = row;
  
  const now = moment();
  const timeInMoment = record?.timeIn ? moment(record.timeIn) : null;
  const hoursSinceIn = timeInMoment ? moment.duration(now.diff(timeInMoment)).asHours() : 0;

  const isActive = record?.timeIn && !record?.timeOut && hoursSinceIn <= 20;

  // 2. DISCREPANCY Logic
  const isDiscrepancy = record?.timeIn && !record?.timeOut && hoursSinceIn > 20;

  let currentStatus = "upcoming";
  
  if (isWeekend) {
    currentStatus = "weekend";
  } else if (isActive) {
    currentStatus = "active";
  } else if (record) {
    currentStatus = record.status; 
  } else if (isPastOrToday) {
    currentStatus = "absent";
  }

  return (
    <tr className={`${isWeekend ? "bg-blue-50/20" : "hover:bg-gray-50"} transition-all border-b border-gray-50 group`}>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-700">{formatDate(date, "dayDate")}</span>
          {isWeekend && <span className="text-[9px] text-blue-400 font-black uppercase tracking-tighter">Weekend</span>}
        </div>
      </td>

      <td className="px-6 py-3 text-xs font-semibold text-gray-600">
        {record?.timeIn ? formatDate(record.timeIn, "timeOnly") : "-"}
      </td>

      <td className="px-6 py-3 text-xs font-semibold">
        {record?.timeOut ? (
          formatDate(record.timeOut, "timeOnly")
        ) : isActive ? (
          <span className="text-purple-600 font-black animate-pulse flex items-center gap-1">
            <span className="h-1.5 w-1.5 bg-purple-800 rounded-full"></span> ACTIVE
          </span>
        ) : isDiscrepancy ? (
          <Tooltip text="Missing Time-Out! Contact HR to resolve this discrepancy.">
            <span className="text-gray-400 font-bold flex items-center gap-1 cursor-help uppercase text-[10px] tracking-tighter underline decoration-dotted">
              DISCREPANCY <AlertCircle size={14} />
            </span>
          </Tooltip>
        ) : "-"}
      </td>

      <td className="px-6 py-3 text-xs font-bold text-gray-700">
        {calculateDuration(record?.timeIn, record?.timeOut)}
      </td>
      
      <td className="px-6 py-3 text-xs font-bold text-gray-700">
        {record?.totalBreakMinutes >= 0 ? `${record?.totalBreakMinutes}min` : "-"}
      </td>

      <td className="px-4 py-2">
        {isWeekend ? (
          <span className="text-[10px] font-bold text-gray-300 uppercase px-4">Off</span>
        ) : (
          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border tracking-tighter ${getStatusClasses(currentStatus)}`}>
            {currentStatus}
          </span>
        )}
      </td>
    </tr>
  );
};

export default AttendanceRow;