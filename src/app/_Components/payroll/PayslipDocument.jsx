"use client";

import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { money, monthLabel } from "./payrollUi";

const EMPTY = "-";

function display(value) {
  if (value == null) return EMPTY;
  const s = String(value).trim();
  if (!s || s === "—" || s === "–" || s === "â€”" || s === "â€“") return EMPTY;
  return s;
}

function payslipNet(entry) {
  const gross = Number(entry?.grossPay || 0);
  const deductions = Number(entry?.deductionsTotal || 0);
  return Math.max(0, Math.round(gross - deductions));
}

/** Prefer period month/year; ignore bare ObjectId on payrollRunId. */
export function resolvePayslipRun(entry, period) {
  const fromEntry =
    entry?.payrollRunId &&
    typeof entry.payrollRunId === "object" &&
    !Array.isArray(entry.payrollRunId)
      ? entry.payrollRunId
      : {};
  const fromPeriod =
    period && typeof period === "object" ? period : {};
  const month = Number(fromPeriod.month || fromEntry.month) || null;
  const year = Number(fromPeriod.year || fromEntry.year) || null;
  return {
    ...fromEntry,
    ...fromPeriod,
    month,
    year,
    cycleEndDay: fromPeriod.cycleEndDay || fromEntry.cycleEndDay || 25,
    periodStart: fromPeriod.periodStart || fromEntry.periodStart,
    periodEnd: fromPeriod.periodEnd || fromEntry.periodEnd,
  };
}

function buildRows(entry) {
  const absentCount = Number(entry.absentDays || 0);
  const halfCount = Number(entry.halfDays || 0);
  const lateCount = Number(entry.lateDays || 0);
  const earnings = [];
  if (Number(entry.basicSalary) > 0) {
    earnings.push(["Basic Salary", money(entry.basicSalary)]);
  }
  for (const a of entry.allowances || []) {
    if (Number(a.amount) > 0) earnings.push([a.name, money(a.amount)]);
  }
  earnings.push(["Gross Total", money(entry.grossPay)]);

  const deductions = [];
  if (Number(entry.tax) > 0) deductions.push(["Income Tax", money(entry.tax)]);
  if (Number(entry.pf) > 0) {
    deductions.push(["Provident Fund", money(entry.pf)]);
  }
  if (Number(entry.absentDeduction) > 0 || absentCount > 0) {
    deductions.push([
      `Absent Deduction (${absentCount} absent${absentCount === 1 ? "" : "s"})`,
      money(entry.absentDeduction),
    ]);
  }
  if (Number(entry.halfDayDeduction) > 0 || halfCount > 0) {
    deductions.push([
      `Half-day Deduction (${halfCount} half-day${halfCount === 1 ? "" : "s"})`,
      money(entry.halfDayDeduction),
    ]);
  }
  if (Number(entry.lateDeduction) > 0 || lateCount > 0) {
    deductions.push([
      `Late Deduction (${lateCount} late${lateCount === 1 ? "" : "s"})`,
      money(entry.lateDeduction),
    ]);
  }
  for (const d of entry.extraDeductions || []) {
    if (Number(d.amount) > 0) deductions.push([d.name, money(d.amount)]);
  }
  deductions.push(["Total Deductions", money(entry.deductionsTotal)]);
  return { earnings, deductions };
}

export default function PayslipDocument({
  entry,
  companyName = "Zytron World",
  period,
}) {
  if (!entry) return null;
  const run = resolvePayslipRun(entry, period);
  const monthTitle = monthLabel(run.month, run.year);
  const netPay = payslipNet(entry);
  const { earnings, deductions } = buildRows(entry);
  const payDate = entry.updatedAt
    ? new Date(entry.updatedAt).toLocaleDateString("en-GB")
    : EMPTY;

  return (
    <div
      id="payslip-print"
      data-payslip="1"
      className="rounded-xl border border-zinc-200 bg-white p-5 text-zinc-900"
    >
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{companyName}</h1>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Payslip
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-zinc-900">
            {monthTitle !== "—" ? monthTitle : "Month not set"}
          </p>
        </div>
      </div>

      <table className="mb-5 w-full border-collapse text-sm">
        <tbody>
          <tr className="border-b border-zinc-100">
            <td className="w-28 py-1.5 pr-3 text-zinc-500">Employee</td>
            <td className="py-1.5 font-medium capitalize">
              {display(entry.employeeName || entry.employeeId?.fullName)}
            </td>
          </tr>
          <tr className="border-b border-zinc-100">
            <td className="w-28 py-1.5 pr-3 text-zinc-500">Designation</td>
            <td className="py-1.5 font-medium">
              {display(entry.designation)}
            </td>
          </tr>
          <tr>
            <td className="w-28 py-1.5 pr-3 text-zinc-500">Department</td>
            <td className="py-1.5 font-medium">
              {display(
                entry.departmentName || entry.employeeId?.departmentId?.name
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PayslipTable title="Earnings" rows={earnings} />
        <PayslipTable title="Deductions" rows={deductions} />
      </div>

      <div className="mt-5 rounded-xl bg-zinc-900 px-4 py-3 text-white">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400">
          Net Pay
        </p>
        <p className="text-[11px] text-zinc-500">
          Gross {money(entry.grossPay)} − Deductions {money(entry.deductionsTotal)}
        </p>
        <p className="text-2xl font-semibold tabular-nums">{money(netPay)}</p>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">
        This is a system-generated payslip. Attendance deductions are calculated
        from existing attendance records. Payment date: {payDate}.
      </p>
    </div>
  );
}

function PayslipTable({ title, rows }) {
  return (
    <div>
      <h3 className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </h3>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-[11px] text-zinc-500">
            <th className="py-1.5 font-medium">Description</th>
            <th className="py-1.5 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value], i) => {
            const isTotal = i === rows.length - 1;
            return (
              <tr
                key={`${label}-${i}`}
                className={`border-b border-zinc-100 ${isTotal ? "font-semibold" : ""}`}
              >
                <td className="py-1.5">{label}</td>
                <td className="py-1.5 text-right tabular-nums">{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Download payslip as a real PDF attachment (no print dialog).
 */
export async function downloadPayslipPdf(entry) {
  const entryId = entry?._id || entry?.id;
  if (!entryId) {
    toast.error("Payslip not found");
    return;
  }
  try {
    const token = Cookies.get("token") || Cookies.get("accessToken") || null;
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const root = base.endsWith("/") ? base : `${base}/`;
    const res = await fetch(`${root}payroll/entries/${entryId}/pdf`, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      throw new Error(errBody?.message || "Could not download payslip");
    }
    const blob = await res.blob();
    if (!blob.size || blob.type?.includes("text/html")) {
      throw new Error("Invalid payslip file");
    }
    let filename = "payslip.pdf";
    const cd = res.headers.get("Content-Disposition") || "";
    const m = cd.match(/filename="?([^"]+)"?/i);
    if (m?.[1]) filename = m[1];

    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 60_000);
    toast.success("Download started");
  } catch (err) {
    toast.error(err?.message || "Could not download payslip");
  }
}

/**
 * Opens a print-ready professional payslip (tables + month).
 * Pass entry (+ optional period) so month is never missing.
 */
export function printPayslip(entry, period, companyName = "Zytron World") {
  const data =
    entry ||
    (typeof document !== "undefined"
      ? null
      : null);

  // Prefer explicit entry; fall back to reading visible payslip if caller used old signature
  if (!data && typeof document !== "undefined") {
    // legacy: printPayslip() with no args — still print current DOM with styles
    const node = document.getElementById("payslip-print");
    if (!node) return;
    openPrintWindow(buildPrintHtmlFromDom(node));
    return;
  }

  if (!data) return;
  openPrintWindow(buildPrintHtml(data, period, companyName));
}

function openPrintWindow(html) {
  const win = window.open("", "_blank", "width=900,height=1000");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    try {
      win.print();
    } catch {
      /* ignore */
    }
  }, 250);
}

function buildPrintHtmlFromDom(node) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Payslip</title>
  <style>${PRINT_CSS}</style></head><body>${node.outerHTML}</body></html>`;
}

function buildPrintHtml(entry, period, companyName) {
  const run = resolvePayslipRun(entry, period);
  const monthTitle = monthLabel(run.month, run.year);
  const name = display(entry.employeeName || entry.employeeId?.fullName);
  const netPay = payslipNet(entry);
  const { earnings, deductions } = buildRows(entry);
  const monthShow = monthTitle !== "—" ? monthTitle : "-";

  const rowHtml = (rows) =>
    rows
      .map(
        ([label, value], i) =>
          `<tr class="${i === rows.length - 1 ? "total" : ""}"><td>${escapeHtml(
            label
          )}</td><td class="amt">${escapeHtml(value)}</td></tr>`
      )
      .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Payslip - ${escapeHtml(monthShow)}</title>
  <style>${PRINT_CSS}</style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <h1>${escapeHtml(companyName)}</h1>
        <div class="badge">PAYSLIP</div>
      </div>
      <div class="header-right">
        <div class="month">${escapeHtml(monthShow)}</div>
      </div>
    </div>

    <table class="meta">
      <tr>
        <td class="label">Employee</td>
        <td>${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td class="label">Designation</td>
        <td>${escapeHtml(display(entry.designation))}</td>
      </tr>
      <tr>
        <td class="label">Department</td>
        <td>${escapeHtml(
          display(entry.departmentName || entry.employeeId?.departmentId?.name)
        )}</td>
      </tr>
    </table>

    <div class="cols">
      <div>
        <h3>Earnings</h3>
        <table class="grid"><thead><tr><th>Description</th><th>Amount</th></tr></thead>
        <tbody>${rowHtml(earnings)}</tbody></table>
      </div>
      <div>
        <h3>Deductions</h3>
        <table class="grid"><thead><tr><th>Description</th><th>Amount</th></tr></thead>
        <tbody>${rowHtml(deductions)}</tbody></table>
      </div>
    </div>

    <div class="net">
      <div class="net-label">Net Pay (Gross − Total Deductions)</div>
      <div class="net-calc">${escapeHtml(money(entry.grossPay))} − ${escapeHtml(
    money(entry.deductionsTotal)
  )}</div>
      <div class="net-amt">${escapeHtml(money(netPay))}</div>
    </div>

    <p class="foot">This is a system-generated payslip. Attendance deductions are calculated from existing attendance records.</p>
  </div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PRINT_CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; font-family: system-ui, -apple-system, Segoe UI, sans-serif; color: #18181b; background: #fff; }
  .sheet { max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #18181b; padding-bottom: 12px; margin-bottom: 16px; }
  h1 { margin: 0; font-size: 20px; }
  .badge { font-size: 10px; letter-spacing: 0.2em; color: #71717a; margin-top: 4px; }
  .header-right { text-align: right; }
  .month { font-size: 15px; font-weight: 700; }
  .cycle { font-size: 12px; color: #71717a; margin-top: 2px; }
  table.meta { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
  table.meta td { padding: 6px 8px; border-bottom: 1px solid #f4f4f5; vertical-align: top; }
  table.meta .label { color: #71717a; width: 90px; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  h3 { margin: 0 0 8px; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #71717a; }
  table.grid { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.grid th, table.grid td { padding: 7px 6px; border-bottom: 1px solid #e4e4e7; }
  table.grid th { text-align: left; color: #71717a; font-weight: 600; font-size: 11px; }
  table.grid td.amt, table.grid th:last-child { text-align: right; }
  table.grid tr.total td { font-weight: 700; border-top: 1px solid #18181b; }
  .net { margin-top: 20px; background: #18181b; color: #fff; border-radius: 12px; padding: 14px 16px; }
  .net-label { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #a1a1aa; }
  .net-calc { font-size: 12px; color: #a1a1aa; margin-top: 2px; }
  .net-amt { font-size: 26px; font-weight: 700; margin-top: 4px; }
  .foot { margin-top: 16px; font-size: 11px; color: #a1a1aa; }
  @media print { body { padding: 0; } }
`;
