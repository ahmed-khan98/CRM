import * as XLSX from "xlsx";
import { money } from "@/app/_Components/payroll/payrollUi";

export function exportPayrollToExcel(rows = [], filename = "payroll") {
  if (!rows.length) throw new Error("No payroll rows to export");
  const data = rows.map((r, i) => ({
    "#": i + 1,
    Employee: r.employeeName,
    Department: r.departmentName,
    "Basic Salary": r.basicSalary,
    Allowances: r.allowancesTotal,
    "Absent Count": Number(r.absentDays) || 0,
    "Absent Deduction": Number(r.absentDeduction) || 0,
    "Half Day Count": Number(r.halfDays) || 0,
    "Half Day Deduction": Number(r.halfDayDeduction) || 0,
    "Late Count": Number(r.lateDays) || 0,
    "Late Deduction": Number(r.lateDeduction) || 0,
    "Total Deduction": r.deductionsTotal,
    Gross: r.grossPay,
    "Net Pay": r.netPay,
    Status: r.status,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Payroll");
  XLSX.writeFile(wb, `${filename}.xlsx`);
  return money(rows.reduce((s, r) => s + (r.netPay || 0), 0));
}
