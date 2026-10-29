import { useMemo } from "react";
import moment from "moment-timezone";
import {
  buildHolidayMap,
  getCurrentPayCycleRange,
  getHolidayName,
  isHolidayDate,
} from "@/app/utilities/attendence";


export const useAttendanceData = ({
  attendanceData,
  selectedEmployee,
  viewType,
  queryParams,
  employeeOptions,
  holidays = [],
}) => {
  return useMemo(() => {
    const apiRecords = attendanceData?.data?.data || [];

    if (!selectedEmployee || viewType === "today") {
      // Today / all-employees: override holiday days with holiday name
      return apiRecords.map((item) => {
        const dateStr = item?.record?.shiftDate
          ? moment(item.record.shiftDate).format("YYYY-MM-DD")
          : queryParams?.startDate;
        const deptId =
          item?.employeeId?.departmentId?._id ||
          item?.employeeId?.departmentId ||
          null;
        const map = buildHolidayMap(holidays, deptId);
        const name = getHolidayName(map, dateStr);
        const holiday =
          item?.record?.status === "holiday" ||
          item?.isHoliday ||
          (dateStr && isHolidayDate(map, dateStr));
        if (!holiday) return item;
        const holidayName =
          name || item?.holidayName || item?.record?.holidayName || "Holiday";
        return {
          ...item,
          isAbsent: false,
          isHoliday: true,
          holidayName,
          record: {
            ...(item.record || {}),
            shiftDate: dateStr || item?.record?.shiftDate,
            status: "holiday",
            holidayName,
          },
        };
      });
    }

    const cycle = getCurrentPayCycleRange();
    const start = queryParams.startDate || cycle.start;
    const today = moment().tz("Asia/Karachi").startOf("day");
    const cycleEnd = moment(queryParams.endDate || cycle.end);
    let endLimit = cycleEnd;
    if (endLimit.isAfter(today)) endLimit = today;

    const fullList = [];
    let current = moment(start);
    const last = endLimit;
    const opt = employeeOptions.find((o) => o.value === selectedEmployee);
    const empDetails = apiRecords[0]?.employeeId || {
      fullName: opt?.label,
      designation: opt?.designation || "Employee",
      departmentId: opt?.departmentId || null,
      _id: selectedEmployee,
    };
    const deptId =
      empDetails?.departmentId?._id ||
      empDetails?.departmentId ||
      opt?.departmentId ||
      null;
    const holidayMap = buildHolidayMap(holidays, deptId);

    while (current <= last) {
      const dateStr = current.format("YYYY-MM-DD");
      const dayOfWeek = current.day(); // 0 = Sunday, 6 = Saturday
      const holidayName = getHolidayName(holidayMap, dateStr);

      const existingRecord = apiRecords.find(
        (r) => r.record?.shiftDate === dateStr,
      );

      if (existingRecord) {
        const isHol =
          existingRecord.record?.status === "holiday" ||
          isHolidayDate(holidayMap, dateStr);
        fullList.push({
          ...existingRecord,
          isWeekend: dayOfWeek === 0,
          isHoliday: !!isHol,
          holidayName: isHol
            ? holidayName ||
              existingRecord.holidayName ||
              existingRecord.record?.holidayName ||
              "Holiday"
            : "",
          isAbsent: isHol ? false : existingRecord.isAbsent,
          record: isHol
            ? {
                ...existingRecord.record,
                status: "holiday",
                holidayName:
                  holidayName ||
                  existingRecord.record?.holidayName ||
                  "Holiday",
              }
            : existingRecord.record,
        });
      } else {
        let status = "absent";
        let isWeekend = false;

        if (dayOfWeek === 0) {
          status = "weekend";
          isWeekend = true;
        } else if (dayOfWeek === 6) {
          status = "off";
          isWeekend = true;
        } else if (isHolidayDate(holidayMap, dateStr)) {
          status = "holiday";
        }

        fullList.push({
          employeeId: empDetails,
          record: {
            shiftDate: dateStr,
            status,
            ...(status === "holiday"
              ? { holidayName: holidayName || "Holiday" }
              : {}),
          },
          isAbsent: status === "absent",
          isWeekend,
          isHoliday: status === "holiday",
          holidayName: status === "holiday" ? holidayName || "Holiday" : "",
        });
      }
      current.add(1, "days");
    }
    return fullList.sort((a, b) =>
      moment(b.record.shiftDate).diff(moment(a.record.shiftDate)),
    );
  }, [
    attendanceData,
    selectedEmployee,
    viewType,
    queryParams,
    employeeOptions,
    holidays,
  ]);
};
