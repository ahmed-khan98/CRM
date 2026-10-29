import * as XLSX from "xlsx";
import moment from "moment-timezone";
import {
  buildHolidayMap,
  isHolidayDate,
} from "@/app/utilities/attendence";

const getAttendanceStatus = (item) => item?.record?.status;
const isWeekendRecord = (item) =>
  item?.isWeekend || ["weekend", "off"].includes(getAttendanceStatus(item));
const isHolidayRecord = (item) =>
  item?.isHoliday || getAttendanceStatus(item) === "holiday";
const isAbsentRecord = (item) =>
  item?.isAbsent || getAttendanceStatus(item) === "absent";

const isPresentRecord = (item) => {
  const now = moment().tz("Asia/Karachi");
  const shiftEffectiveDate =
    now.hour() < 8
      ? now.clone().subtract(1, "days").format("YYYY-MM-DD")
      : now.format("YYYY-MM-DD");
  const recordDateStr = moment(item?.record?.shiftDate).format("YYYY-MM-DD");
  const isToday = recordDateStr === shiftEffectiveDate;

  return getAttendanceStatus(item) === "present" && (item?.record?.timeOut || isToday);
};

const isLateRecord = (item) => getAttendanceStatus(item) === "late";
const isHalfDayRecord = (item) => getAttendanceStatus(item) === "half-day";
const isDiscrepancyRecord = (item) =>
  item?.record?._id &&
  !item?.record?.timeOut &&
  moment(item?.record?.shiftDate).isBefore(moment().startOf("day"));

const emptySummary = (name) => ({
  name: name || "Unknown",
  present: 0,
  absent: 0,
  late: 0,
  halfday: 0,
  discrepency: 0,
  holiday: 0,
  weekend: 0,
  totalDays: 0,
});

const countRecordIntoSummary = (summary, record, { isWeekendDay, isHolidayDay }) => {
  if (isHolidayRecord(record) || isHolidayDay) {
    summary.holiday += 1;
  } else if (isWeekendRecord(record) || isWeekendDay) {
    summary.weekend += 1;
  } else if (isAbsentRecord(record)) {
    summary.absent += 1;
  } else if (isLateRecord(record)) {
    summary.late += 1;
  } else if (isHalfDayRecord(record)) {
    summary.halfday += 1;
  } else if (isPresentRecord(record)) {
    summary.present += 1;
  } else if (isDiscrepancyRecord(record)) {
    summary.discrepency += 1;
  } else if (isWeekendDay) {
    summary.weekend += 1;
  } else {
    summary.absent += 1;
  }
  summary.totalDays += 1;
};

const getDateRange = (startDate, endDate) => {
  const start = moment(startDate).startOf("day");
  let end = moment(endDate).startOf("day");
  const today = moment().startOf("day");
  if (end.isAfter(today)) end = today;
  if (start.isAfter(end)) return [];

  const dates = [];
  let current = start.clone();
  while (current.isSameOrBefore(end, "day")) {
    dates.push({
      date: current.format("YYYY-MM-DD"),
      isWeekend: [0, 6].includes(current.day()),
    });
    current.add(1, "day");
  }
  return dates;
};

const buildSummaryForAllEmployees = (
  records,
  startDate,
  endDate,
  employeeList,
  holidays = [],
) => {
  const employeeMap = new Map();
  const holidayMapByDept = new Map();
  const dates = getDateRange(startDate, endDate);

  const holidayMapForDept = (departmentId) => {
    const key = departmentId ? String(departmentId) : "all";
    if (!holidayMapByDept.has(key)) {
      holidayMapByDept.set(key, buildHolidayMap(holidays, departmentId || null));
    }
    return holidayMapByDept.get(key);
  };

  employeeList.forEach((emp) => {
    if (!emp?._id || emp?.status === "de active") return;
    const deptId = emp?.departmentId?._id || emp?.departmentId || null;
    employeeMap.set(emp._id, {
      ...emptySummary(emp.fullName || emp.label || "Unknown"),
      departmentId: deptId,
    });
  });

  const recordMap = new Map();
  records.forEach((rec) => {
    const empId =
      rec?.employeeId?._id || rec?.employeeId?.value || rec?.employeeId?.label;
    const date = rec?.record?.shiftDate || rec?.shiftDate;
    if (!empId || !date) return;
    recordMap.set(`${empId}||${date}`, rec);
  });

  dates.forEach(({ date, isWeekend }) => {
    employeeMap.forEach((summary, empId) => {
      const holidayMap = holidayMapForDept(summary.departmentId);
      const isHolidayDay = !isWeekend && isHolidayDate(holidayMap, date);
      const record = recordMap.get(`${empId}||${date}`);
      if (record) {
        countRecordIntoSummary(summary, record, {
          isWeekendDay: isWeekend,
          isHolidayDay,
        });
      } else if (isHolidayDay) {
        summary.holiday += 1;
        summary.totalDays += 1;
      } else if (isWeekend) {
        summary.weekend += 1;
        summary.totalDays += 1;
      } else {
        summary.absent += 1;
        summary.totalDays += 1;
      }
    });
  });

  return Array.from(employeeMap.values())
    .map(({ departmentId, ...rest }) => rest)
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Generate attendance summary report and export to Excel
 * @param {Array} attendanceData - Array of attendance records
 * @param {String} startDate - Start date (YYYY-MM-DD format)
 * @param {String} endDate - End date (YYYY-MM-DD format)
 * @param {Object} options - Optional export settings
 * @param {String} options.selectedEmployee - Selected employee ID
 * @param {Array} options.employeeList - List of employees for all-employee exports
 * @param {Array} options.holidays - Company/dept holidays list
 */
export const exportAttendanceToExcel = (
  attendanceData,
  startDate,
  endDate,
  options = {},
) => {
  const {
    selectedEmployee = "",
    employeeList = [],
    holidays = [],
  } = options;
  try {
    if (!attendanceData || attendanceData.length === 0) {
      throw new Error("No attendance data to export");
    }

    let summaryArray = [];
    if (!selectedEmployee && employeeList.length > 0) {
      summaryArray = buildSummaryForAllEmployees(
        attendanceData,
        startDate,
        endDate,
        employeeList,
        holidays,
      );
    } else {
      const employeeSummary = {};

      attendanceData.forEach((record) => {
        const empId =
          record?.employeeId?._id ||
          record?.employeeId?.fullName ||
          record?.employeeId?.label ||
          "unknown";
        const empName =
          record?.employeeId?.fullName ||
          record?.employeeId?.label ||
          "Unknown";

        if (!employeeSummary[empId]) {
          employeeSummary[empId] = emptySummary(empName);
        }

        countRecordIntoSummary(employeeSummary[empId], record, {
          isWeekendDay: false,
          isHolidayDay: false,
        });
      });

      summaryArray = Object.values(employeeSummary).sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();

    // Prepare header rows with date range
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    const formattedStartDate = startMoment.format("DD MMM YYYY");
    const formattedEndDate = endMoment.format("DD MMM YYYY");

    // Create worksheet with merged cells for header
    const worksheet = XLSX.utils.aoa_to_sheet([
      [`ATTENDANCE SUMMARY (${formattedStartDate} to ${formattedEndDate})`],
      [
        "Sr. No.",
        "Employee Name",
        "Present",
        "Absent",
        "Late",
        "Half Day",
        "Discrepency",
        "Holiday",
        "Weekend",
        "Total Days",
      ],
      ...summaryArray.map((emp, index) => [
        index + 1,
        emp["Employee Name"] || emp.name,
        emp.Present ?? emp.present,
        emp.Absent ?? emp.absent,
        emp.Late ?? emp.late,
        emp["Half Day"] ?? emp.halfday,
        emp.Discrepency ?? emp.discrepency,
        emp.Holiday ?? emp.holiday,
        emp.Weekend ?? emp.weekend,
        emp["Total Days"] ?? emp.totalDays,
      ]),
    ]);

    // Merge cells for title
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }];

    // Set column widths
    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 30 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Summary");

    // Generate filename with date range
    const fileNameDate = startMoment.format("DD-MMM-YYYY");
    const endFileDate = endMoment.format("DD-MMM-YYYY");
    const fileName = `Attendance_Summary_${fileNameDate}_to_${endFileDate}.xlsx`;

    // Write and save file
    XLSX.writeFile(workbook, fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};

/**
 * Alternative simpler version for summary export
 */
export const exportAttendanceSummarySimple = (
  summaryData,
  startDate,
  endDate,
) => {
  try {
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    const formattedStartDate = startMoment.format("DD MMM YYYY");
    const formattedEndDate = endMoment.format("DD MMM YYYY");

    // Create worksheet data
    const wsData = [
      [
        `ATTENDANCE SUMMARY REPORT (${formattedStartDate} to ${formattedEndDate})`,
      ],
      [], // Empty row for spacing
      [
        "Employee Name",
        "Present",
        "Absent",
        "Late",
        "Half Day",
        "Discrepency",
        "Holiday",
        "Weekend",
        "Total Days",
      ],
      ...summaryData,
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 25 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
    ];

    // Merge cells for title
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");

    const fileNameDate = startMoment.format("DD-MMM-YYYY");
    const endFileDate = endMoment.format("DD-MMM-YYYY");
    const fileName = `Attendance_Summary_${fileNameDate}_to_${endFileDate}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
