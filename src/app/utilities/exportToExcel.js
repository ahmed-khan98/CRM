import * as XLSX from "xlsx";
import moment from "moment-timezone";

const getAttendanceStatus = (item) => item?.record?.status;
const isWeekendRecord = (item) =>
  item?.isWeekend || ["weekend", "off"].includes(getAttendanceStatus(item));
const isAbsentRecord = (item) =>
  item?.isAbsent || getAttendanceStatus(item) === "absent";

const isPresentRecord = (item) => {
  console.log("Checking present record for item:", item);
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
) => {
  const employeeMap = new Map();
  const dates = getDateRange(startDate, endDate);

  employeeList.forEach((emp) => {
    if (!emp?._id || emp?.status === "de active") return;
    employeeMap.set(emp._id, {
      name: emp.fullName || emp.label || "Unknown",
      present: 0,
      absent: 0,
      late: 0,
      halfday: 0,
      discrepency: 0,
      weekend: 0,
      totalDays: 0,
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
      const record = recordMap.get(`${empId}||${date}`);
      if (record) {
        if (isWeekendRecord(record)) {
          summary.weekend += 1;
        } else if (isAbsentRecord(record)) {
          summary.absent += 1;
        } else if (isLateRecord(record)) {
          summary.late += 1;
        } else if (isHalfDayRecord(record)) {
          summary.halfday += 1;
        } else if (isPresentRecord(record)) {
          summary.present += 1;
        }else if (isDiscrepancyRecord(record)) {
          summary.discrepency += 1;
        }  else if (isWeekend) {
          summary.weekend += 1;
        } else {
          summary.absent += 1;
        }
      } else {
        if (isWeekend) {
          summary.weekend += 1;
        } else {
          summary.absent += 1;
        }
      }
      summary.totalDays += 1;
    });
  });

  return Array.from(employeeMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};

/**
 * Generate attendance summary report and export to Excel
 * @param {Array} attendanceData - Array of attendance records
 * @param {String} startDate - Start date (YYYY-MM-DD format)
 * @param {String} endDate - End date (YYYY-MM-DD format)
 * @param {Object} options - Optional export settings
 * @param {String} options.selectedEmployee - Selected employee ID
 * @param {Array} options.employeeList - List of employees for all-employee exports
 */
export const exportAttendanceToExcel = (
  attendanceData,
  startDate,
  endDate,
  options = {},
) => {
  const { selectedEmployee = "", employeeList = [] } = options;
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
          employeeSummary[empId] = {
            name: empName,
            present: 0,
            absent: 0,
            late: 0,
            halfday: 0,
            discrepency: 0,
            weekend: 0,
            totalDays: 0,
          };
        }

        const summary = employeeSummary[empId];
        if (isWeekendRecord(record)) {
          summary.weekend += 1;
        } else if (isAbsentRecord(record)) {
          summary.absent += 1;
        } else if (isLateRecord(record)) {
          summary.late += 1;
        } else if (isHalfDayRecord(record)) {
          summary.halfday += 1;
        } else if (isPresentRecord(record)) {
          summary.present += 1;
        }else if (isDiscrepancyRecord(record)) {
          summary.discrepency += 1;
        } 

        summary.totalDays += 1;
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
        emp.Weekend ?? emp.weekend,
        emp["Total Days"] ?? emp.totalDays,
      ]),
    ]);

    // Merge cells for title
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];

    // Set column widths
    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 30 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
    ];

    // Apply styling to header row
    const headerStyle = {
      font: { bold: true, color: "FFFFFF", size: 14 },
      fill: { fgColor: { rgb: "1F2937" } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const columnHeaderStyle = {
      font: { bold: true, color: "FFFFFF", size: 11 },
      fill: { fgColor: { rgb: "4B5563" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      },
    };

    const dataStyle = {
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      },
    };

    // Apply styles manually (XLSX doesn't support direct styling, we'll use formulas)
    // For now, add the worksheet
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
    ];

    // Merge cells for title
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

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
