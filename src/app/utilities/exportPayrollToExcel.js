import * as XLSX from "xlsx-js-style";
import { money } from "@/app/_Components/payroll/payrollUi";

const HEADER_STYLES = {
  "Absent Deduction": {
    fill: { patternType: "solid", fgColor: { rgb: "ED7D31" } }, // orange
    font: { bold: true, color: { rgb: "FFFFFF" } },
  },
  "Half Day Deduction": {
    fill: { patternType: "solid", fgColor: { rgb: "5B9BD5" } }, // blue
    font: { bold: true, color: { rgb: "FFFFFF" } },
  },
  "Late Deduction": {
    fill: { patternType: "solid", fgColor: { rgb: "FFC000" } }, // yellow
    font: { bold: true, color: { rgb: "000000" } },
  },
  "Total Deduction": {
    fill: { patternType: "solid", fgColor: { rgb: "FF0000" } }, // red
    font: { bold: true, color: { rgb: "FFFFFF" } },
  },
  "Net Pay": {
    fill: { patternType: "solid", fgColor: { rgb: "70AD47" } }, // green
    font: { bold: true, color: { rgb: "FFFFFF" } },
  },
};

function applyHeaderColors(ws) {
  if (!ws["!ref"]) return;
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let c = range.s.c; c <= range.e.c; c += 1) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    const cell = ws[addr];
    if (!cell?.v) continue;
    const style = HEADER_STYLES[String(cell.v)];
    if (!style) continue;
    cell.s = {
      ...style,
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
    };
  }
}

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
  applyHeaderColors(ws);
  const COL_WIDTHS = {
    "#": 4,
    Employee: 12,
    Department: 10,
    "Basic Salary": 9,
    Allowances: 8,
    "Absent Count": 7,
    "Absent Deduction": 9,
    "Half Day Count": 7,
    "Half Day Deduction": 9,
    "Late Count": 7,
    "Late Deduction": 9,
    "Total Deduction": 9,
    Gross: 8,
    "Net Pay": 8,
    Status: 8,
  };
  ws["!cols"] = Object.keys(data[0]).map((key) => ({
    wch: COL_WIDTHS[key] ?? 8,
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Payroll");
  XLSX.writeFile(wb, `${filename}.xlsx`);
  return money(rows.reduce((s, r) => s + (r.netPay || 0), 0));
}
