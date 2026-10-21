import * as XLSX from "xlsx";
import { formatLeaveDate, formatLeaveName } from "@/app/_Components/leave/leaveUi";

export function exportLeaveToExcel(rows = []) {
  if (!rows.length) throw new Error("No leave records to export");

  const data = rows.map((r) => ({
    Employee: formatLeaveName(r.employeeId?.fullName),
    Designation: r.employeeId?.designation || "",
    "Leave Type": r.leaveTypeId?.name || "",
    Date: formatLeaveDate(r.fromDate),
    Days: r.days,
    "Half Day": r.halfDay ? "Yes" : "No",
    Reason: r.reason || "",
    Status: r.status,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leave Summary");
  XLSX.writeFile(wb, `leave-summary-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
