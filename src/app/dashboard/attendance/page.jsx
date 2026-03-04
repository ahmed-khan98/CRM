// "use client";

// import { useMemo, useState } from "react";
// import { Calendar, XCircle } from "lucide-react";
// import { useGetAttendanceQuery } from "@/app/_Services/attendence/page";
// import moment from "moment-timezone";
// import AttendanceRow from "@/app/_Components/attendence/AttendanceRow";

// export default function AttendancePage() {
//   const [viewType, setViewType] = useState("current_month");
//   const [customRange, setCustomRange] = useState({ start: "", end: "" });

//   const queryParams = useMemo(() => {
//     if (viewType === "current_month") {
//       return { month:moment().format("MM"), year: moment().year() };
//     }
//     if (viewType === "custom_range" && customRange.start) {
//       return {
//         startDate: customRange.start,
//         endDate: customRange.end || customRange.start,
//       };
//     }
//     return {};
//   }, [viewType, customRange]);

//   const { data, isFetching } = useGetAttendanceQuery(queryParams);

//   const handleClearFilters = () => {
//     setViewType("current_month");
//     setCustomRange({ start: "", end: "" });
//   };

//   const tableData = useMemo(() => {
//     if (isFetching) return [];
//     const dates = [];
//     let start, end;

//     if (viewType === "custom_range" && customRange.start) {
//       start = moment(customRange.start).startOf("day");
//       let selectedEnd = customRange.end
//         ? moment(customRange.end).endOf("day")
//         : moment(customRange.start).endOf("day");
//       end = selectedEnd.isAfter(moment()) ? moment().endOf("day") : selectedEnd;
//     } else {
//       start = moment().startOf("month");
//       end = moment().endOf("day");
//     }

//     let current = moment(start);
//     while (current.isSameOrBefore(end, "day")) {
//       const dateStr = current.format("YYYY-MM-DD");
//       const record = data?.data?.find(
//         (r) => moment(r.shiftDate).format("YYYY-MM-DD") === dateStr,
//       );

//       dates.push({
//         date: dateStr,
//         dayName: current.format("dddd"),
//         isWeekend: ["Saturday", "Sunday"].includes(current.format("dddd")),
//         // isPastOrToday: Agar date aaj ya purani hai
//         isPastOrToday: current.isSameOrBefore(moment(), "day"),
//         isToday: current.isSame(moment(), "day"),
//         record: record || null,
//       });
//       current.add(1, "day");
//     }
//     return dates.sort((a, b) => moment(b.date).diff(moment(a.date)));
//   }, [data, viewType, customRange, isFetching]);


//   return (
//     // h-screen overflow-hidden poore page ka scroll rok deta hai
//     <div className="h-screen overflow-hidden py-1 mx-1  flex flex-col bg-gray-50/50 ">
//       <div className=" w-full mx-auto p-1 flex flex-col h-full space-y-4">
//         {/* Header Section (Fixed) */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-purple-100 rounded-lg text-[#5f2781]">
//               <Calendar className="h-5 w-5" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 tracking-tight">
//               Attendance History
//             </h3>
//           </div>
//           <div className="bg-white p-1 rounded-2xl shadow-sm border border-purple-50 flex flex-wrap gap-3 items-center justify-between shrink-0">
//             <div className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
//               {["current_month", "custom_range"].map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setViewType(t)}
//                   className={`flex-1 sm:flex-none px-3 py-1 text-[11px] rounded-lg transition-all capitalize font-bold ${
//                     viewType === t
//                       ? "bg-white text-[#5f2781] shadow-sm"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   {t.replace("_", " ")}
//                 </button>
//               ))}
//             </div>

//             <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
//               {viewType === "custom_range" && (
//                 <div className="flex gap-2 items-center grow">
//                   <input
//                     type="date"
//                     value={customRange.start}
//                     className="bg-gray-50 border-none p-2 rounded-lg text-[11px] focus:ring-2 focus:ring-purple-200 outline-none w-full"
//                     onChange={(e) =>
//                       setCustomRange({ ...customRange, start: e.target.value })
//                     }
//                   />
//                   <span className="text-gray-300 font-bold">-</span>
//                   <input
//                     type="date"
//                     value={customRange.end}
//                     className="bg-gray-50 border-none p-2 rounded-lg text-[11px] focus:ring-2 focus:ring-purple-200 outline-none w-full"
//                     onChange={(e) =>
//                       setCustomRange({ ...customRange, end: e.target.value })
//                     }
//                   />
//                 </div>
//               )}
//               {(viewType !== "current_month" || customRange.start) && (
//                 <button
//                   onClick={handleClearFilters}
//                   className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
//                 >
//                   <XCircle size={20} />
//                 </button>
//               )}
//             </div>
//           </div>
        
//         </div>

//         {/* Filters Section (Fixed) */}

//         {/* --- SCROLLABLE TABLE AREA --- */}
//         <div className="flex-1 bg-white rounded-2xl shadow-xl border border-purple-100 flex flex-col overflow-hidden min-h-0">
//           <div className="overflow-auto relative scrollbar-thin scrollbar-thumb-purple-100">
//             <table className="w-full text-left border-collapse">
//               {/* Sticky Header */}
//               <thead className="sticky top-0 z-20 bg-gray-50 border-b border-gray-100 ">
//                 <tr>
//                   {[
//                     "Date",
//                     "In/Out",
//                     "Working Hours",
//                     "Break",
//                     "Status",
//                   ].map((h) => (
//                     <th
//                       key={h}
//                       className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50 bg-white">
//                 {isFetching ? (
//                    <tr>
//                   <td
//                     colSpan="6"
//                     className="p-20 text-center text-purple-600 animate-pulse font-bold"
//                   >
//                     Syncing Records...
//                   </td>
//                 </tr>
//                 ) : (
//                   tableData.map((row) => (
//                     <AttendanceRow key={row.date} row={row} />
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Calendar, XCircle } from "lucide-react";
import { useGetAttendanceQuery } from "@/app/_Services/attendence/page";
import moment from "moment-timezone";
import AttendanceRow from "@/app/_Components/attendence/AttendanceRow";

const TABLE_HEADERS = ["Date", "In/Out", "Working Hours", "Break", "Status"];

export default function AttendancePage() {
  const [viewType, setViewType] = useState("current_month");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  // Query params
  const getQueryParams = () => {
    if (viewType === "current_month") {
      return { month: moment().format("MM"), year: moment().year() };
    }
    if (viewType === "custom_range" && customRange.start) {
      return {
        startDate: customRange.start,
        endDate: customRange.end || customRange.start,
      };
    }
    return {};
  };

  const { data, isFetching } = useGetAttendanceQuery(getQueryParams());

  // Generate table data
  const getTableData = () => {
    if (isFetching || !data?.data) return [];

    const dates = [];
    const now = moment();
    let start, end;

    if (viewType === "custom_range" && customRange.start) {
      start = moment(customRange.start).startOf("day");
      const selectedEnd = customRange.end
        ? moment(customRange.end).endOf("day")
        : moment(customRange.start).endOf("day");
      end = selectedEnd.isAfter(now) ? now.clone().endOf("day") : selectedEnd;
    } else {
      start = moment().startOf("month");
      end = now.clone().endOf("day");
    }

    // Create lookup map for faster record search
    const recordMap = {};
    data.data.forEach((r) => {
      const key = moment(r.shiftDate).format("YYYY-MM-DD");
      recordMap[key] = r;
    });

    // Generate dates
    let current = moment(start);
    while (current.isSameOrBefore(end, "day")) {
      const dateStr = current.format("YYYY-MM-DD");
      const dayName = current.format("dddd");
      const isWeekend = dayName === "Saturday" || dayName === "Sunday";

      dates.push({
        date: dateStr,
        dayName,
        isWeekend,
        isPastOrToday: current.isSameOrBefore(now, "day"),
        isToday: current.isSame(now, "day"),
        record: recordMap[dateStr] || null,
      });
      
      current.add(1, "day");
    }

    return dates.sort((a, b) => moment(b.date).diff(moment(a.date)));
  };

  const tableData = getTableData();
  const showClearButton = viewType !== "current_month" || customRange.start;

  return (
    <div className="h-screen overflow-hidden py-1 mx-1 flex flex-col bg-gray-50/50">
      <div className="w-full mx-auto p-1 flex flex-col h-full space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg text-[#5f2781]">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">
              Attendance History
            </h3>
          </div>

          {/* Filters */}
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-purple-50 flex flex-wrap gap-3 items-center justify-between shrink-0">
            
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
              {["current_month", "custom_range"].map((type) => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={`cursor-pointer flex-1 sm:flex-none px-3 py-1 text-[11px] rounded-lg transition-all capitalize font-bold ${
                    viewType === type
                      ? "bg-white text-[#5f2781] shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  {type.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
              {viewType === "custom_range" && (
                <div className="flex gap-2 items-center grow">
                  <input
                    type="date"
                    value={customRange.start}
                    onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                    className="bg-gray-50 border-none p-2 rounded-lg text-[11px] focus:ring-2 focus:ring-purple-200 outline-none w-full"
                  />
                  <span className="text-gray-300 font-bold">-</span>
                  <input
                    type="date"
                    value={customRange.end}
                    onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                    className="bg-gray-50 border-none p-2 rounded-lg text-[11px] focus:ring-2 focus:ring-purple-200 outline-none w-full"
                  />
                </div>
              )}
              
              {showClearButton && (
                <button
                  onClick={() => {
                    setViewType("current_month");
                    setCustomRange({ start: "", end: "" });
                  }}
                  className="cursor-pointer p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XCircle size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl border border-purple-100 flex flex-col overflow-hidden min-h-0">
          <div className="overflow-auto relative scrollbar-thin scrollbar-thumb-purple-100">
            <table className="w-full text-left border-collapse">
              
              <thead className="sticky top-0 z-20 bg-gray-50 border-b border-gray-100">
                <tr>
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header}
                      className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-50 bg-white">
                {isFetching ? (
                  <tr>
                    <td
                      colSpan={TABLE_HEADERS.length}
                      className="p-20 text-center text-purple-600 animate-pulse font-bold"
                    >
                      Syncing Records...
                    </td>
                  </tr>
                ) : tableData.length > 0 ? (
                  tableData.map((row) => (
                    <AttendanceRow key={row.date} row={row} />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={TABLE_HEADERS.length}
                      className="p-20 text-center text-gray-400 font-medium"
                    >
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}