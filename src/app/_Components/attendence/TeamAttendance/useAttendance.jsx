import { useMemo } from "react";
import moment from "moment-timezone";

export const useAttendanceData = ({
  attendanceData,
  selectedEmployee,
  viewType,
  queryParams,
  employeeOptions,
}) => {
  return useMemo(() => {
    const apiRecords = attendanceData?.data?.data || [];

      if (!selectedEmployee || viewType === "today") return apiRecords;
      const start = queryParams.startDate || moment().startOf("month").format("YYYY-MM-DD");
      const today = moment().startOf("day");
      const monthEnd = moment().endOf("month");
      let endLimit = queryParams.endDate ? moment(queryParams.endDate) : monthEnd;
      if (endLimit.isAfter(today)) endLimit = today;
  
      const fullList = [];
      let current = moment(start);
      const last = endLimit;
      const empDetails = apiRecords[0]?.employeeId || {
        fullName: employeeOptions.find((o) => o.value === selectedEmployee)?.label,
        designation: "Employee",
      };
  
      while (current <= last) {
        const dateStr = current.format("YYYY-MM-DD");
        const dayOfWeek = current.day();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const existingRecord = apiRecords.find((r) => r.record?.shiftDate === dateStr);
        if (existingRecord) {
          fullList.push({ ...existingRecord, isWeekend });
        } else {
          fullList.push({
            employeeId: empDetails,
            record: { shiftDate: dateStr, status: isWeekend ? "weekend" : "absent" },
            isAbsent: !isWeekend,
            isWeekend,
          });
        }
        current.add(1, "days");
      }
      return fullList.sort((a, b) => moment(b.record.shiftDate).diff(moment(a.record.shiftDate)));
  }, [attendanceData, selectedEmployee, viewType, queryParams, employeeOptions]);
};